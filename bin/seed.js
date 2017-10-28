const mongoose = require('mongoose');

const WordModel = require('../models/vocab-model.js');


mongoose.connect('mongodb://localhost/vocab');

const wordArray = [
    {
      word: 'hello',
      definition: 'greeting',
      speech: 'noun',
      fact1: 'interesting word'
    },
    {
      word: 'hi',
      definition: 'greeting',
      speech: 'noun',
      fact1: 'interesting word'
    },
    {
      word: 'interesting',
      definition: 'greeting',
      speech: 'noun',
      fact1: 'interesting word'
    },
    {
      word: 'okay',
      definition: 'greeting',
      speech: 'noun',
      fact1: 'interesting word'
    },
];

WordModel.create(
  // 1st argument -> array of words to save
  wordArray,

  // 2nd argument -> callback
  (err, wordsAfterSave) => {
      if (err) {
          console.log('Create error 😅');
          console.log(err);
          return;
      }

      wordsAfterSave.forEach((oneWord) => {
          console.log('New Word ---> ' + oneWord.name);
      });
  }
); // close WordModel.create( ...
