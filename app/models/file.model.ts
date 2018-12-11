import { join } from 'path';
import { prop, Typegoose, ModelType, InstanceType, pre, instanceMethod } from 'typegoose';


class File extends Typegoose {

  @prop({required: true})
  name: string;

  @prop()
  url: string;

  @prop({required: false})
  directory: string;

  @prop({required: true})
  size: number;

  @prop({default: 1})
  status: number;

  @prop({default: Date.now()})
  inserted_at: Date;

  @prop({default: Date.now()})
  updated_at: Date;

  @instanceMethod
  getPath(this: InstanceType<File>) {
    return join(this.directory, this.name);
  }

  public static getModel() {
    return new File().getModelForClass(typeof this);
  }
}

export default File;