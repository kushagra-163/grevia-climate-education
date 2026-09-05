# Grevia System Architecture & Data Flow

## System Overview

```
                          +------------------------+
                          |   React Web Frontend   |
                          |  (Vite, Zustand, TS)   |
                          +-----------+------------+
                                      | HTTP / REST
                                      v
                          +------------------------+
                          |    Backend REST API    |
                          |   (Express + Mongoose) |
                          +-----+-----+------+-----+
                                |     |      |
             +------------------+     |      +------------------+
             |                        |                         |
             v                        v                         v
+------------------------+  +-------------------+  +------------------------+
|    AI Microservice     |  | Climate Ingestion |  | MongoDB & Redis Layer  |
|  (Eco-Coach + LLM)     |  |   NASA Data Worker|  | (Ledger, Users, Quiz)  |
+------------------------+  +-------------------+  +------------------------+
```

## Architectural Highlights

1. **Monorepo Architecture**: Managed via npm workspaces separating `frontend/web`, `backend/api`, `backend/ai`, and `backend/workers`.
2. **Adaptive Quiz Engine**: Evaluates recent average percentage and response times to dynamically increase or decrease difficulty.
3. **Points Ledger**: Every eco-action, quiz completion, and mission reward creates an immutable ledger entry before updating user points.
4. **Resilient Provider Fallbacks**: Both NASA Climate data feeds and OpenAI LLM endpoints include deterministic mock fallbacks so the app runs smoothly in offline or unconfigured environments.
