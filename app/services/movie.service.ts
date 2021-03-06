import * as path from 'path';

import {DownloadService} from "./download.service";
import Movie from "../models/movie.model";
import File from "../models/file.model";
import {FileService} from "./file.service";
import FFmpegService from './ffmpeg.service';
import AlldebridService from './alldebrid.service';

export class MovieService {

  private static instance: MovieService;

  public static readonly MOVIES_DIRECTORY: string = process.env.MOVIES_DIRECTORY || './files/movies/';

  private constructor() {}

  public static getInstance() : MovieService {
    if(!this.instance) {
      this.instance = new MovieService();
    }

    return this.instance;
  }

  public async download(data) {
    const downloadService = DownloadService.getInstance();
    const fileService = FileService.getInstance();
    const ffmpegService = FFmpegService.getInstance();
    const alldebridService = AlldebridService.getInstance();

    data.url = await alldebridService.unlock(data.url).download;

    let movie: any = {};
    let file: any = {};

    try {
      file = await fileService.create(data.url.split('/').pop(), data.url);
    } catch(err) {
      await fileService.delete(file._id);

      throw new Error(err);
    }

    try {
      movie = await this.create(data, file);
    } catch(err) {
      await fileService.delete(file._id);
      await this.delete(movie._id);

      throw new Error(err);
    }

    downloadService.download(file).then(() => {
      return ffmpegService.getMetadata(file.url);
    }).then(async (res: any) => {
      file.size = parseInt(res.format.size);
      movie.duration = parseInt(res.format.duration);
      movie.width = parseInt(res.video.width);
      movie.height = parseInt(res.video.height);

      movie = await movie.save();
      file = await file.save();

      return ffmpegService.convert(file, {
        dest: MovieService.MOVIES_DIRECTORY,
      });
    }).then((res: any) => {
    }).catch(async (err) => {
      console.log(err);
      await this.delete(movie._id);
    });

    return await this.findById(movie._id);
  }

  public async delete(id) {
    const fileService = FileService.getInstance();
    const movie: any = await this.findById(id);

    if(movie) {
      await Movie.deleteOne({_id: id});
      await fileService.delete(movie.file._id);
    }
  }

  public async findById(id) {
    return await Movie.findOne({_id: id}).populate('file');
  }

  private async create(data, file) {
    let movie = new Movie({
      name: data.name,
      overview: data.overview,
      release_date: data.release_date,
      poster_path: data.poster_path,
      background_path: data.backdrop_path,
      adult: data.adult,
      tmdb_id: data.tmdb_id,
      file: file
    });

    return await movie.save();
  }

  public async findAll(query: string = '') {
    return await Movie.find({'name': {'$regex': query, '$options': 'i'}});
  }
}