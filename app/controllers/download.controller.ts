import { Response, Request } from "express";

import User from '../models/user.model';
import {DownloadService} from "../services/download.service";

export default class DownloadController {

  public static getAll(req: Request, res: Response) {
    let downloadService = DownloadService.getInstance();
    const downloads = downloadService.getDownloads();

    res.status(201).json({downloads: downloads});
  }
}