# ML Ecommerce — AI-Powered Shopping Platform

A full-stack e-commerce platform with machine learning-powered product recommendations, built with Node.js, Next.js, FastAPI, and multiple databases.

## 🏗️ Architecture

```text
ml-ecommerce/
├── backend/          # Node.js/Express REST API
├── frontend/         # Next.js 14 (App Router) + TypeScript
├── ml-service/       # FastAPI Python ML recommendation engine
├── monitoring/       # Prometheus + Grafana
├── scripts/          # Database initialization scripts
└── docker-compose.yml
```

## 🚀 Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Zustand, React Query |
| **Backend API** | Node.js, Express, Prisma ORM |
| **ML Service** | FastAPI, Python, scikit-learn, implicit (ALS) |
| **Primary DB** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Event Store** | MongoDB 7 |
| **ML Tracking** | MLflow |
| **Monitoring** | Prometheus + Grafana |
| **Container** | Docker + Docker Compose |

## 🤖 ML Features

- **Collaborative Filtering** — ALS (Alternating Least Squares) for personalized user recommendations
- **Content-Based Filtering** — Item feature vectors with cosine similarity for similar products
- **Popularity-Based** — Fallback for cold-start users
- **Event Tracking** — User behavior events (views, cart adds, purchases) stored in MongoDB for model training
- **MLflow Integration** — Model versioning and experiment tracking

## 📦 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local ML development)

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start all services

```bash
docker-compose up -d
```

### 3. Run database migrations

```bash
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run prisma:seed
```

### 4. Access the application

| Service | URL |
| --- | --- |
| Frontend | <http://localhost:3000> |
| Backend API | <http://localhost:4000> |
| ML Service | <http://localhost:8001> |
| MLflow | <http://localhost:5000> |
| Prometheus | <http://localhost:9090> |
| Grafana | <http://localhost:3001> |

## 🔌 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Products

```text
GET  /api/products          # List with filters & pagination
GET  /api/products/featured
GET  /api/products/search?q=
GET  /api/products/:slug
POST /api/products          # Admin only
PUT  /api/products/:id      # Admin only
```

### Recommendations

```text
GET  /api/recommendations/for-you       # Personalized (CF)
GET  /api/recommendations/similar/:id   # Content-based
GET  /api/recommendations/trending
GET  /api/recommendations/frequently-bought/:id
POST /api/recommendations/track         # Track user events
```

### Orders & Cart

```text
GET  /api/cart
POST /api/cart/items
PUT  /api/cart/items/:id
DELETE /api/cart/items/:id

GET  /api/orders
POST /api/orders
GET  /api/orders/:id
PATCH /api/orders/:id/cancel
```

## 🧠 ML Service Endpoints

```text
GET  /health
GET  /recommendations/user?user_id=&limit=
GET  /recommendations/similar?product_id=&limit=
GET  /recommendations/frequently-bought?product_id=
GET  /recommendations/popular?category_id=
POST /training/trigger
GET  /training/status
```

## 📊 Database Schema

The PostgreSQL schema includes:

- **Users** — Authentication, roles (customer/staff/admin/superadmin)
- **Products** — Catalog with categories, brands, variants, images
- **Orders** — Full order lifecycle with status tracking
- **Cart** — Persistent shopping cart
- **Reviews** — Product reviews with approval workflow
- **Coupons** — Discount codes (percentage/fixed)
- **UserEvents** — ML training data (views, clicks, purchases)
- **RecommendationLogs** — Track recommendation performance

## 🔧 Development

### Backend

```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Train ML Models

```bash
curl -X POST http://localhost:8001/training/trigger
```

## 📈 Monitoring

- **Prometheus** scrapes metrics from backend (`/metrics`) and ML service
- **Grafana** dashboards at <http://localhost:3001> (admin/admin123)
- Backend exposes `prom-client` metrics with `ml_ecommerce_` prefix

## 🔒 Security

- JWT access tokens (15min) + refresh tokens (7 days)
- bcrypt password hashing (12 rounds)
- Helmet.js security headers
- CORS configured for frontend origin
- Rate limiting: 200 req/15min general, 20 req/15min for auth
- Input validation with express-validator

## 📝 Environment Variables

See [`.env.example`](.env.example) for all required configuration.

Key variables:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret (min 32 chars)
- `ML_SERVICE_URL` — ML service URL for backend
