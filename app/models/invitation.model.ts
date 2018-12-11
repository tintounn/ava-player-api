import { prop, Typegoose, ModelType, InstanceType, pre } from 'typegoose';
import {randomString} from "../utils";

class Invitation extends Typegoose {

  @prop({required: true})
  token: string;

  @prop({default: false})
  used: boolean;

  @prop({default: Date.now()})
  inserted_at: Date;

  public static getModel() {
    return new Invitation().getModelForClass(typeof this);
  }
}

export default Invitation;