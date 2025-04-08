// Answer Document Schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
  This is where we specify the format of the data we're going to put into
  the database.
*/
const answerSchema = new Schema(
  {
  text: { type: String, required: true },
  ans_by: { type: Schema.Types.ObjectId, ref: 'Account', required: true }, 
  ans_date_time: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  votes: {type: Number, default: 0},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

answerSchema.virtual('url').get(function () {
  return `posts/answer/${this._id}`;
});

module.exports = mongoose.model('Answer', answerSchema)