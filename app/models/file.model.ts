import * as mongoose from "mongoose";
import { join } from 'path';

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  url: String,
  directory: String,
  size: {type: Number, required: true},
  status: {type: Number, default: 1},
  inserted_at: Date,
  updated_at: Date,
});

schema.methods.getPath = function() {
  return join(this.directory, this.name);
}

const FileModel = mongoose.model('File', schema);

export default FileModel;