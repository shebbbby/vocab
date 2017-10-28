const passport = require('passport');

const UserModel = require('../models/user-model.js');


// "serializeUser" is called when the user logs in.
// it determines what gets saved into the session when you log in.
passport.serializeUser((userFromDb, done) => {
      // tell passport we want to save the ID inside the session
      //                   |
    done(null, userFromDb._id);
      //   |
      // "null" as the first argument means "no error" (good)
});


// "deserializeUser" is called on every request AFTER logging in.
// it tells passport how to get the user's information
// with the contents of the session (in this case, the ID).
passport.deserializeUser((idFromBowl, done) => {
    UserModel.findById(
      idFromBowl,

      (err, userFromDb) => {
          // if there's a database error, inform passport.
          if (err) {
              done(err);
              return;
          }

            // give passport the user document from the database
            //            |
          done(null, userFromDb);
            //   |
            // "null" as the first argument means "no error" (good)
      }
    );
});



// ---------------------------------------------------------------------
//
// STRATEGIES SETUP


const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// "passport.use()" sets up a new strategy
passport.use(
  new LocalStrategy(
    // 1st arg -> settings object
    {
        usernameField: 'loginEmail',
        passwordField: 'loginPassword'
    }, //     |              |
       //     |         names of your input fields
       // settings defined by LocalStrategy

    // 2nd arg -> callback
    (emailValue, passValue, done) => {
        // find the user in the DB with that email
        UserModel.findOne(
          { email: emailValue },

          (err, userFromDb) => {
              if (err) {
                  done(err);
                  return;
              }

              // "userFromDb" will be "null" if we didn't find anything
              if (userFromDb === null) {
                    // "null" here again means "no error"
                    //  |  LOGIN FAILED (email is wrong)
                    //  |      |
                  done(null, false, { message: 'Email is wrong. 💩' });
                  return;
              }

              // confirm that the password is correct
              const isGoodPassword =
                  bcrypt.compareSync(passValue, userFromDb.encryptedPassword);

              if (isGoodPassword === false) {
                    // "null" here again means "no error"
                    //  |  LOGIN FAILED (password is wrong)
                    //  |      |
                  done(null, false, { message: 'Password is wrong. 💩' });
                  return;
              }

              // if everything works, send passport the user document.
              done(null, userFromDb);
                //           |
                // passport takes "userFromDb" and calls "serializeUser"
          }
        ); // close UserModel.findOne( ...
    }
  ) // close new LocalStrategy( ...
);
