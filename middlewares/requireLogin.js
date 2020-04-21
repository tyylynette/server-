module.exports = (req, res, next) => {
  if (!req.user) {
    //user not logged in, throw error
    return res.status(401).send({ error: 'You must log in!' });
  }
  //otherwise pass to next middleware or route handler
  next();
};
