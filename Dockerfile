FROM ubuntu:18.04

WORKDIR /home/app
ENV PATH /home/app/ava-player-api/node_modules/.bin:$PATH

RUN apt-get -y update && apt-get -y upgrade && \
    apt-get -y install curl gnupg2 build-essential git && \
    curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    rm nodesource_setup.sh && \
    apt-get -y install nodejs lame libopus-dev libmp3lame-dev libfdk-aac-dev libvpx-dev libx264-dev yasm libass-dev libtheora-dev libvorbis-dev mercurial cmake x264 ffmpeg && \
    git clone https://github.com/tintounn/ava-player-api . && \
    ls -l && \
    npm install && \
    mkdir files && \
    npm run build

CMD ["npm", "run", "start"]
