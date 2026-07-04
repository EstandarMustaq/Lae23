FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/events/package.json packages/events/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install

FROM deps AS build
COPY . .
RUN pnpm --filter @ponte-segura/api... build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app ./
EXPOSE 3000
CMD ["pnpm", "--filter", "@ponte-segura/api", "start"]
