import {prop, Typegoose, ModelType, InstanceType, pre, Ref} from 'typegoose';
import {randomString} from "../utils";
import File from "./file.model";

class Movie extends Typegoose {

  @prop({required: true})
  name: string;

  @prop({required: true})
  overview: string;

  @prop({required: false})
  release_date: Date;

  @prop({required: true})
  poster_path: string;

  @prop({required: true})
  background_path: string;

  @prop({required :true})
  adult: boolean;

  @prop({ref: File, required: true})
  file: Ref<File>;

  @prop()
  width: number;

  @prop()
  height: number;

  @prop()
  duration: number;

  @prop({required: true})
  tmdb_id: number;

  @prop({default: Date.now()})
  inserted_at: Date;

  @prop({default: Date.now()})
  updated_at: Date;

  public static getModel() {
    return new Movie().getModelForClass(typeof this);
  }
}

export default Movie;