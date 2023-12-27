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
      - migration
      - mongodb
    environment:
      DB_HOST: db
      DB_PORT: 5432
      MONGO_URI: mongodb://mongodb:27017
      MINITAILOR_PORT: 8000
    ports:
      - 8000:${options.port || defaultMinitailorPort}
    volumes:
      - .:/root/backend
    working_dir: /root/backend
    entrypoint: /root/app start

  db:
    image: postgres:13.5
    volumes:
      - ./db/postgres:/var/lib/postgresql
      - ./db/logs:/var/log
      - ./db/init:/docker-entrypoint-initdb.d
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

volumes:
  mongodb:
    driver: local
`;
