const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // tell express to use cookies to do auth
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
  //tell express that it needs to make use of cookies
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //passed in milliseconds
    keys: [keys.cookieKey]
  })
);

//tell passport that it needs to make use of cookies
app.use(passport.initialize());
app.use(passport.session());

//return function then call with express app object
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //first make sure expresss will serve up production assets
  //like our main.js file, or main.css file
  app.use(express.static(path.join(__dirname, 'client/build'))); //look into client directory for matching file

  //otherwise express will serve up our index.html file
  //if it can't find the file in client/build dir
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; //if heroku use heroku's assigned port, else use our own
app.listen(PORT);
