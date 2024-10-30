# 빌드 스테이지
FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libc6-dev \
    libvips-dev

# Yarn 버전 설정
RUN yarn set version 4.5.0

COPY . .

RUN yarn install
RUN yarn build

# 프로덕션 스테이지
FROM node:20-bullseye-slim AS production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libvips-dev \
    libc6-dev

# Yarn 버전 설정
RUN yarn set version 4.5.0

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=builder /usr/src/app/.env .env
COPY --from=builder /usr/src/app/dist ./dist

RUN yarn workspaces focus --production

EXPOSE 3003

CMD ["yarn", "start:prod"]
