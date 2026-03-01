#!/bin/bash
# ==========================================
# IntelliCore - Start All Services (Linux/Mac)
# Requires: Node.js, Python, Docker (optional)
# ==========================================

echo "========================================"
echo "IntelliCore - Starting All Services"
echo "========================================"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        echo "[Option 1] Docker detected. Starting with Docker Compose..."
        echo ""
        docker-compose up -d
        echo ""
        echo "Services started! Access:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend:  http://localhost:4000"
        echo "  - ML Service: http://localhost:8001"
        echo "  - MLflow: http://localhost:5000"
        echo "  - Prometheus: http://localhost:9090"
        echo "  - Grafana: http://localhost:3001"
        exit 0
    fi
fi

# Option 2: Local development without Docker
echo "[Option 2] Starting local development..."
echo ""

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > backend/.env << EOF
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://ecommerce_user:ecommerce_pass@localhost:5432/ecommerce
MONGODB_URI=mongodb://mongo_user:mongo_pass@localhost:27017/ecommerce_events?authSource=admin
REDIS_URL=redis://:redis_pass@localhost:6379
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
ML_SERVICE_URL=http://localhost:8001
FRONTEND_URL=http://localhost:3000
EOF
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ML_URL=http://localhost:8001
EOF
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

# Check Python
if ! command -v python &> /dev/null; then
    echo "[ERROR] Python not found. Please install from https://python.org"
    exit 1
fi

# Start services in background
echo "Starting Backend (Port 4000)..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "Starting ML Service (Port 8001)..."
cd ml-service
if [ -d "venv" ]; then
    source venv/bin/activate
fi
uvicorn main:app --reload --port 8001 &
ML_PID=$!
cd ..

echo "Starting Frontend (Port 3000)..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "All services starting!"
echo "========================================"
echo ""
echo "Please ensure these services are running:"
echo "  - PostgreSQL on port 5432"
echo "  - MongoDB on port 27017"
echo "  - Redis on port 6379"
echo ""
echo "Access URLs:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:4000"
echo "  - ML Service: http://localhost:8001"
echo "  - API Docs: http://localhost:4000/api/docs"
echo ""
echo "PIDs: Backend=$BACKEND_PID ML=$ML_PID Frontend=$FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for all background processes
wait
