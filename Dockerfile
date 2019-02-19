FROM node:carbon-alpine

WORKDIR /home/app
ENV PATH /home/app/ava-player-api/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh ffmpeg x264-dev x264-libs lame && \
    git clone https://github.com/tintounn/ava-player-api . && \
    ls -l && \
    npm install && \
    npm run build

CMD ["npm", "run", "start"]
