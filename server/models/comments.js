// Comment Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema

/*
  This is where we specify the format of the data we're going to put into
  the database.
*/
const commentSchema = new Schema(
  {
  text: { type: String, required: true },
  comment_by: { type: Schema.Types.ObjectId, ref: 'Account', required: true }, 
  comment_date_time: { type: Date, default: Date.now },
  votes: {type: Number, default: 0},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.virtual('url').get(function () {
  return `posts/comment/${this._id}`;
});

module.exports = mongoose.model('Comment', commentSchema);