// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

class course {
  constructor(department, course_code, course_name, description, hours_elective, hours_core, hours_foundational, pre_reqs, counts_for) {
  this.department = department
  this.course_code = course_code
  this.course_name = course_name
  this.description = description
  this.hours_elective = hours_elective
  this.hours_core = hours_core
  this.hours_foundational = hours_foundational
  this.pre_reqs = pre_reqs
  this.counts_for = counts_for
}};

<<<<<<< HEAD
const all_courses = []
const queried_course = "" // Added by Truman, trying to model how Nick grabbed the whole db
=======
var all_courses = []
>>>>>>> fbe36adc0c5922c66cb657eed7e78d432357367f

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here
app.get('/', async (req, res) => 
{
  res.render('pages/home', {user: req.session.user});
});

//Register ----------------------------------------------------------------------------------------------
app.get('/register', async (req, res) => 
{
  res.render('pages/register', {user: req.session.user}); //User item in session
});
  
app.get('/scheduleBuilder', (req, res) => 
{
  if(!req.session.user)
  {
    return res.redirect('/login');
  }
  res.render('pages/scheduleBuilder', 
    {
      years: [
          { name: "Year 1" },
          { name: "Year 2" },
          { name: "Year 3" },
          { name: "Year 4" }
      ],
      user: req.session.user
  });
});

app.post('/register', async (req, res) =>
{
  const { username, password, degree } = req.body; //getting request info
  try
  {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);

  // To-DO: Insert username and hashed password into the 'users' table
  await db.query('INSERT INTO users(username, password, degree) VALUES ($1, $2, $3);', [username, hash, degree]);
  console.log("User was inserted into the database");
  return res.redirect('/login'); //it worked, redirect to login route
  }

  catch(error)
  {
    return res.redirect('/register'); //didnt work, go back to the register page
  }
});


//Login ----------------------------------------------------------------------------------------------
app.get('/login', (req, res) => 
{
  res.render('pages/login', {user: req.session.user});
});


app.post('/login', async (req, res) => 
{
  const { username, password } = req.body; // getting the request info
  const userRes = await db.query('SELECT * FROM users WHERE username = $1', [username]); // find them by username

  if (userRes.length == 0) { // user isn't found
    console.log("User was probably not inserted");
    return res.redirect('/register'); // back to register pg
  }

  const user = userRes[0]; // user object found
  const storedPassword = user.password.toString('utf-8'); // Convert BTEA to string

  // Check if the password from request matches with password in DB
  const match = await bcrypt.compare(password, storedPassword); // Compare with the string value
  
  if (!match) { // couldn't find a full match 
    console.log("Found the username, but not a password");
    return res.render('pages/login', { message: 'Incorrect username or password.', user: req.session.user });
  } else { // found a match, save user details in session like in lab 7
    // Authentication Middleware
    const auth = (req, res, next) => {
      if (!req.session.user) {
        // Default to login page.
        return res.redirect('/login');
      }
      next();
    };

    // Authentication Required
    app.use(auth);
    console.log("User found, time to register");
    req.session.user = user;
    req.session.save();
    populateCourses();
    return res.redirect('/scheduleBuilder');
  }
});

// test IS A TEMPORARY VARIABLE HANNAH, CHANGE THE NAME TO SMT SMARTER LATER !!!!

app.get('/test', (req, res) => 
{
  res.render('pages/test');
});

//Log out ----------------------------------------------------------------------------------------------
app.get('/logout', (req, res) => 
{
  req.session.destroy(); //destory the session
  res.redirect('/'); //back to home after logging out
});

//Search courses -----------------------------------------------
// Grabs entire table in one query and slices it up, may be bad

async function populateCourses(){
  all_courses = await db.query('SELECT * FROM courseregistry');
  console.log(all_courses[0].classcode);
  console.log('what the fuck');
}

<<<<<<< HEAD
async function searchForCourse(input)
{
  var queriedCourse = await db.query('SELECT * from courseregistry WHERE ClassCode = $input');

  // If query not found, return null or something to tell the sight it wasn't found
  if(queriedCourse == NULL) { queriedCourse = ""; return; } // Log something here
  
  queried_course = queriedCourse;
}


=======
>>>>>>> fbe36adc0c5922c66cb657eed7e78d432357367f
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
