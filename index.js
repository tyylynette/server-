const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ bye: 'buddy' });
});

const PORT = process.env.PORT || 5000; //if heroku use heroku's assigned port, else use our own
app.listen(PORT);
