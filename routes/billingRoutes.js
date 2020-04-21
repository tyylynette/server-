const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  //when user clicks pay now, this endpoint is called
  //requireLogin middleware is called whenever call is made to the endpoint
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });

    req.user.credits += 5; //add 5 credits to the user model
    const user = await req.user.save(); //save the user model to mongoDB
    res.send(user); //send user back as response to  call to this endpoint
  });
};
