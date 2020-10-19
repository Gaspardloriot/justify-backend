//Dependencies
const port = process.env.PORT||3000;
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const JustifyUser = require('./models/justifyUsers');
const paraFind = require('./modules/justifier');
const tokenDecrypt = require('./modules/decrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//Server, database connection
const uri = 'mongodb+srv://gaspard_loriot:Vivite03@cluster0.ryu9z.mongodb.net/mongoTest?retryWrites=true&w=majority';
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => console.err)
db.once('open', () => {
  console.log(`Connected to database ${db.name}...`)
});


corsOptions = {
  origin: "https://shrouded-ocean-40875.herokuapp.com/",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


//Setting up CORS, JSON
app.use(express.json())
app.use(cors());


//Setting up response for text body
app.use(function (req, res, next) {
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) { req.text += chunk });
    req.on('end', next);
  } else {
    next();
  }
});

//Initialize
app.get('/', (req, res) => {
  res.send('server Initialized...')
})


//verify token
const verifyToken = (req, res, next) => {
  //Get auth header
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //Split at the space
    const bearer = bearerHeader.split(' ');
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    next();
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}



//Justify
app.post('/justify/:id', verifyToken, (req, res) => {
  jwt.verify(tokenDecrypt(req.token), 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const wholeString = req.text;
      const stringLength = wholeString.length;
      const userId = req.params.id;
      JustifyUser.findOne({ _id: userId }).then((result) => {
        const user = result;
        authData.user=user;
        let update = true;
        const day = 86400000;
        const timer = user.timer.getTime();
        const now = Date.now();
        if (now - timer < day) update = false;
        if (update) {
          user.timer = Date.now();
          user.characters = 80000;
          const final = paraFind(wholeString);
          res.json([final, authData.user]);
        } else {
          if (user.characters >= stringLength) {
            const final = paraFind(wholeString);
            user.characters = user.characters - stringLength;            
            res.json([final, authData.user]);
          }
          else {
            res.json([[['Error 402, Please send payment']], authData.user])
          }
        };
        console.log(authData.user);
        user.save();
      });
    }
  });

})


app.post('/add-connect', (req, res) => {
  const userEmail = req.body.email;
  let user = '';
  //Case user does not exist (sign-up)
  JustifyUser.findOne({ email: userEmail }).then((result) => {
    if (result === null) {
      user = new JustifyUser({
        email: userEmail,
        characters: 80000,
        timer: Date.now()
      });
      console.log(`user ${user._id} has been added...`);
      //Case user exists (sign-in)
    } else {
      user = result;
      let update = true;
      const day = 86400000;
      const timer = user.timer.getTime();
      const now = Date.now();
      if (now - timer < day) update = false;
      if (update) {
        user.timer = Date.now();
        user.characters = 80000;
      };
      console.log(`user ${user._id} connected...`);
    };
    //Saving changes to database
    //Token identification
    user.save();
    jwt.sign({ user }, 'secretkey', (err, token) => {
      if (err) sendStatus(403);
      //Encrypt token on localstorage
      const mykey = crypto.createCipher('aes-128-cbc', 'token');
      let encrypted = mykey.update(token, 'utf8', 'hex')
      encrypted += mykey.final('hex');
      const response = { encrypted, user }
      res.json(response);
    })
  });
});

app.listen(port, () => {
  console.log(`test-api listening at http://localhost:${port}...`)
});

