module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    //user not logged in, throw error
    return res.status(403).send({ error: 'Not enough credits!' });
  }
  //otherwise pass to next middleware or route handler
  next();
};
