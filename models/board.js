var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Label = new Schema( {
  name: String,
  color: String
});

var Comment = new Schema( {
  content: String,
  author: String,
  date: Date,
});

var Card = new Schema( {
  title: String,
  author: String,
  labels: [Label],
  members: Array,
  description: String,
  comments: [Comment]
});

var List = new Schema({
  name: String,
  cards: [Card]
});

var Board = new Schema( {
  name: String,
  lists:[List],
  author: String,
  members: Array
});

module.exports = mongoose.model('Board', Board);
