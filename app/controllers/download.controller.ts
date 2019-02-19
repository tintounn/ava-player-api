import { Response, Request } from "express";

import User from '../models/user.model';
import {DownloadService} from "../services/download.service";
import FFmpegService from "../services/ffmpeg.service";

export default class DownloadController {

  public static getAll(req: Request, res: Response) {
    let downloadService = DownloadService.getInstance();
    let ffmpegService = FFmpegService.getInstance();

    const downloads = downloadService.getDownloads();
    const converts = ffmpegService.getConverts();

    res.status(201).json({downloads: downloads, converts: converts});
  }
}