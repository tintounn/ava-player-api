import * as crypto from "crypto";
import { prop, Typegoose, ModelType, InstanceType, pre } from 'typegoose';

@pre<User>("save", function(next) {
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
})
class User extends Typegoose {

  @prop({required: true, unique: true})
  username: string;

  @prop({required: true})
  password: string;

  @prop({default: 2})
  role: number;

  @prop({required: true})
  email: string;

  @prop({default: false})
  is_adult: boolean;

  @prop({default: Date.now()})
  inserted_at: Date;

  @prop({default: Date.now()})
  updated_at: Date;

  public static getModel() {
    return new User().getModelForClass(typeof this);
  }
}

namespace User {
  export enum Roles {
    ADMIN = 1,
    GUEST = 2
  }
}

export default User;