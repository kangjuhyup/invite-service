FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Copy built files
COPY ./dist /usr/src/app/dist
COPY ./ecosystem.config.js /usr/src/app/
COPY ./.env /usr/src/app/

# Install PM2
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["pm2-runtime", "ecosystem.config.js"]
