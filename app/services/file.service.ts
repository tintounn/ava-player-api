import * as path from "path";
import * as fs from 'fs';

import File from "../models/file.model";

export class FileService {

  private static instance: FileService;

  private constructor() {}

  public static getInstance() : FileService {
    if(!this.instance) {
      this.instance = new FileService();
    }

    return this.instance;
  }

  public async create(name, url) {
    let fileModel = new File({
      name: name,
      size: 0,
      url: url,
    });

    return await fileModel.save();
  }

  public async findById(id) {
    return await File.findById(id);
  }

  public async delete(id) {
    let file: any = await this.findById(id);

    if(file) {
      await File.deleteOne({_id: id});

      if(fs.existsSync(file.getPath())) {
        fs.unlinkSync(file.getPath());
      }
    }
  }

  private getStreamInfo(range, fileSize) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;

    return { parts, start, end, chunksize };
  }

  public getFilesInDirectory() {
    // Liste les fichiers dans un dossier
  }
}