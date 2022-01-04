FROM node:lts-alpine

ENV PORT 4000
ENV NODE_ENV development
ENV DB production
ENV LOG_LEVEL info
ENV REDIS_HOST "redis"
ENV SCHEDULE "30 11 * * *"

WORKDIR /usr/app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build
RUN yarn migration:run
CMD "yarn" "start-prod"
