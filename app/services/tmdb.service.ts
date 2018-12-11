import axios from "axios";

export default class TMDBService {

  private static instance: TMDBService;

  private readonly apiKey : string = process.env.TMDB_APIKEY;
  private readonly apiUrl : string = "https://api.themoviedb.org/3";
  private readonly apiLng : string = "fr-FR";

  private constructor() {}

  public static getInstance() : TMDBService {
    if(!this.instance) {
      this.instance = new TMDBService();
    }

    return this.instance;
  }

  public searchMovie(query: string) {
    return axios.get(this.apiUrl + `/search/movie?query=${query}&api_key=${this.apiKey}&language=${this.apiLng}`).then((response) => {
      return response.data.results;
    });
  }

}