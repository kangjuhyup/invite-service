FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Copy yarn and package files
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.loader.mjs yarn.lock .yarnrc.yml ./
COPY package.json ./

# Create workspace structure
RUN mkdir -p packages/server

# Copy server files
COPY dist/ packages/server/dist/
COPY ecosystem.config.js .
COPY package.json packages/server/
COPY .env packages/server/

# Install PM2
RUN npm install -g pm2

RUN yarn workspaces focus server --production

# Create logs directory
RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

WORKDIR /usr/src/app/packages/server

CMD ["pm2-runtime", "ecosystem.config.js"]