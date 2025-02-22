FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

COPY .yarn/ .yarn/
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./
COPY .pnp.cjs ./
COPY .pnp.loader.mjs ./

COPY dist/ packages/server/dist/
COPY public/ packages/server/public/
COPY ecosystem.config.js packages/server/
COPY package.json packages/server/

RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["yarn", "workspace", "server", "pm2-runtime", "ecosystem.config.js"]
