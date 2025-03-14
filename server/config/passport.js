require('dotenv').config(); // .env файлини фаоллаштириш

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../config/db'); // База маълумотларига уланиш
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');






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


// Local стратегияси
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return done(null, false, { message: 'Email нотўғри' });
      }

      const user = rows[0];
      if (!user.password) {
        return done(null, false, { message: 'Бу аккаунтда пароль мавжуд эмас' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Пароль нотўғри' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
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
// Facebook OAuth стратегияси
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email', 'photos']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        const avatar = profile.photos && profile.photos[0]?.value;

        if (!email) {
          return done(new Error('Facebook аккаунтда электрон почта топилмади.'));
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
          // Фойдаланувчи мавжуд бўлса
          return done(null, rows[0]);
        }

        // Янги фойдаланувчи бўлса, базага қўшамиз
        const [result] = await db.query(
          'INSERT INTO users (name, email, avatar_url) VALUES (?, ?, ?)',
          [profile.displayName, email, profile.photos[0].value]
        );

        const newUser = {
          id: result.insertId,
          name: profile.displayName,
          email: email,
          avatar_url: profile.photos[0].value
        };

        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;