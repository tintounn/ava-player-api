import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  overview: {type: String, required: true},
  release_date: {type: Date, required: false},
  poster_path: {type: String, required: true},
  background_path: {type: String},
  adult: Boolean,
  file: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
  width: Number,
  height: Number,
  duration: Number,
  tmdb_id: {type: Number, required: true},
  inserted_at: Date,
  updated_at: Date,
});

const MovieModel = mongoose.model('Movie', schema);

export default MovieModel;