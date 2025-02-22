FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Copy yarn and package files
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.loader.mjs yarn.lock package.json .yarnrc.yml ./

# Copy built files and configs
COPY ./dist ./dist
COPY ./ecosystem.config.js ./
COPY ./.env ./

# Install PM2
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["yarn", "node", "-r", "./.pnp.cjs", "dist/src/main.js"]
