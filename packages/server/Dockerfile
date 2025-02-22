FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

# Install pm2 globally
RUN npm install -g pm2

COPY dist/ dist/
COPY public/ public/
COPY node_modules/ node_modules/
COPY ecosystem.config.js ./
COPY package.json ./

RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["pm2-runtime", "ecosystem.config.js"]
