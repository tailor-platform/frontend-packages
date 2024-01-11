export const defaultMinitailorPort = 8000;

export const composeYaml = (options: { port?: number }) => `
version: "3.7"
services:
  migration:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:latest
    command: /root/app db.migration
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_PORT: 5432

  minitailor:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:latest
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
    ports:
      - 8000:${options.port || defaultMinitailorPort}
    volumes:
      - ./.tailordev/cue.mod:/root/backend/cue.mod
      - ./.tailordev/generated:/root/backend/generated
      - ./manifest:/root/backend/manifest
      - ./minitailor.log:/root/backend/minitailor.log
    working_dir: /root/backend
    entrypoint: /root/app start

  db:
    image: postgres:13.5
    volumes:
      - ./.tailordev/db/postgres:/var/lib/postgresql
      - ./.tailordev/db/logs:/var/log
      - ./.tailordev/db/init:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    command: postgres -c listen_addresses='*'
    healthcheck:
      test: "pg_isready -U postgres"
      interval: 2s
      timeout: 5s
      retries: 3

  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 1s
      timeout: 5s
      retries: 3

volumes:
  mongodb:
    driver: local
`;
