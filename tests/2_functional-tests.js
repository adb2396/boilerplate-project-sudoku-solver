const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const [[validPuzzleString, validPuzzleSolution]] = puzzlesAndSolutions;
  const invalidPuzzleString = '7.9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.#';
  const shortPuzzleString = '7.9..5.1.8514....2432......1...69.83';
  const unSolvablePuzzle = `${validPuzzleString.substring(0,0)}2${validPuzzleString.substring(1)}`;

  /**
   * POST /api/solve tests
   */
  suite('POST /api/solve tests', function() {
    
    test('solve a puzzle with valid puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: validPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { solution: validPuzzleSolution });
          }
        });
      done();
    });

    
    test('solve a puzzle with missing puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Required field missing' });
          }
        });
      done();
    });

    
    test('solve a puzzle with invalid characters', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: invalidPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          }
        });
      done();
    });

    
    test('solve a puzzle with incorrect length', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: shortPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Expected puzzle to be 81 characters long' }
            );
          }
        });
      done();
    });

    
    test('solve a puzzle that cannot be solved', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: unSolvablePuzzle })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Puzzle cannot be solved' }
            );
          }
        });
      done();
    });
  });

  /**
   * POST /api/check Tests
   */    
  suite('POST /api/check Tests', function() {
    test('check a puzzle placement with all fields', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: true }
            );
          }
        });
      done();
    });

    test('check a puzzle placement with single placement conflict', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 6 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "column" ] }
            );
          }
        });
      done();
    });

    test('check a puzzle placement with multiple placement conflicts', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 1 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "row", "column" ] }
            );
          }
        });
      done();
    });

    test('Check a puzzle placement with all placement conflicts', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "row", "column", "region" ] }
            );
          }
        });
      done();
    });

    
    test('check a puzzle placement with missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Required field(s) missing" }
            );
          }
        });
      done();
    });

    
    test('check a puzzle placement with invalid characters', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: invalidPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Invalid characters in puzzle" }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with incorrect length', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: shortPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Expected puzzle to be 81 characters long" }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with invalid placement coordinate', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'Z1', value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Invalid coordinate' }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with invalid placement value', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 11 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Invalid value' }
            );
          }
        });
      done();
    });
      
  }); 
});

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const [[validPuzzleString, validPuzzleSolution]] = puzzlesAndSolutions;
  const invalidPuzzleString = '7.9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.#';
  const shortPuzzleString = '7.9..5.1.8514....2432......1...69.83';
  const unSolvablePuzzle = `${validPuzzleString.substring(0,0)}2${validPuzzleString.substring(1)}`;

  /**
   * POST /api/solve tests
   */
  suite('POST /api/solve tests', function() {
    
    test('solve a puzzle with valid puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: validPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { solution: validPuzzleSolution });
          }
        });
      done();
    });

    
    test('solve a puzzle with missing puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Required field missing' });
          }
        });
      done();
    });

    
    test('solve a puzzle with invalid characters', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: invalidPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          }
        });
      done();
    });

    
    test('solve a puzzle with incorrect length', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: shortPuzzleString })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Expected puzzle to be 81 characters long' }
            );
          }
        });
      done();
    });

    
    test('solve a puzzle that cannot be solved', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: unSolvablePuzzle })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Puzzle cannot be solved' }
            );
          }
        });
      done();
    });
  });

  /**
   * POST /api/check Tests
   */    
  suite('POST /api/check Tests', function() {
    test('check a puzzle placement with all fields', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: true }
            );
          }
        });
      done();
    });

    test('check a puzzle placement with single placement conflict', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 6 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "column" ] }
            );
          }
        });
      done();
    });

    test('check a puzzle placement with multiple placement conflicts', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 1 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "row", "column" ] }
            );
          }
        });
      done();
    });

    test('Check a puzzle placement with all placement conflicts', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { valid: false, conflict: [ "row", "column", "region" ] }
            );
          }
        });
      done();
    });

    
    test('check a puzzle placement with missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Required field(s) missing" }
            );
          }
        });
      done();
    });

    
    test('check a puzzle placement with invalid characters', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: invalidPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Invalid characters in puzzle" }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with incorrect length', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: shortPuzzleString, coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: "Expected puzzle to be 81 characters long" }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with invalid placement coordinate', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'Z1', value: 5 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Invalid coordinate' }
            );
          }
        });
      done();
    });  

    
    test('check a puzzle placement with invalid placement value', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({ puzzle: validPuzzleString, coordinate: 'A1', value: 11 })
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            assert.equal(res.status, 200);
            assert.deepEqual(
              res.body, 
              { error: 'Invalid value' }
            );
          }
        });
      done();
    });
      
  }); 
});

