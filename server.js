const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const repairs = require('./controllers/repairs');
const profile = require('./controllers/profile');
// const image = require('./controllers/image');
const converter = require('./controllers/converter');
const createlogin = require('./controllers/createlogin');
const test = require('./controllers/test');
const test1 = require('./controllers/test1');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: {
    // connectionString: process.env.DATABASE_URL,
    // connectionString: process.env.HEROKU_POSTGRESQL_SILVER_URL,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    // LOCALHOST
    host: '127.0.0.1',
    user: 'postgres',
    password: 'gyzvek',
    database: 'extranet',
    timezone: 'UTC',
  },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

//Register and Signin routes
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
app.get('/reparaciones', test.reparaciones(db));
app.get('/clientes', test.clientes(db));
app.get('/direcciones/:email', test.direcciones(db));
app.get('/repairs', test1.handleRepairs(db));

//Create users from db for login
app.get('/createlogin', createlogin.handleCreateLogin(db, bcrypt));

app.get('/converter', converter.converterImage(db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
