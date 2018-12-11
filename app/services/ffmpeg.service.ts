import {exec} from 'child_process';
import {unlink} from 'fs';
import {join} from 'path';
import * as threads from 'threads';

export default class FFmpegService {

  private static instance: FFmpegService;

  private convertsInProgress : any[];

  private constructor() {
    this.convertsInProgress = [];
  }

  public static getInstance() : FFmpegService {
    if(!this.instance) {
      this.instance = new FFmpegService();
    }

    return this.instance;
  }

  public convert(file: any, options: any = {}) {
    return new Promise((resolve, reject) => {
      let convert = {
        progress: 0,
        name: file.name,
        thread: null,
        newName: file.name.split('.').splice(-1, 1).join('.') + '.mp4',
        newDirectory: options.dest,
        resolution: options.resolution,
        bitrate: options.bitrate
      };
  
      convert.thread = threads.spawn((input, done, progress) => {
        const ffmpeg = require('fluent-ffmpeg');
        const fs = require('fs');

        const writeStream = fs.createWriteStream(input.dest);

        ffmpeg(input.src)
          .format('mp4')
          .videoCodec('libx264')
          .audioBitrate('192k')
          .audioChannels(2)
          .outputOptions('-movflags', 'frag_keyframe')
          .addOption(['-preset ultrafast'])
          .size('?x' + input.resolution)
          .videoBitrate(input.bitrate +'k')
          .fps(24)
          .on('progress', (res) => {
            progress(res.percent);  
          })
          .on('end', () => {
            done();
          })
          .on('error', (err) => {
            throw new Error(err);
          }).pipe(writeStream, {end: true});
      });

      this.convertsInProgress.push(convert);

      convert.thread.send({
        src: file.getPath(),
        dest: join(convert.newDirectory, convert.newName),
        resolution: convert.resolution,
        bitrate: convert.bitrate
      }).on('done', async () => {
        this.convertsInProgress.splice(this.convertsInProgress.indexOf(convert), 1);

        unlink(file.getPath(), (err) => {});

        file.name = convert.newName;
        file.directory = convert.newDirectory;
        file = await file.save();

        if(resolve) {
          resolve();
        }
      }).on('progress', (progress) => {
        convert.progress = progress;
      }).on('error', (err) => {
        unlink(join(convert.newDirectory, convert.newName), (err) => {});

        this.convertsInProgress.splice(this.convertsInProgress.indexOf(convert), 1);
        if(reject) {
          reject(err);
        }
      });
    });
  }

  public getMetadata(path) {
    return new Promise((resolve, reject) => {
      const command = 'ffprobe -v quiet -print_format json -show_format -show_streams -show_error -show_chapters ' + path;
      exec(command, (err, stdout, stderr) => {
        if(err) {
          if(reject) {
            reject(err);
          }
        } else {
          let out = JSON.parse(stdout); 
          let metadata: any = {
            format: out.format
          };

          for(let stream of out.streams) {
            if(stream.codec_type == 'video') {
              metadata.video = stream;
            } else if(stream.codec_type == 'audio') {
              metadata.audio = stream;
            }
          }

          if(resolve) {
            resolve(metadata);
          }
        }
      });
    });
  }

  public getConvertData(resolution) {
    if(resolution >= 1080) {
      return {resolution: 1080, bitrate: 4500};
    } else if(resolution >= 720) {
      return {resolution: 720, bitrate: 3000};
    } else if(resolution >= 480) {
      return {resolution: 480, bitrate: 1750};
    } else if(resolution >= 360) {
      return {resolution: 360, bitrate: 800};
    } else {
      return {resolution: 240, bitrate: 600};
    }
  }
}