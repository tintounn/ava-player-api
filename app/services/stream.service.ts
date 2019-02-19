import * as fs from "fs";
import { join } from "path";

import { FileService } from "./file.service";

export default class StreamService {

  private static instance : StreamService;

  private streams : any = {}; 

  private constructor() {}

  public static getInstance() : StreamService {
    if(!this.instance) {
      this.instance = new StreamService();
    }

    return this.instance;
  }

  public getStreamsFromUserId(userId) {
    return this.streams[userId] || {};
  }

  public isUserHaveStreams(userId) {
    return this.streams[userId] != undefined;
  }

  public isUserStreamFile(fileId, userId) {
    const streams = this.getStreamsFromUserId(userId);
    return streams[fileId];
  }

  public async stream(fileId, userId, range = null) {
    const fileService = FileService.getInstance();
    let file: any = this.isUserStreamFile(fileId, userId);

    if(!file) {
      file = await fileService.findById(fileId);
      this.beginStream(file, userId);
    }

    const path = join(file.directory, file.name);
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const total = stat.size;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;

    let header = {};
    let readStream = {};

    if (range) {
      header = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Keep-Alive': 'close'
      };
      
      readStream = fs.createReadStream(path, {start, end})
    } else {
      header = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      readStream = fs.createReadStream(path);
    }

    return {
      readStream: readStream,
      header: header
    }
  }

  private beginStream(file, userId) {
    if(!this.isUserHaveStreams(userId)) {
      this.streams[userId] = {};
    }

    this.streams[userId][file._id] = file;
  }

  private stopStream(fileId, userId) {
    if(this.isUserStreamFile(fileId, userId)) {
      delete this.streams[userId][fileId];
    }
  }
}