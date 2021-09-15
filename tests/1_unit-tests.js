const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings'); 

let solver = new Solver();

suite('UnitTests', () => {
  const [p1, p2, p3, p4, p5, p6] = puzzlesAndSolutions;
  const invalidPuzzleString = '7.9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.#';
  const shortPuzzleString = '7.9..5.1.8514....2432......1...69.83';

  /**
   * Validation Tests
   */
  suite('Validation tests', function() {
    test("logic handles a valid puzzle string of 81 characters", function() {
      const isValid = solver.validate(p1[0]);
      assert.deepEqual(isValid, { valid: true });
    });

    test('logic handles a puzzle string with invalid characters', function() {
      const isValidString = solver.validate(invalidPuzzleString);
      assert.deepEqual(isValidString, { error: 'Invalid characters in puzzle' });
    });

    test('logic handles a puzzle string that is not 81 characters in length', function() {
      const isValidString = solver.validate(shortPuzzleString);
      assert.deepEqual(isValidString, { error: 'Expected puzzle to be 81 characters long' });
    });
  });

  /**
   * Row Placement Tests
   */
  suite('Row placement tests', function() {
    test('logic handles a valid row placement', function() {
      const isValidPlacement = solver.checkRowPlacement(p1[0], 'E', 5, 4);
      assert.deepEqual(isValidPlacement, { valid: true });
    });

    test('logic handles an invalid row placement', function() {
      const isValidPlacement = solver.checkRowPlacement(p1[0], 'A', 2, 1);
      assert.deepEqual(isValidPlacement, { valid: false, conflict: [ "row" ] });
    });
  }); 

  /**
   * Column Placement Tests
   */
  suite('Column placement tests', function() {
    test('logic handles a valid column placement', function() {
      const isValidPlacement = solver.checkColPlacement(p1[0], 'D', 4, 2);
      assert.deepEqual(isValidPlacement, { valid: true });
    });

    test('logic handles an invalid column placement', function() {
      const isValidPlacement = solver.checkColPlacement(p1[0], 'A', 1, 6);
      assert.deepEqual(isValidPlacement, { valid: false, conflict: [ "column" ] });
    });
  });

  /**
   * Region Placemnet Tests
   */
  suite('Region placement tests', function() {
    test('logic handles a valid region (3x3 grid) placement', function() {
      const isValidPlacement = solver.checkRegionPlacement(p1[0], 'H', 4, 1);
      assert.deepEqual(isValidPlacement, { valid: true });
    }); 

    test('logic handles an invalid region (3x3 grid) placement', function() {
      const isValidPlacement = solver.checkRegionPlacement(p1[0], 'H', 4, 4);
      assert.deepEqual(isValidPlacement, { valid: false, conflict: [ "region" ] });
    });
  });

  /**
   * Solver tests
   */
  suite('Solver tests', function() {
    test('valid puzzle strings pass the solver', function() {
      const solvedPuzzle = solver.solve(invalidPuzzleString);
      assert.deepEqual(solvedPuzzle, { error: "Invalid characters in puzzle" });
    });

    test('invalid puzzle strings fail the solver', function() {
      let newPuzzleString = `${p1[0].substring(0, 0)}2${p1[0].substring(1)}`;
      const solvedPuzzle = solver.solve(newPuzzleString);
      assert.deepEqual(solvedPuzzle, { error: "Puzzle cannot be solved" });
    });

    test('solver returns the expected solution for an incomplete puzzle', function() {
      const solvedPuzzle = solver.solve(p1[0]);
      assert.deepEqual(solvedPuzzle, { solution: p1[1] });
    });
  });
});
