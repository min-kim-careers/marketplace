# --- Base ---
FROM python:3.13-slim AS base
WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/code

RUN pip install --upgrade pip

COPY requirements.txt .

# --- Dependencies ---
FROM base AS deps
RUN pip install --no-cache-dir -r requirements.txt

# --- Dev ---
FROM deps AS dev
COPY ./app /code/app
COPY ./dev-images /code/images
CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# --- Prod ---
FROM deps AS prod
COPY ./app /code/app
COPY ./prod-images /code/images

# Use uvicorn (lightweight ASGI server) for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
