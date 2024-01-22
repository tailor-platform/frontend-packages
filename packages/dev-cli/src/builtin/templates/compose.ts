import { DockerComposeOptions } from "@cli/config.js";
import { log } from "@script/index.js";

// Options not exposed on .tailordevrc.json
type InternalOptions = {
  profile: string;
};

type Options = DockerComposeOptions & InternalOptions;
export const defaultDockerComposeOptions: Options = {
  minitailorTag: "latest",
  pullPolicy: "missing",
  profile: "app",
};

export const composeYaml = (opts?: DockerComposeOptions) => {
  const options: Options = {
    ...defaultDockerComposeOptions,
    ...opts,
  };

  log.debug("compose", `options: ${JSON.stringify(options)}`);

  return `
version: "3.7"
services:
  migration:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:${options.minitailorTag}
    pull_policy: ${options.pullPolicy}
    command: minitailor db.migration
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_PORT: 5432
    profiles:
      - ${options.profile}

  minitailor:
    image: asia-northeast1-docker.pkg.dev/tailor-professional-service/cmd/minitailor:${options.minitailorTag}
    pull_policy: ${options.pullPolicy}
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
    profiles:
      - ${options.profile}
    volumes:
      - ./.tailordev:/root/backend
      - ./manifest:/root/backend/manifest
    working_dir: /root/backend
    entrypoint: minitailor start

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
    ports:
      - "35432:5432"
    profiles:
      - ${options.profile}
      - middleware
    healthcheck:
      test: "pg_isready -U postgres"
      interval: 2s
      timeout: 5s
      retries: 3

  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb:/data/db
    ports:
      - "27017:27017"
    profiles:
      - ${options.profile}
      - middleware
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 1s
      timeout: 5s
      retries: 3

volumes:
  mongodb:
    driver: local
`;
};
