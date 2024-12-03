// ********************** Initialize server **********************************

const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);


// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});


// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

describe('Testing Register API', () => {
  it('positive : /register', (done) => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'testuser', password: 'securepassword123', degree: 'Computer Science' })
      .end((err, res) => {
        expect(res).to.have.status(200); 
        done();
      });
  });
});

describe('Testing Register API', () => {
  it('negative : /register with invalid input', (done) => {
    chai
      .request(server)
      .post('/register')
      .send({ username: '', password: 'short' }) // Invalid input
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing required fields.');
        done();
      });
  });
});

before(async () => {
  const username = 'testuser';
  const password = 'testpassword';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert user into the database
    await db.none('INSERT INTO users(username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [
      username,
      hashedPassword,
    ]);
    console.log('Test user inserted');
  } catch (err) {
    console.error('Error inserting test user:', err);
  }
});

after(async () => {
  try {
    // Remove test user from the database
    await db.none('DELETE FROM users WHERE username = $1;', ['testuser']);
    console.log('Test user removed');
  } catch (err) {
    console.error('Error deleting test user:', err);
  }
});

describe('Testing Login API', () => {
  it('positive: should successfully log in with valid credentials', (done) => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('negative: should return an error message on unsuccessful login', (done) => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'invaliduser', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
  
        done();
      });
  });
  
});



// ********************************************************************************