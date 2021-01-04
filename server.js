const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const repairs = require('./controllers/repairs');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const converter = require('./controllers/converter');
const createlogin = require('./controllers/createlogin');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    // host: 'postgresql-concentric-15283',
    // user: 'postgres',
    // password: 'gyzvek',
    // database: 'extranet',
    // timezone: 'UTC',
  },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

//Register and Sigin routes
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//Profile routes
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//Repairs routes
app.get('/repairsworkshop/:email', repairs.handleWorkshopRepairs(db));
app.get('/repairsclosed/:email', repairs.handleClosedRepairs(db));

// app.put('/image', (req, res) => {
//   image.handleImage(req, res, db);
// });
// app.post('/imageurl', (req, res) => {
//   image.handleApiCall(req, res);
// });

// Test connection
app.get('/test', test.test(db));

//Create users from db for login
app.get('/createlogin', createlogin.handleCreateLogin(db, bcrypt));
// app.get('/converter', converter.converterImage(db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
