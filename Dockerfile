FROM python:3.13-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/code

RUN pip install --upgrade pip

COPY requirements.txt /code/
COPY ./app /code/app
COPY ./images /code/images

RUN pip install --no-cache-dir --upgrade -r requirements.txt

CMD [ "fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0", "--reload" ]