# 🚀 IntelliCore ML Ecommerce — System v2.0

> AI-powered ecommerce platform with personalized recommendations, community features, and enterprise-grade architecture.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Services](#services)
- [API Documentation](#api-documentation)
- [ML System](#ml-system)
- [Security](#security)
- [Monitoring](#monitoring)
- [Deployment](#deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    IntelliCore Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Next.js 14  │    │  Express API │    │  FastAPI ML  │  │
│  │  Frontend    │◄──►│  Backend     │◄──►│  Service     │  │
│  │  :3000       │    │  :4000       │    │  :8001       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                              │                              │
│              ┌───────────────┼───────────────┐             │
│              ▼               ▼               ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   MongoDB    │     │
│  │  :5432       │  │  :6379       │  │  :27017      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   MLflow     │    │  Prometheus  │    │   Grafana    │  │
│  │  :5000       │    │  :9090       │    │  :3001       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🛍️ E-Commerce
- **Product Catalog** — Categories, brands, variants, rich attributes
- **Smart Search** — Full-text search with filters and sorting
- **Shopping Cart** — Persistent cart with session sync
- **Wishlist** — Save products for later
- **Checkout** — Multi-step checkout with address management
- **Orders** — Full order lifecycle management
- **Coupons & Flash Sales** — Promotional system
- **Inventory Management** — Stock tracking with audit logs

### 💳 Payments
- **Stripe Integration** — Credit/debit cards, Apple Pay, Google Pay
- **PayPal** — Alternative payment method
- **Cash on Delivery** — Traditional payment option
- **Refunds** — Automated refund processing via Stripe webhooks

### 🤖 AI/ML System
- **Collaborative Filtering** — User-based recommendations
- **Content-Based Filtering** — TF-IDF product similarity
- **Hybrid Recommendations** — Weighted combination of strategies
- **Trending Products** — Real-time popularity tracking with time decay
- **Behavioral Personalization** — Click, view, purchase signals
- **AI Chatbot** — FAQ + product recommendation via NLP
- **MLflow Tracking** — Model versioning and experiment tracking

### 👥 Community
- **Social Feed** — Share shopping experiences and reviews
- **Forum** — Discussion threads by category
- **Challenges** — Shopping challenges with prizes
- **Leaderboard** — Points-based ranking system
- **Follow System** — Follow friends and influencers
- **Notifications** — Real-time activity notifications

### 🔐 Security
- **JWT Authentication** — Access + refresh token rotation
- **Two-Factor Authentication (2FA)** — TOTP via Google Authenticator
- **RBAC** — Role-based access control (customer/staff/admin/superadmin)
- **Rate Limiting** — Per-IP request throttling
- **Helmet.js** — Security headers
- **Input Validation** — express-validator + Zod
- **Login History** — Track all login attempts

### 📊 Admin Dashboard
- **Revenue Analytics** — Charts, trends, period comparison
- **User Management** — RBAC, activation, role assignment
- **Order Management** — Status updates, filtering, export
- **Inventory Alerts** — Low stock notifications
- **ML Performance** — Recommendation conversion rates
- **Content Moderation** — Review and post approval
- **System Health** — Real-time service monitoring

### 🌍 Internationalization
- **Multi-language** — i18next (EN, VI, ZH, JA, KO)
- **Multi-currency** — USD, EUR, GBP, VND, JPY
- **Locale-aware** — Date, number, currency formatting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand, React Query |
| **Backend** | Node.js 20, Express.js, Prisma ORM, Socket.io |
| **ML Service** | Python 3.11, FastAPI, scikit-learn, PyTorch, Transformers |
| **Primary DB** | PostgreSQL 15 |
| **Cache/Queue** | Redis 7 |
| **Event Store** | MongoDB 7 |
| **ML Tracking** | MLflow 2.10 |
| **Payments** | Stripe, PayPal |
| **Monitoring** | Prometheus, Grafana |
| **Container** | Docker, Docker Compose |
| **Auth** | JWT, 2FA (TOTP/speakeasy) |

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for ML service development)

### 1. Clone & Configure

```bash
git clone <repo-url>
cd ml-ecommerce
cp .env.example .env
# Edit .env with your values
```

### 2. Start All Services

```bash
docker-compose up -d
```

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec backend npx prisma migrate dev

# Seed sample data
docker-compose exec backend npm run prisma:seed
```

### 4. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | — |
| Backend API | http://localhost:4000 | — |
| API Docs | http://localhost:4000/api/docs | — |
| ML Service | http://localhost:8001/docs | — |
| MLflow | http://localhost:5000 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | admin/admin123 |

---

## 📡 Services

### Frontend (Next.js 14)
- **Port**: 3000
- **Features**: Dark mode, responsive, PWA-ready
- **Key Pages**:
  - `/` — Home with AI recommendations
  - `/products` — Product catalog with filters
  - `/products/[slug]` — Product detail with reviews
  - `/cart` — Shopping cart
  - `/checkout` — Multi-step checkout
  - `/dashboard` — User dashboard
  - `/admin` — Admin panel (admin only)
  - `/community` — Social features
  - `/notifications` — Notification center

### Backend API (Express.js)
- **Port**: 4000
- **Key Endpoints**:
  - `POST /api/auth/register` — User registration
  - `POST /api/auth/login` — Login with optional 2FA
  - `POST /api/2fa/setup` — Setup 2FA
  - `GET /api/products` — Product listing
  - `GET /api/recommendations/for-you` — Personalized recs
  - `POST /api/payments/create-intent` — Stripe payment
  - `POST /api/chatbot/message` — AI chatbot
  - `GET /api/community/posts` — Community feed
  - `GET /api/admin/analytics` — Admin analytics

### ML Service (FastAPI)
- **Port**: 8001
- **Endpoints**:
  - `GET /recommendations/for-you` — Personalized
  - `GET /recommendations/trending` — Trending products
  - `GET /recommendations/similar/{id}` — Similar items
  - `POST /recommendations/chatbot` — NLP product search
  - `POST /training/trigger` — Trigger model retraining
  - `GET /health` — Service health

---

## 🤖 ML System

### Recommendation Strategies

| Strategy | Weight | Description |
|----------|--------|-------------|
| Collaborative Filtering | 35% | User-item matrix similarity |
| Content-Based | 25% | TF-IDF product features |
| Trending | 20% | Time-decayed popularity |
| Behavioral | 15% | Click/view/purchase signals |
| Deep Learning | 5% | Neural collaborative filtering |

### Training Pipeline
1. Extract interactions from PostgreSQL
2. Build user-item matrix with event weights
3. Apply time decay to older interactions
4. Train TF-IDF on product text features
5. Compute similarity matrices
6. Log metrics to MLflow
7. Deploy best model to production

---

## 🔐 Security

### Authentication Flow
```
Login → Check 2FA → Generate JWT (15min) + Refresh (7d)
     ↓
2FA Enabled? → Verify TOTP → Issue full tokens
     ↓
2FA Disabled? → Issue tokens directly
```

### RBAC Roles
| Role | Permissions |
|------|-------------|
| `customer` | Browse, buy, review, community |
| `staff` | + Inventory management |
| `admin` | + User management, analytics, moderation |
| `superadmin` | Full access |

---

## 📊 Monitoring

### Metrics Collected
- **API**: Request rate, latency, error rate
- **ML**: Recommendation latency, model accuracy
- **DB**: Query time, connection pool
- **System**: CPU, memory, disk

### Grafana Dashboards
- IntelliCore Overview
- API Performance
- ML Service Metrics
- Database Health
- Business KPIs

---

## 🚢 Deployment

### Production with Docker

```bash
# Build production images
docker-compose -f docker-compose.yml --profile production up -d

# Scale services
docker-compose up -d --scale backend=3 --scale ml-service=2
```

### Environment Variables
See `.env.example` for all required variables.

### SSL/TLS
Configure Nginx with SSL certificates in `./nginx/ssl/`.

---

## 📁 Project Structure

```
ml-ecommerce/
├── frontend/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── checkout/    # Checkout flow
│   │   │   ├── community/   # Community features
│   │   │   ├── dashboard/   # User dashboard
│   │   │   └── notifications/
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities
│   │   └── store/           # Zustand stores
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, rate limiting
│   │   └── config/          # DB, Redis, Logger
│   └── prisma/              # Schema & migrations
├── ml-service/               # FastAPI ML service
│   ├── routers/             # API endpoints
│   ├── services/            # ML logic
│   └── models/              # Saved models
├── monitoring/               # Prometheus & Grafana
│   ├── prometheus.yml
│   └── grafana/
├── scripts/                  # DB init scripts
└── docker-compose.yml
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ by the IntelliCore Team*
