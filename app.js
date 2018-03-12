const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');
const request      = require('request');
const cheerio      = require('cheerio');
require("dotenv").config();

const WordModel = require('./models/vocab-model.js');
const UserModel = require('./models/user-model.js');
const DateModel = require('./models/date-model.js');

mongoose.connect(process.env.MONGODB_URI);
// Create an Express app object
const app = express();

// Tell Express that our HTML files are located in the "htmls/" folder
app.set('views', 'htmls');

// Tell Express that our HTML files are in the EJS format
app.set('view engine', 'ejs');

// Tell Express that our layout is called "master-template.ejs"
// (it's understood that it's in the "htmls/" folder)
app.set('layout', 'master-template.ejs');

// Tell Express that when it renders it should also use our layout file


// Tell Express that we have static files in our "public/" folder

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressLayouts);
app.use(session(
  {
    secret: 'this string has to be different for every app',
    resave: true,
    saveUninitialized: true
  }
));
// passport middlewares must come AFTER session middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// our own custom middleware for defining "currentUser" for our views
app.use((req, res, next) => {
    // if we are logged in, create the "currentUser" variable for views
    if (req.user) {
        res.locals.currentUser = req.user;
    }

    // otherwise, make "currentUser" blank
    else {
        res.locals.currentUser = null;
    }

    // call "next" to move on to the next step of the middleware pipeline
    // (browser will hang forever unless you do this)
    next();
});

// "myTitle" is a global variable for your EJS files
// (use "app.locals" to make EJS global variables)
// app.locals.myTitle = 'Live Scan Fingerprinting Miami';



// Our first Express "route"
// A route defines a URL/page on our Website
// mysite.com/
// localhost:3000/
app.get('/', (request, response, next) => {
  WordModel.find((err, allWords) => {
    // if there's a database error...
    if (err) {
        // skip to the error handler middleware
        next(err);
        // return to avoid showing the view
        return;
          // early return instead of "else"
    }


    // send the results to the view
    response.locals.listOfWords = allWords;
    // Send the contents of the "views/home.ejs" file to the browser
    response.render('home.ejs');
  });
  // Show dates with list of words in them
  DateModel.find((err, allDates) => {
    // if there's a database error...
    if (err) {
        // skip to the error handler middleware
        next(err);
        // return to avoid showing the view
        return;
          // early return instead of "else"
    }


    // send the results to the view
    response.locals.listOfDates = allDates;
  });
});

// app.get('/crossword', (request, response, next) => {
//   WordModel.find((err, allWords) => {
//     // if there's a database error...
//     if (err) {
//         // skip to the error handler middleware
//         next(err);
//         // return to avoid showing the view
//         return;
//           // early return instead of "else"
//     }
//
//
//     // send the results to the view
//     response.locals.listOfWords = allWords;
//     // Send the contents of the "views/home.ejs" file to the browser
//     response.render('home.ejs');
//   });
//   // Show dates with list of words in them
//   DateModel.find((err, allDates) => {
//     // if there's a database error...
//     if (err) {
//         // skip to the error handler middleware
//         next(err);
//         // return to avoid showing the view
//         return;
//           // early return instead of "else"
//     }
//
//
//     // send the results to the view
//     response.locals.listOfDates = allDates;
//   });
// });

// app.get('/quiz', (req, res, next) => {
//     res.render('quiz.ejs');
// });

app.get('/:wordId', (req, res, next) => {
    //      req.params.wordId
    // <a href="/words/9999">
    // NEW URL

    //                 req.query.wordId
    // <a href="/word-details?wordId=9999">
    // OLD URL

    // "findById()" will get one result from the DB (or null)
    WordModel.findById(
      // get the ID from the URL placeholder ":wordId"
      req.params.wordId,

      (err, wordFromDb) => {
          if (err) {
              // skip straight to the error middleware if there's a DB error
              next(err);
              return;
          }

          res.locals.wordInfo = wordFromDb;

          res.render('word-details.ejs');
      }
    );
}); // close GET /words/:wordId


  // app.get('/:word', (req, res, next) => {
  //
  //     WordModel.findOne(
  //       { word: req.params.word },
  //
  //       (err, wordFromDb) => {
  //           if (err) {
  //               next(err);
  //               return;
  //           }
  //
  //     res.locals.wordInfo = wordFromDb;
  //
  //     res.render('word-details.ejs');
  //           }); // close theUser.save((err) => { ...
  //       }); // close UserModel.findOne( ...


// STEP #2 of the product create submission process
// <form method="post" action="/products">
app.post('/', (req, res, next) => {
    // create a new product object
    // This if statement will make it so that I don't have to upload a word every time I post something to the home page.
    // This will allow me to also delete lists of words
  if(req.body.word !== ""){
    var theWord = new WordModel({
        word: req.body.word,
        definition: req.body.definition,
        speech: req.body.speech,
        sentence: req.body.sentence,
        synonyms: req.body.synonyms,
        relatedwords: req.body.relatedwords,
        antonyms: req.body.antonyms
    }); //  |                          |
        // from SCHEMA            from INPUT NAMES
    // save that product to the database
    console.log(req.body.word);
    theWord.save((err) => {
        // if there's a validation error...
        if (err && theWord.errors) {
            // send the error messages to the view
            res.locals.errorMessages = theWord.errors;

            // display the form again with the errors
            res.render('home.ejs');
            return;
        }

        // if there's a database error...
        if (err && !theWord.errors) {
            // skip to the error handler middleware
            next(err);
            // return to avoid showing the view
            return;
              // early return instead of "else"
        }

        // STEP #3 redirect
        // ALWAYS redirect after a successful to POST to avoid resubmitting
        res.redirect('/');
        // res.render('home', {req: req.body});
          // You can only redirect to a URL
    });
  }
  else{
    res.redirect('/');
  }

    // This section has to do with the extra words that are added every multiple words are added
    wordsArray = req.body.words.split(",");
    // definitionsArray = req.body.definitions.split("|,");
    // sentencesArray = req.body.sentences.split("|,");
    // speechesArray = req.body.speeches.split("|,");
    // synonymsArray = req.body.synonyms-multiple.split("||,");
    // antonymsArray = req.body.antonyms-multiple.split("||,");
    // When you upload only one word, wordsArray[0] is still considered a value even tho it is an empty string.
    // Which means if this if statement doesn't exist, an empty value will be uploaded to the database.
    if(wordsArray[0] === "" || !wordsArray[0] || wordsArray[0] === undefined){
      wordsArray.splice(0,1);
      // definitionsArray.splice(0,1);
      // sentencesArray.splice(0,1);
      // speechesArray.splice(0,1);
      // synonymsArray.splice(0,1);
      // antonymsArray.splice(0,1);
    }
    for (var i = 0; i <= wordsArray.length - 1; i++){
      var theWord = new WordModel({
          word: wordsArray[i],
          // definition: definitionsArray[i].replace(/|/g , ""),
          // sentence: sentencesArray[i].replace(/|/g , ""),
          // speech: speechesArray[i].replace(/|/g , ""),
          // synonyms: synonymsArray[i].replace(/|/g , ""),
          // antonyms: antonymsArray[i].replace(/|/g , "")
          });

          // save that product to the database
          theWord.save((err) => {
              // if there's a validation error...
              if (err && theWord.errors) {
                  // send the error messages to the view
                  res.locals.errorMessages = theWord.errors;

                  // display the form again with the errors
                  res.render('home.ejs');
                  return;
              }

              // if there's a database error...
              if (err && !theWord.errors) {
                  // skip to the error handler middleware
                  next(err);
                  // return to avoid showing the view
                  return;
                    // early return instead of "else"
              }

              // STEP #3 redirect
              // ALWAYS redirect after a successful to POST to avoid resubmitting
              // res.redirect('/');
              // res.render('home', {req: req.body});
                // You can only redirect to a URL
      });
  }

var wordsToBeDeletedArray = req.body.wordsToBeDeleted.split(",");
  for (var i = 0; i <= wordsToBeDeletedArray.length - 1; i++){
    WordModel.remove({word: wordsToBeDeletedArray },
      (err, wordInfo) => {
          if (err) {
              next(err);
              return;
          }

      }
    );
  }

wordsInDailyLearningListArray = req.body.wordsInLearningList.split(",");
definitionsCorrectAnswersArray = req.body.definitionsCorrectAnswer.split("|,");
wordsCorrectInQuizArray = req.body.wordsCorrectInQuiz.split(",");
wordsIncorrectInQuizArray = req.body.wordsIncorrectInQuiz.split(",");
uniqueCorrectWords = uniq(wordsCorrectInQuizArray);
uniqueIncorrectWords = uniq(wordsIncorrectInQuizArray);


function uniq(a) {
   return Array.from(new Set(a));
}
if(uniqueCorrectWords[0] === ''){
  uniqueCorrectWords = [];
}
if(uniqueIncorrectWords[0] === ''){
  uniqueIncorrectWords = [];
}

  if(req.body.wordsInLearningList !== ""){
    var theDate = new DateModel({
        words: wordsInDailyLearningListArray,
        definitions: definitionsCorrectAnswersArray,
        correctWords: uniqueCorrectWords,
        incorrectWords: uniqueIncorrectWords
    }); //  |                          |
        // from SCHEMA            from INPUT NAMES
    // save that product to the database
    console.log(req.body.wordsInLearningList);
    console.log(theDate);
    theDate.save((err) => {
        // if there's a validation error...
        if (err && theDate.errors) {
            // send the error messages to the view
            res.locals.errorMessages = theDate.errors;

            return;
        }

        // if there's a database error...
        if (err && !theDate.errors) {
            // skip to the error handler middleware
            next(err);
            // return to avoid showing the view
            return;
              // early return instead of "else"
        }
        // STEP #3 redirect
        // ALWAYS redirect after a successful to POST to avoid resubmitting

        // res.render('home', {req: req.body});
          // You can only redirect to a URL
    });
  }



}); // close POST /products


// app.post('/:word/delete', (req, res, next) => {
//
//   WordModel.deleteOne(
//     { word: req.params.word },
//
//     (err, wordFromDb) => {
//         if (err) {
//             next(err);
//             return;
//         }
//
//   res.locals.wordInfo = wordFromDb;
//
//   res.redirect('/');
//         }); // close theUser.save((err) => { ...
//
//     DateModel.findByIdAndRemove(
//       req.params.wordId,
//
//       (err, dateInfo) => {
//           if (err) {
//               next(err);
//               return;
//           }
//       }
//     );
// }); // close POST /words/:wordId/delete

app.post('/:wordId/delete', (req, res, next) => {

    WordModel.findByIdAndRemove(
      req.params.wordId,

      (err, wordInfo) => {
          if (err) {
              next(err);
              return;
          }

          res.redirect('/');
      }
    );
    DateModel.findByIdAndRemove(
      req.params.wordId,

      (err, dateInfo) => {
          if (err) {
              next(err);
              return;
          }
      }
    );
}); // close POST /words/:wordId/delete

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// All signup and login views
app.get('/signup', (req, res, next) => {
    // redirect to home if you are already logged in
    // (and therefore already signed up)
    if (req.user) {
        res.redirect('/');
        return;
    }

    res.render('auth-views/signup-form.ejs');
});

app.post('/process-signup', (req, res, next) => {
    // if either email or password are blank
    if (req.body.signupEmail === "" || req.body.signupPassword === "") {
        res.locals.feedbackMessage = 'We need both email and password.';
        res.render('auth-views/signup-form.ejs');
        return;
    }

    // check the database to see if there's a user with that email
    UserModel.findOne(
      { email: req.body.signupEmail },

      (err, userFromDb) => {
          if (err) {
              next(err);
              return;
          }

          // "userFromDb" will be "null" if we didn't find anything

          // is this email taken?
          // it is if we found a user
          if (userFromDb) {
              res.locals.feedbackMessage = 'Email taken.';
              res.render('auth-views/signup-form.ejs');
              return;
          }
          // if we get to this line, we have the green light to save!

          // encrypt the password
          const salt = bcrypt.genSaltSync(10);
          const scrambledPass = bcrypt.hashSync(req.body.signupPassword, salt);

          // save the user
          const theUser = new UserModel({
              email: req.body.signupEmail,
              encryptedPassword: scrambledPass
          });

          theUser.save((err) => {
              if (err) {
                  next(err);
                  return;
              }

              // set a flash message for feedback after the redirect
              req.flash('signupSuccess', 'Sign up successful! Try logging in.');

              res.redirect('/');
          }); // close theUser.save((err) => { ...
      }
    ); // close UserModel.findOne( ...
});  // close POST /process-signup


app.get('/login', (req, res, next) => {
    // redirect to home if you are already logged in
    if (req.user) {
        res.redirect('/');
        return;
    }

    // check for feedback messages from the log in process
    res.locals.flashError = req.flash('error');

    // check for feedback messages from the log out process
    res.locals.logoutFeedback = req.flash('logoutSuccess');

    res.locals.securityFeedback = req.flash('securityError');

    res.render('auth-views/login-form.ejs');
});

app.post('/process-login',
          // name of strategy   settings object
          //               |     |
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  })
);


app.get('/logout', (req, res, next) => {
    // special passport method for clearing the session
    // (emptying the bowl)
    req.logout();

    // set a flash message for feedback after the redirect
    req.flash('logoutSuccess', 'Log out successful.');

    res.redirect('/login');
});
// Tells Express that we want to start accepting connections
app.listen(process.env.PORT || 3000, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port on 3000");
    }
});

// Cheerio example from youtube girl
// request('http://www.majortests.com/sat/wordlist-01',function(err,resp,body){
//   if(err && resp.statusCode == 200){
//     var $ = cheerio.load(body);
//     $('th').each(function(){
//       var url = this.attr('href');
//       urls.push(url);
//       console.log(urls);
//     });
//
//   }
// });
// var number;
// var satWords = [];
// var tableHeaders;
// var text = '';

// function getAllShit(){
// // for(var i = 21; i <= 27; i++){
//  // number = i;
//  // var numberString = number.toString();
//  var url = 'http://www.cram.com/flashcards/gmat-vocabulary-288385';
//  console.log(url);
//  request(url, function (error, resp, body) {
//    var $ = cheerio.load(body);
//
//   //  console.log($('.front_text')[0].children[0].data)
//    for(var i = 1400; i <= 1410; i++){
//      if($('.front_text')[i]){
//     //  console.log($('.front_text')[i].children[0].data)
//    }
//   //  else {
//   //    break;
//   //  }
//      var word = $('.front_text')[i].children[0].data;
//      satWords.push(word);
//      text += satWords[i].replace(/\s/g, '') + ',';
//      console.log(text);
//    }
//
//
//  });
// // }
// }
// getAllShit()

// request(url, function (error, resp, body) {
//   var $ = cheerio.load(body);
//   for(var i = 0; i <= 500; i++){
//     if($('th')[i]){
//       tableHeaders = $('th')[i].children[0].data;
//       satWords.push(tableHeaders);
//     }
//     else{
//       break;
//     }
//   }
//   for(var i = 0; i <= satWords.length - 1; i++){
//     text += satWords[i] + ',';
//   };
//   console.log(text);
// });
  // var tableHeadersText = tableHeaders.text();
