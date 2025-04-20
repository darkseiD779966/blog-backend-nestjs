# syntax=docker/dockerfile:1
FROM node:20-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

COPY . .

EXPOSE 3000

CMD ["nest", "start"]
