FROM node:8.9

ADD . /app

RUN \
  cd /app && \
  npm install  && \
  npm run build

WORKDIR /app

CMD ["node", "server.js"]

EXPOSE 8080