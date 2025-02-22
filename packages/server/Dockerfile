FROM ghcr.io/kangjuhyup/invite-service/builder:latest AS builder

WORKDIR /usr/src/app

# Install Doppler CLI
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh

COPY . .

RUN yarn workspaces focus server --all
RUN yarn workspace server build

# Download environment variables from Doppler
ARG DOPPLER_PROJECT
ARG DOPPLER_CONFIG=prod

RUN --mount=type=secret,id=DOPPLER_TOKEN \
    doppler setup --token $(cat /run/secrets/DOPPLER_TOKEN) --project $DOPPLER_PROJECT --config $DOPPLER_CONFIG --no-interactive && \
    doppler secrets download --no-file --format env > packages/server/.env

FROM ghcr.io/kangjuhyup/invite-service/release:latest AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=builder /usr/src/app/packages/server/dist packages/server/dist
COPY --from=builder /usr/src/app/packages/server/package.json packages/server/package.json
COPY --from=builder /usr/src/app/packages/server/public packages/server/public
COPY --from=builder /usr/src/app/packages/server/ecosystem.config.js packages/server/ecosystem.config.js

RUN mkdir -p /usr/src/app/logs

RUN yarn workspaces focus server --production

EXPOSE 3003

CMD ["yarn", "workspace", "server", "pm2-runtime", "ecosystem.config.js"]
