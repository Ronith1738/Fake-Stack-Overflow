// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema

/*
  This is where we specify the format of the data we're going to put into
  the database.
*/
const tagSchema = new Schema(
  {
  name: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tagSchema.virtual('url').get(function () {
  return `posts/tag/${this._id}`;
});

module.exports = mongoose.model('Tag', tagSchema);