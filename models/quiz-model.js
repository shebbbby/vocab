const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizSchema = new Schema({
    questions: []
});


const QuizModel = mongoose.model('Quiz', quizSchema);
                  //      model name 'Quiz'
                  //                     |
                  // collection name 'quizzes?'

module.exports = QuizModel;
