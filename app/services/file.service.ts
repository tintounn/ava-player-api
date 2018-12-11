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
    const FileModel = File.getModel();

    let fileModel = new FileModel({
      name: name,
      size: 0,
      url: url,
    });

    return await fileModel.save();
  }

  public async findById(id) {
    const FileModel = File.getModel();
    return await FileModel.findById(id);
  }

  public async delete(id) {
    const FileModel = File.getModel();
    let file = await this.findById(id);

    if(file) {
      await FileModel.deleteOne({_id: id});

      if(fs.existsSync(file.getPath())) {
        fs.unlinkSync(file.getPath());
      }
    }
  }

  public getFilesInDirectory() {
    // Liste les fichiers dans un dossier
  }
}