const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  // retrieve  from mongoDB list of surveys created by current user
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false // don't return list of recipients (to be prevent thousands of recipients being returned)
    });
    res.send(surveys);
  });

  // route to confirm response received to survey respondants
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  //get events from sendgrid, extract click event, unique recipient and choice
  //then check mongoDB for matching surveyId and recipient, make sure responded flag is false
  //then update recipient response
  app.post('/api/surveys/webhooks', (req, res) => {
    //parser to check the sendgrid click events
    const p = new Path('/api/surveys/:surveyId/:choice'); // tell parser which variable to check from pathname
    _.chain(req.body)
      .map(({ email, url }) => {
        // new URL(url).pathname extractsthe route from the url
        // if parser matches then return variables in match object, if not null
        const match = p.test(new URL(url).pathname);
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact() //remove any undefined records (records that failed the checks)
      .uniqBy('email', 'surveyId') //remove records where BOTH email & surveyId are duplicated
      .each(({ surveyId, email, choice }) => {
        //run mongoDB query for every event
        Survey.updateOne(
          {
            _id: surveyId, //find matching surveyId
            recipients: {
              $elemMatch: { email: email, responded: false } //find matching email and response = false
            }
          },
          {
            $inc: { [choice]: 1 }, // find yes/no property and increment by one
            $set: { 'recipients.$.responded': true }, //look at recipients subdoc, find recipient, update responded to true
            lastResponded: new Date()
          }
        ).exec(); //execute query
      })
      .value();
    res.send({});
  });

  //route to create new survey and send out email to recipients
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body; //get these properties from the req body

    const survey = new Survey({
      //insert properties from req body into new survey instance
      title, //same as title: title
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), //split string by comma then map to array
      _user: req.user.id,
      dateSent: Date.now()
    });

    //Send off email using sendgrid
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send(); // wait for sendgrid api to send email
      await survey.save(); //save survey instance to mongoDb
      req.user.credits -= 1;
      const user = await req.user.save(); //get back updated user model from mongoDB

      res.send(user); //send back updated user model to client
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
