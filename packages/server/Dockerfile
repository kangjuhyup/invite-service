# 빌드 스테이지
FROM ghcr.io/kangjuhyup/invite-service/builder:latest AS builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

# 프로덕션 스테이지
FROM ghcr.io/kangjuhyup/invite-service/release:latest AS production

WORKDIR /usr/src/app

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
