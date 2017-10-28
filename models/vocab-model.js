const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word: {
      type: String
    },
    definition: {
      type: String
    },
    speech: {
      type: String
    },
    sentence: {
      type: String
    },
    synonyms: {
      type: String
    },
    relatedwords:{
      type: String
    },
    antonyms: {
      type: String
    }
});


const WordModel = mongoose.model('Word', wordSchema);
                  //      model name 'Word'
                  //                     |
                  // collection name 'words'

module.exports = WordModel;
