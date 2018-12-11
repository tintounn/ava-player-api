import { Response, Request } from "express";
import TMDBService from "../services/tmdb.service";
import {MovieService} from "../services/movie.service";
import { FileService } from "../services/file.service";

export default class MovieController {

  public static async search(req: Request, res: Response) {
    const query = req.query.query;
    let tmdbService = TMDBService.getInstance();

    console.log('HEYT');

    try {
      const movies = await tmdbService.searchMovie(query);

      res.status(200).json({movies: movies});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async create(req: Request, res: Response) {
    const movieService = MovieService.getInstance();

    try {
      const movie = await movieService.download(req.body);

      res.status(201).json({movie: movie});
    } catch(err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async findAll(req: Request, res: Response) {
    const movieService = MovieService.getInstance();

    try {
      const movies = await movieService.findAll();

      res.status(200).json({movies: movies});
    } catch(err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async findById(req: Request, res: Response) {
    const movieService = MovieService.getInstance();

    try {
      const movie = await movieService.findById(req.params.id);

      res.status(200).json({movie: movie});
    } catch (err) {
      res.status(500).json({err: err.message || err});
    }
  }

  public static async stream(req: Request, res: Response) {
    const fileService = FileService.getInstance();

    try {
   //   const stream = fileService.stream(req.params.id);
    } catch (error) {
      
    }
  }
}