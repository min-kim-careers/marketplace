FROM python:3.13-slim

RUN useradd -m -r appuser && \
    mkdir /code && \
    chown -R appuser /code

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip

COPY --chown=appuser:appuser requirements.txt /code/
COPY --chown=appuser:appuser ./app /code/app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

USER appuser

CMD [ "fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0", "--reload" ]