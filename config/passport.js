// import all the things we need
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports = function (passport){
  passport.use(
    new GoogleStrategy(
      {
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: '/auth/google/callback',
				passReqToCallback: true

      },
      async (accessToken, refreshToken, profile, done) =>{
        // get the user data from google
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.giveName,
          lastName: profile.name.familyName,
          Image: profile.Image.photo[0].value,
          email: profile.emails[0].value
        }

        try {
          //find the user in our database
          let user = await User.findOne({googleId:profile.id})

          if(user){
            //if user present in our database.
            done(null, user)
          }
          else{
            //if user is not present in our database save user data to database.
            user = await User.create(newUser)
            done(null, user)
          }

        } catch (err) {
          console.log(err);
        }
      }
    )
  )

  //used to serialize the user for the session
  passport.serializeUser((user,done) => {
    done(null, user.id)
  })

  //used to deserialize the user 
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err,user))
  })
}