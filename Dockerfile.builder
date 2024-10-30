FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libc6-dev \
    libvips-dev

# Yarn 버전 설정
RUN yarn set version 4.5.0
