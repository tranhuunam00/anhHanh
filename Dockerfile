# Multi-stage Dockerfile for DailyDictation Studio Enterprise

# -------------------------------------------------------------
# Stage 1: Build React Frontend Bundle
# -------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Build static assets
COPY frontend/ ./
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Python Backend & Production Web Server
# -------------------------------------------------------------
FROM python:3.11-slim
WORKDIR /app

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, static documentation
COPY app/ ./app/
COPY server.py ./
COPY tai_lieu/ ./tai_lieu/
COPY data/cache/ ./data/cache/

# Copy built frontend dist from Stage 1
COPY --from=frontend-builder /app/frontend/dist/ ./frontend/dist/

# Ensure data directory exists
RUN mkdir -p /app/data

# Ports and runtime configurations
EXPOSE 5100
ENV PORT=5100
ENV RUNNING_IN_DOCKER=1
ENV PYTHONUNBUFFERED=1

# Start Uvicorn Single-Port Production Server
CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5100"]
