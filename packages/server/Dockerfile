FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Copy all yarn and config files
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.loader.mjs ./
COPY .yarnrc.yml .yarnrc ./
COPY .yarnignore ./
COPY package.json yarn.lock ./
COPY tsconfig.json jest.config.js nest-cli.json ./

# Create workspace structure
RUN mkdir -p packages/server

# Copy server files
COPY dist/ packages/server/dist/
COPY ecosystem.config.js package.json packages/server/
COPY .env packages/server/

# Install PM2
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p /usr/src/app/logs

RUN yarn workspaces focus server --production

EXPOSE 3003

CMD ["yarn", "workspace", "server", "pm2-runtime", "ecosystem.config.js"]