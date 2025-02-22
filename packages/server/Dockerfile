FROM ghcr.io/kangjuhyup/invite-service/release:latest

WORKDIR /usr/src/app

COPY dist/ dist/
COPY public/ public/
COPY ecosystem.config.js ./
COPY package.json ./

RUN mkdir -p /usr/src/app/logs

EXPOSE 3003

CMD ["pm2-runtime", "ecosystem.config.js"]
