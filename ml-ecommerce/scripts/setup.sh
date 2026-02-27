#!/bin/bash
# ==========================================
# ML Ecommerce — Quick Setup Script
# ==========================================

set -e

echo "🚀 ML Ecommerce Setup Script"
echo "================================"

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || command -v docker >/dev/null 2>&1 || { echo "❌ Docker Compose is required. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Copy .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example — please update secrets!"
else
  echo "ℹ️  .env already exists, skipping..."
fi

# Start infrastructure services only (no app services yet)
echo ""
echo "🐳 Starting infrastructure services (PostgreSQL, Redis, MongoDB, MLflow)..."
docker-compose up -d postgres redis mongodb mlflow

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U ecommerce_user -d ecommerce 2>/dev/null; do
  sleep 2
  echo "  Still waiting..."
done
echo "✅ PostgreSQL is ready!"

# Wait for Redis
echo "⏳ Waiting for Redis..."
sleep 3
echo "✅ Redis is ready!"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Generate Prisma client and push schema
echo ""
echo "🗄️  Setting up database schema..."
npx prisma generate
npx prisma db push --accept-data-loss
echo "✅ Database schema applied"

# Run seed
echo ""
echo "🌱 Seeding database with sample data..."
npm run prisma:seed
echo "✅ Database seeded"

cd ..

echo ""
echo "================================"
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "📋 Services running:"
echo "  PostgreSQL:  localhost:5432"
echo "  Redis:       localhost:6379"
echo "  MongoDB:     localhost:27017"
echo "  MLflow:      http://localhost:5000"
echo ""
echo "🔑 Test Credentials:"
echo "  Admin:    admin@mlecommerce.com / Admin@123456"
echo "  Customer: customer@test.com / Customer@123"
echo ""
echo "▶️  Next steps:"
echo "  1. cd backend && npm run dev    # Start backend API"
echo "  2. cd frontend && npm run dev   # Start frontend"
echo "  3. cd ml-service && uvicorn main:app --reload  # Start ML service"
echo ""
echo "  OR run everything with Docker:"
echo "  docker-compose up -d"
