import * as mongoose from "mongoose";

export default class MongoDB {
  
  private static instance : MongoDB;
  
  private host : string;
  private port : number;
  private database: string;

  private constructor() {
    this.config();
  }

  public setup() : Promise<typeof import("mongoose")> {
    return mongoose.connect(`mongodb://${this.host}:${this.port}/${this.database}`);
  }

  private config() {
    this.host = process.env.MONGO_HOST || "localhost";
    this.port = parseInt(process.env.MONGO_PORT) || 27017;
    this.database = process.env.MONGO_DATABASE || "ava";
  }

  public static getInstance() : MongoDB {
    if(!this.instance) {
      this.instance = new MongoDB();
    }

    return this.instance;
  }
}