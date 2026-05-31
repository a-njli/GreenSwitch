# EcoSwap Learning Guide — Master Every Technology for Interviews

This guide teaches you **what** each piece does, **why** we chose it, and **how to explain it** in system design / ML / backend interviews.

---

## 1. The Big Picture (30-second pitch)

> "EcoSwap is an AI sustainable shopping assistant. Users describe disposable products they use. A multi-agent pipeline powered by Gemini analyzes intent, retrieves relevant products from a vector database via RAG, recommends eco alternatives, and validates carbon savings. Responses are cached in Redis for speed, async jobs go through Celery, and a Next.js dashboard tracks carbon impact and API performance in real time. Everything runs in Docker and deploys to Render."

---

## 2. FastAPI (REST API layer)

### What it is
A modern Python web framework for building APIs with automatic OpenAPI docs, type hints, and async support.

### Where in EcoSwap
- Entry: `backend/app/main.py`
- Routes: `backend/app/api/routes.py`
- Schemas: `backend/app/models/schemas.py`

### Key concepts to know
- **Pydantic models** validate request/response JSON automatically
- **Dependency injection** via FastAPI's `Depends()` (we use settings singleton)
- **Lifespan events** seed the vector DB on startup
- **CORS middleware** allows the Next.js frontend to call the API

### Interview answer
> "I used FastAPI because it gives us typed contracts with Pydantic, auto-generated Swagger docs at `/docs`, and high throughput for I/O-bound AI calls. Each endpoint maps to a service layer, keeping routes thin."

---

## 3. Google Gemini API

### What it is
Google's generative AI models. We use:
- **gemini-2.0-flash** — fast text generation for agents
- **text-embedding-004** — converts text to vectors for search

### Where in EcoSwap
- Embeddings: `app/rag/vector_store.py`
- Generation: `app/rag/pipeline.py`, `app/agents/graph.py`

### Key concepts
- **Embeddings** = numerical representation of meaning (1536-dim vectors)
- **Prompt engineering** = structured prompts with JSON output format
- **Temperature** (default) — we use low-structure prompts for consistent JSON

### Interview answer
> "Gemini serves dual roles: embedding model for semantic product search, and LLM for reasoning across agents. Flash variant keeps latency low for real-time recommendations."

---

## 4. RAG (Retrieval-Augmented Generation)

### What it is
Instead of relying on the LLM's memory, we **retrieve** relevant documents from a database and **augment** the prompt with that context before generation.

### Why RAG here?
Our product catalog is structured and finite. RAG ensures recommendations are **grounded in real product data**, not hallucinated products.

### Pipeline in EcoSwap
```
1. Seed catalog → embed each product → store in ChromaDB
2. User query → embed query → cosine similarity search → top-k docs
3. Retrieved docs + user query → Gemini → structured JSON recommendations
```

### Where
- `app/rag/vector_store.py` — ChromaDB + embeddings
- `app/rag/pipeline.py` — retrieve + generate

### Interview answer
> "RAG reduces hallucination by grounding the LLM in our product catalog. We embed products once, store in ChromaDB, and at query time retrieve the top-k semantically similar items before asking Gemini to recommend swaps."

---

## 5. ChromaDB (Vector Database)

### What it is
An open-source embedding database. Stores vectors + metadata + original text.

### Key concepts
- **Collection** — like a table of embeddings
- **Cosine similarity** — measures angle between vectors (closer = more similar)
- **HNSW index** — approximate nearest neighbor search (fast at scale)
- **Persistent client** — data survives restarts (`CHROMA_PERSIST_DIR`)

### Interview answer
> "ChromaDB gives us local persistent vector storage without managing a separate Pinecone/Qdrant cluster for a portfolio project. For production scale I'd evaluate managed vector DBs with hybrid search."

---

## 6. Multi-Agent AI with LangGraph

### What it is
**LangGraph** orchestrates multiple AI agents as a **state machine / graph**. Each node is an agent step; state flows between them.

### Our 4 agents

| Agent | Role |
|-------|------|
| **Research Agent** | Parses user intent, extracts product categories |
| **Retrieval Agent** | Runs RAG vector search with augmented query |
| **Recommendation Agent** | Picks best eco swaps from retrieved context |
| **Carbon Analyst Agent** | Validates and enriches carbon savings narrative |

### Flow
```
Research → Retrieval → Recommend → Carbon Analyst → END
```

### Why multi-agent vs single prompt?
- **Separation of concerns** — each agent has a focused task
- **Observability** — `agent_trace` shows what each step did
- **Interview story** — demonstrates orchestration, not just one API call

### Where
`backend/app/agents/graph.py`

### Interview answer
> "I used LangGraph to model a pipeline of specialized agents. Research understands intent, Retrieval grounds us in catalog data, Recommendation selects swaps, and Carbon Analyst validates environmental impact. This is more maintainable than one mega-prompt and gives us traceability for debugging."

---

## 7. Redis (Caching + Analytics)

### Two use cases in EcoSwap

**A. Response caching**
- Key = SHA256(query + use_agents flag)
- TTL = 1 hour
- Avoids re-running expensive AI pipeline for duplicate queries

**B. Real-time metrics**
- Counters: `total_queries`, `cache_hits`, `cache_misses`, `total_carbon_saved_kg`, `total_latency_ms`
- List: `activity:recent` — last 50 queries for dashboard

### Where
- `app/core/redis_client.py`
- `app/services/swap_service.py`

### Interview answer
> "Redis serves dual purpose: cache layer to cut AI latency on repeated queries, and in-memory analytics counters for the dashboard without hitting a SQL DB on every request."

---

## 8. Celery (Queue-Based Processing)

### What it is
Distributed task queue. API enqueues jobs; workers process them asynchronously.

### Why use it?
- **Decoupling** — API returns immediately with `task_id`
- **Resilience** — workers can restart independently
- **Scale** — add more workers under load

### Flow
```
POST /swap/async → Celery task queued in Redis broker
Worker picks up task → runs same swap pipeline → stores result in Redis backend
GET /swap/async/{task_id} → poll result
```

### Where
- `app/workers/celery_app.py`

### Interview answer
> "For long-running AI pipelines, the sync endpoint blocks the client. Celery lets us queue swap jobs, return a task ID immediately, and scale worker processes independently — improving API responsiveness and system resilience."

---

## 9. Next.js Frontend + Analytics Dashboard

### Stack
- **Next.js 15** App Router — React server/client components
- **Tailwind CSS** — utility-first styling
- **Recharts** — bar chart for category distribution

### Features
- Natural language swap form
- Toggle multi-agent vs simple RAG
- Agent trace visualization
- Carbon saved metrics
- Real-time analytics from Redis

### Interview answer
> "The frontend is a Next.js app that calls our REST API. The analytics dashboard polls `/api/v1/analytics` to show carbon tracking and cache performance — demonstrating full-stack ownership."

---

## 10. Docker & Render (Deployment)

### Docker Compose services
| Service | Purpose |
|---------|---------|
| `redis` | Cache + Celery broker |
| `api` | FastAPI server |
| `worker` | Celery worker |

### Render blueprint (`render.yaml`)
- Web service (API)
- Background worker (Celery)
- Managed Redis

### Interview answer
> "I containerized the API and worker with Docker for reproducible environments. Render runs the web service, background worker, and managed Redis — giving us production-like deployment without managing Kubernetes for a portfolio project."

---

## 11. Common Interview Questions & Answers

### "Why RAG instead of fine-tuning?"
> "Our catalog is small and changes frequently. RAG lets us update products without retraining. Fine-tuning would make sense at scale with stable recommendation patterns."

### "How do you handle hallucinations?"
> "RAG grounds responses in retrieved catalog entries. We constrain output to JSON with specific product IDs from context. Agents validate against our structured catalog before returning."

### "How would you scale this?"
> "Horizontal scaling: more API replicas behind a load balancer, more Celery workers, Redis Cluster, migrate ChromaDB to Pinecone/Qdrant with sharding. Add rate limiting and request queuing at peak."

### "What's the latency bottleneck?"
> "Gemini API calls — we run 4 in multi-agent mode. Mitigations: Redis caching, async Celery path, parallel agent calls (future), simpler RAG-only mode toggle."

### "How do you monitor production?"
> "Health endpoint checks Redis + vector store. Redis tracks query count, latency, cache hit rate. Would add OpenTelemetry + Grafana in production."

---

## 12. Suggested Learning Order

1. **Run the project locally** — see it work end-to-end
2. **Read `app/api/routes.py`** — understand API surface
3. **Trace a request through `swap_service.py`** — cache → agents → response
4. **Study `vector_store.py`** — understand embeddings
5. **Walk through `agents/graph.py`** — multi-agent flow
6. **Open `/docs`** — try API calls manually
7. **Toggle `use_agents: false`** — compare simple RAG vs multi-agent
8. **Read Redis keys** — `redis-cli MONITOR` while using the app
9. **Deploy to Render** — complete the story

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Embedding** | Vector representing text meaning |
| **Vector DB** | Database optimized for similarity search |
| **RAG** | Retrieve docs + augment LLM prompt |
| **Agent** | LLM with a specific role/tool access |
| **LangGraph** | Framework for agent workflow graphs |
| **Celery** | Python distributed task queue |
| **TTL** | Time-to-live for cache expiration |
| **Cosine similarity** | Vector similarity metric (0–1) |

---

You built this. Walk through the code, run it, break things, fix them — that's how you'll own every interview question.
