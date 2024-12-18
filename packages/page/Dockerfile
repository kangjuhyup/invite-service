FROM ghcr.io/kangjuhyup/invite-service/builder:latest AS builder

WORKDIR /usr/src/app

COPY .yarn/ .yarn/
COPY .yarnrc.yml .yarnrc.yml
COPY package.json yarn.lock ./
COPY packages/page packages/page

RUN yarn workspaces focus page --all
RUN yarn workspace page build

FROM ghcr.io/kangjuhyup/invite-service/release:latest AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=builder /usr/src/app/packages/page/.next packages/page/.next
COPY --from=builder /usr/src/app/packages/page/public packages/page/public
COPY --from=builder /usr/src/app/packages/page/package.json packages/page/package.json
COPY --from=builder /usr/src/app/.env packages/page/.env

RUN yarn workspaces focus page --production

EXPOSE 5001

CMD ["yarn", "workspace", "page", "start:prod"]
