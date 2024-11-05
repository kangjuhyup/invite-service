FROM ghcr.io/kangjuhyup/invite-service/builder:latest AS builder

WORKDIR /usr/src/app

COPY .yarn/ .yarn/
COPY .yarnrc.yml .yarnrc.yml
COPY package.json yarn.lock ./
COPY packages/server packages/server

RUN yarn workspaces focus server --all
RUN yarn workspace server build

FROM ghcr.io/kangjuhyup/invite-service/release:latest AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=builder /usr/src/app/packages/server/dist packages/server/dist
COPY --from=builder /usr/src/app/packages/server/package.json packages/server/package.json
COPY --from=builder /usr/src/app/.env packages/server/.env

RUN yarn workspaces focus server --production

EXPOSE 3003

CMD ["yarn", "workspace", "server", "start:prod"]
