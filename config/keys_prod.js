module.exports = {
  mongoURI: process.env.MONGO_URI,
  email: process.env.EMAIL,
  secretOrKey: process.env.SECRET_OR_KEY,
  // cloudinary: {
  //   cloud_name: process.env.CLOUD_NAME,
  //   api_key: process.env.API_KEY,
  //   api_secret: process.env.API_SECRET
  // },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  },
  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
  },
};
