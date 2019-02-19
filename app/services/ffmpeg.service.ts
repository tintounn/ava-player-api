import {exec, spawn} from 'child_process';
import {unlink} from 'fs';
import {join, parse} from 'path';
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

  public getConverts() : any[] {
    return this.convertsInProgress;
  }

  public convert(file: any, options: any = {}) {
    return new Promise((resolve, reject) => {
      let convert = {
        progress: 0,
        thread: null,
        name: parse(file.name).name + '.mp4',
        directory: options.dest
      };
  
      convert.thread = threads.spawn((input, done, progress) => {
        const spawn = require('child_process').spawn;
        const fs = require('fs');

        const args = [
          '-i', input.src,
          '-preset', 'ultrafast',
          '-movflags', 'faststart',
          '-acodec', 'libmp3lame',
          '-vcodec', 'libx264',
          '-f', 'mp4',
          '-r', '24',
          input.dest
        ];

        let process = spawn('ffmpeg', args);

        process.stdout.on('data', (data) => {});
        process.stderr.on('data', (data) => {});

        process.on('close', (code) => {
          if(code !== 0) {
            throw new Error('Error while converting');
          }

          done();
        });
      });

      this.convertsInProgress.push(convert);

      convert.thread.send({
        src: file.getPath(),
        dest: join(convert.directory, convert.name),
      }).on('done', async () => {
        this.convertsInProgress.splice(this.convertsInProgress.indexOf(convert), 1);

        unlink(file.getPath(), (err) => {});

        file.name = convert.name;
        file.directory = convert.directory;
        file = await file.save();

        if(resolve) {
          resolve(convert);
        }
      }).on('progress', (progress) => {
        convert.progress = progress;
      }).on('error', (err) => {
        unlink(join(convert.directory, convert.name), (err) => {});

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
}