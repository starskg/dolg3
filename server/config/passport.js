const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db');
require('dotenv').config();

// Passport сериализация ва десериализация
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth стратегияси
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Фойдаланувчи базада бор-ёқлигини текширамиз
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [
          profile.emails[0].value,
        ]);

        if (rows.length > 0) {
          // Агар фойдаланувчи мавжуд бўлса
          return done(null, rows[0]);
        }

        // Агар фойдаланувчи йўқ бўлса, янгисини яратамиз
        const [result] = await db.query(
          'INSERT INTO users (name, email, avatar_url) VALUES (?, ?, ?)',
          [profile.displayName, profile.emails[0].value, profile.photos[0].value]
        );

        const newUser = {
          id: result.insertId,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar_url: profile.photos[0].value,
        };

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;