import * as mongoose from "mongoose";
import { join } from 'path';

const schema = new mongoose.Schema({
  token: {type: String, required: true},
  used: {type: Boolean, default: false},
  inserted_at: Date,
});

schema.methods.getPath = function() {
  return join(this.directory, this.name);
}

const InvitationModel = mongoose.model('Invitation', schema);
export default InvitationModel;
