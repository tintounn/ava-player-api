import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: Number, default: 2},
  email: {type: String, required: true},
  is_adult: {type: Boolean, default: false},
  inserted_at: Date,
  updated_at: Date
});

const UserModel = mongoose.model('User', schema);

export default UserModel;