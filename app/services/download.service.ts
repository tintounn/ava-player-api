import axios from "axios";
import * as fs from "fs";
import {join} from 'path';

import File from "../models/file.model";

export class DownloadService {

  private static instance: DownloadService;

  public static readonly DOWNLOADS_DIRECTORY: string = process.env.DOWNLOADS_DIRECTORY || './files/tmp/';

  private downloadQueue: any[];

  private downloadInProgress: any[];

  private readonly downloadLimit: number;


  private constructor() {
    this.downloadQueue = [];
    this.downloadInProgress = [];
    this.downloadLimit = parseInt(process.env.DOWNLOAD_LIMIT) || 1;
  }

  public static getInstance() : DownloadService {
    if(!this.instance) {
      this.instance = new DownloadService();
    }

    return this.instance;
  }

  public getDownloads() : any[] {
    return this.downloadInProgress;
  }

  public download(file) {
    return new Promise((resolve, reject) => {
      this.downloadQueue.push({file: file, resolve: resolve, reject: reject});
      this.next();
    });
  }

  private next() {
    if(this.downloadInProgress.length >= this.downloadLimit || this.downloadQueue.length == 0) {
     return;
    }

    let download = this.downloadQueue.shift();
    this.downloadInProgress.push({name: download.file.name, speed: 0, progress: 0});
    
    let index = this.downloadInProgress.length - 1;
    let writeStream = fs.createWriteStream(join(DownloadService.DOWNLOADS_DIRECTORY, download.file.name));

    axios.get(download.file.url, {responseType: 'stream'}).then((res) => {
      res.data.pipe(writeStream);
    }).catch((err) => {
      if(download.reject) {
        download.reject(err);
      }
      this.downloadInProgress.splice(index, 1);
      this.next();
    });

    writeStream.on('error', (err) => {
      fs.unlink(join(DownloadService.DOWNLOADS_DIRECTORY, download.file.name), (err) => {});

      if(download.reject) {
        download.reject(err);
      }
      this.downloadInProgress.splice(index, 1);
      this.next();
    });

    writeStream.on('close', () => {
      writeStream.end();
      
      download.file.directory = DownloadService.DOWNLOADS_DIRECTORY;
      download.file.save();

      if(download.resolve) {
        download.resolve();
      }
      this.downloadInProgress.splice(index, 1);
      this.next();
    });
  }
}