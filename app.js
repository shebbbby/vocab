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

const WordModel = require('./models/vocab-model.js');
const UserModel = require('./models/user-model.js');

mongoose.connect('mongodb://localhost/vocab');
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
});

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

// STEP #2 of the product create submission process
// <form method="post" action="/products">
app.post('/', (req, res, next) => {
    // create a new product object
    const theWord = new WordModel({
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
          // You can only redirect to a URL
    });
}); // close POST /products


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
app.listen(3000);