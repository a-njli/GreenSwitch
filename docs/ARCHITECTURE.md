# EcoSwap Architecture

## Request flow (sync)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Next.js
    participant A as FastAPI
    participant R as Redis
    participant V as ChromaDB
    participant G as Gemini
    participant LG as LangGraph Agents

    U->>F: Enter disposable product query
    F->>A: POST /api/v1/swap
    A->>R: Check cache
    alt Cache hit
        R-->>A: Cached response
    else Cache miss
        A->>LG: Run agent pipeline
        LG->>G: Research Agent
        LG->>V: Retrieval Agent (RAG)
        LG->>G: Recommendation Agent
        LG->>G: Carbon Analyst
        LG-->>A: Recommendations + trace
        A->>R: Store cache + metrics
    end
    A-->>F: SwapResponse JSON
    F-->>U: Recommendations + carbon saved
```

## Agent graph

```mermaid
flowchart LR
    A[Research Agent] --> B[Retrieval Agent]
    B --> C[Recommendation Agent]
    C --> D[Carbon Analyst]
    D --> E[Response]
```

## Data stores

| Store | Data | Purpose |
|-------|------|---------|
| ChromaDB | Product embeddings | Semantic search (RAG) |
| Redis DB 0 | Cache + metrics | Performance + analytics |
| Redis DB 1 | Celery broker | Task queue |
| Redis DB 2 | Celery results | Async job results |
| In-memory catalog | Product JSON | Source of truth for IDs |

## Deployment topology (Render)

```
                    ┌─────────────┐
                    │  Next.js    │  (Vercel or Render static)
                    │  Frontend   │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────┐
                    │  FastAPI    │  Render Web Service
                    │  (Docker)   │
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌─────▼─────┐
       │ Celery      │ │ Redis │ │ ChromaDB  │
       │ Worker      │ │       │ │ (volume)  │
       └─────────────┘ └───────┘ └───────────┘
```
