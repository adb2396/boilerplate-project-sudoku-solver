const SudokuSolver = require('../controllers/sudoku-solver.js');


exports.validatePostCheckRoute = function(puzzle, coordinate, value) {
  let solver = new SudokuSolver();
  const rowRgx = /^[A-I]$/;
  const numRgx = /^[1-9]$/;

  if(puzzle && coordinate && value) {
    // validate string for length and incorrect characters
    const isValid = solver.validate(puzzle);

    if(isValid.valid) {
      // check for valid coordinate
      const [row, col] = coordinate;
      if(rowRgx.test(row) && numRgx.test(col)) {
        // check for valid value
        if(numRgx.test(value)) return { valid: true };
        
        return { error: 'Invalid value' }
      } 
      return { error: 'Invalid coordinate' }
    } 
    return isValid;
  } 
  return { error: "Required field(s) missing" }
};