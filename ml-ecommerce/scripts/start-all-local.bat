@echo off
REM ==========================================
REM IntelliCore - Start All Services (Local Development)
REM Requires: Node.js, Python, PostgreSQL, Redis, MongoDB
REM ==========================================

echo ========================================
echo IntelliCore - Starting All Services
echo ========================================
echo.

REM Check if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Option 1] Docker detected. Starting with Docker Compose...
    echo.
    docker-compose up -d
    echo.
    echo Services started! Access:
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:4000
    echo   - ML Service: http://localhost:8001
    echo   - MLflow: http://localhost:5000
    echo   - Prometheus: http://localhost:9090
    echo   - Grafana: http://localhost:3001
    goto :end
)

REM Option 2: Local development without Docker
echo [Option 2] Starting local development...
echo.

REM Create .env files if they don't exist
if not exist backend\.env (
    echo Creating backend .env file...
    (
        echo NODE_ENV=development
        echo PORT=4000
        echo DATABASE_URL=postgresql://ecommerce_user:ecommerce_pass@localhost:5432/ecommerce
        echo MONGODB_URI=mongodb://mongo_user:mongo_pass@localhost:27017/ecommerce_events^?authSource=admin
        echo REDIS_URL=redis://:redis_pass@localhost:6379
        echo JWT_SECRET=your_super_secret_jwt_key_change_in_production
        echo JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
        echo ML_SERVICE_URL=http://localhost:8001
        echo FRONTEND_URL=http://localhost:3000
    ) > backend\.env
)

if not exist frontend\.env.local (
    echo Creating frontend .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:4000
        echo NEXT_PUBLIC_ML_URL=http://localhost:8001
    ) > frontend\.env.local
)

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org
    goto :error
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found. Please install Python from https://python.org
    goto :error
)

echo Starting Backend (Port 4000)...
cd backend
start "IntelliCore Backend" cmd /k "npm run dev"
cd ..

echo Starting ML Service (Port 8001)...
cd ml-service
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    start "IntelliCore ML Service" cmd /k "uvicorn main:app --reload --port 8001"
) else (
    echo [WARNING] Virtual environment not found. Using system Python...
    start "IntelliCore ML Service" cmd /k "uvicorn main:app --reload --port 8001"
)
cd ..

echo Starting Frontend (Port 3000)...
cd frontend
start "IntelliCore Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo All services starting!
echo ========================================
echo.
echo Please ensure these services are running:
echo   - PostgreSQL on port 5432
echo   - MongoDB on port 27017
echo   - Redis on port 6379
echo.
echo Access URLs:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:4000
echo   - ML Service: http://localhost:8001
echo   - API Docs: http://localhost:4000/api/docs
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul

:end
exit /b 0

:error
echo.
echo ========================================
echo Failed to start services. Please install required dependencies.
echo ========================================
pause
exit /b 1
