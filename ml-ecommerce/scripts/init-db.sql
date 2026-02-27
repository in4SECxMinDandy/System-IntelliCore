-- ==========================================
-- PostgreSQL Init Script
-- Creates mlflow database alongside ecommerce
-- ==========================================

-- Create mlflow database for MLflow tracking
CREATE DATABASE mlflow;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mlflow TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;

-- Enable UUID extension
\c ecommerce;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c mlflow;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
