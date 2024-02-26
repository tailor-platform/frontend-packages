export const composeYaml = () =>
  `
version: "3.7"
services:
  migration:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:latest
    pull_policy: missing
    command: minitailor db.migration
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_PORT: 5432

  minitailor:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:latest
    pull_policy: missing
    depends_on:
      migration:
        condition: service_completed_successfully
      db:
        condition: service_healthy
      mongodb:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_PORT: 5432
      MONGO_URI: mongodb://mongodb:27017
      MINITAILOR_PORT: 8000
      APP_HTTP_SCHEMA: http
      PLATFORM_URL: http://mini.tailor.tech:18090
    ports:
      - 8000:8000
      - 18009:18009
      - 18090:18090
      - 18888:18888
    working_dir: /root/backend
    entrypoint: minitailor start

  initsqlgen:
    image: alpine:latest
    tty: true
    environment:
      INITSQL: |
        CREATE DATABASE minitailor;
        CREATE USER minitailor_user WITH encrypted password 'password';
        grant all privileges on database minitailor to minitailor_user;
    command: sh -c 'mkdir -p /initdb && echo "$\${INITSQL}" > /initdb/init.sql'
    volumes:
      - initdb:/initdb

  db:
    image: postgres:13.5
    depends_on:
      - initsqlgen
    volumes:
      - postgres:/var/lib/postgresql
      - initdb:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "35432:5432"
    healthcheck:
      test: "pg_isready -U postgres"
      interval: 2s
      timeout: 5s
      retries: 3
    command: postgres -c listen_addresses='*'

  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb:/data/db
    ports:
      - "27017:27017"
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 1s
      timeout: 5s
      retries: 3

volumes:
  initdb:
  postgres:
  mongodb:
  `;
