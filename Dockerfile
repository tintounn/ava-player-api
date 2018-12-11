FROM node:carbon-alpine

WORKDIR /home/app
ENV PATH /home/app/ava-player-api/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    git clone https://github.com/tintounn/ava-player-api && \
    cd ava-player-api && \
    ls -l && \
    npm install && \
    npm run build

CMD ["npm", "run", "start"]
