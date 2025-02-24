FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Copy yarn and package files
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.loader.mjs yarn.lock .yarnrc.yml ./
COPY root-package.json ./package.json

# Create workspace structure
RUN mkdir -p packages/server

# Copy server files
COPY ecosystem.config.js packages/server/
COPY dist/ packages/server/dist/
COPY .env packages/server/
COPY server-package.json packages/server/package.json

# Install PM2
RUN npm install -g pm2

RUN yarn workspaces focus server --production

# Create logs directory
RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["yarn", "workspace", "server", "pm2-runtime", "ecosystem.config.js"]
