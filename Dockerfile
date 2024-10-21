FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    vips-dev

# Yarn 버전 설정
RUN yarn set version 4.5.0

COPY . .

RUN yarn install
RUN yarn build

FROM node:20-alpine AS production

RUN apk add --no-cache \
    libc6-compat \
    vips-dev

WORKDIR /usr/src/app

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
