const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const repairs = require('./controllers/repairs');
const repairBudget = require('./controllers/repairBudget');
const profile = require('./controllers/profile');
// const image = require('./controllers/image');
const converter = require('./controllers/converter');
const login = require('./controllers/login');
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
app.get('/repairs', repairs.handleRepairs(db));
// app.get('/repairsworkshop/:email', repairs.handleWorkshopRepairs(db));
// app.get('/repairsclosed/:email', repairs.handleClosedRepairs(db));

// Budget repair routes
app.post('/budgetaccept', repairBudget.handleAcceptBudget(db, bcrypt));
app.post('/budgetreject', repairBudget.handleRejectBudget(db, bcrypt));

//Create and update users for login table
app.get('/createlogin', login.handleCreateLogin(db, bcrypt, saltRounds));
// app.get('/createAllLogin', login.handleCreateAllLogin(db, bcrypt, saltRounds));
app.post('/updatelogin', login.handleUpdateLogin(db, bcrypt, saltRounds));
app.post(
  '/updatepasswordlogin',
  login.handleUpdatePasswordLogin(db, bcrypt, saltRounds)
);

// Test connection
app.get('/reparaciones', test.reparaciones(db));
app.get('/clientes', test.clientes(db));
app.get('/direcciones', test.direcciones(db));
app.get('/repairstest', test1.handleRepairs(db));
app.get('/pruebasignin', test.pruebaSignin(db, bcrypt));

app.get('/converter', converter.converterImage(db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
