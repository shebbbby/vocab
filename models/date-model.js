const mongoose = require('mongoose');
var vocabData = require('./vocab-model');

const Schema = mongoose.Schema;

const dateSchema = new Schema({
    create_date: {type: Date, default: Date.now},
    words:[],
    definitions: [],
    correctWords: [],
    incorrectWords: []
});


const DateModel = mongoose.model('Date', dateSchema);
                  //      model name 'Date'
                  //                     |
                  // collection name 'datezes?'

module.exports = DateModel;
