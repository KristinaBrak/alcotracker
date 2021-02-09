FROM node:lts-alpine

ENV NODE_ENV development
ENV DB production
ENV LOG_LEVEL info
ENV REDIS_HOST "redis"
ENV SCHEDULE "*/5 * * * *"

WORKDIR /usr/app
COPY package.json .
RUN yarn install
COPY . .
RUN npm run build
CMD "yarn" "start-prod"