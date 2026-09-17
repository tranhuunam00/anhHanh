# Dockerfile for DailyDictation Studio Enterprise
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies & python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app, React frontend dist, and documentation
COPY app/ ./app/
COPY server.py ./
COPY frontend/dist/ ./frontend/dist/
COPY tai_lieu/ ./tai_lieu/

# Ensure data directory exists
RUN mkdir -p /app/data

# Expose port
EXPOSE 5100
ENV PORT=5100
ENV RUNNING_IN_DOCKER=1
ENV PYTHONUNBUFFERED=1

# Run Uvicorn server in production
CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5100"]

