FROM python:3.11-alpine

WORKDIR /app
COPY exporter.py .

ENV LISTEN_PORT=9199
EXPOSE 9199

CMD ["python", "exporter.py"]
