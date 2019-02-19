const RealDebridClient = require('node-real-debrid');

export default class AlldebridService {

  private static instance: AlldebridService;

  public static readonly REALDEBRID_TOKEN: string = process.env.REALDEBRID_TOKEN;

  private alldebrid: any;

  private constructor() {
    this.alldebrid = new RealDebridClient(AlldebridService.REALDEBRID_TOKEN);
  }

  public static getInstance() : AlldebridService {
    if(!this.instance) {
      this.instance = new AlldebridService();
    }

    return this.instance;
  }

  public unlock(url: string) {
    return this.alldebrid.unrestrict.link(url);
  }

}