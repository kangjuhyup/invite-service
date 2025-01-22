FROM ghcr.io/kangjuhyup/invite-service/builder:latest AS builder

WORKDIR /usr/src/app

COPY . .

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
COPY --from=builder /usr/src/app/packages/server/public packages/server/public
COPY --from=builder /usr/src/app/packages/server/ecosystem.config.js packages/server/ecosystem.config.js

RUN yarn workspaces focus server --production
RUN npm install -g pm2

EXPOSE 3003

CMD ["yarn", "workspace", "server", "start:prod"]

# CMD ["pm2-runtime", "packages/server/ecosystem.config.js"]
