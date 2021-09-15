'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { validatePostCheckRoute } = require('../utils/validator');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const isValid = validatePostCheckRoute(
        req.body.puzzle, req.body.coordinate, req.body.value
      );

      if(isValid.valid) {
        const { puzzle, coordinate, value } = req.body;
        const [row, column] = coordinate;
        const col = parseInt(column);
        const val = parseInt(value);

        //check for row conflicts 
        const isValidRow = solver.checkRowPlacement(puzzle, row, col, val);

        //check for col conflicts 
        const isValidCol = solver.checkColPlacement(puzzle, row, col, val);

        //check for region conflicts 
        const isValidRegion = solver.checkRegionPlacement(puzzle, row, col, val);

        if(isValidRow.valid && isValidCol.valid && isValidRegion.valid) {
          // send response of valid placement
          res.json(isValidRow);
        } else {
          let conflict = [];
          if(isValidRow.conflict) conflict.push(...isValidRow.conflict);
          if(isValidCol.conflict) conflict.push(...isValidCol.conflict);
          if(isValidRegion.conflict) conflict.push(...isValidRegion.conflict);

          // send response of one or multiple conflicts
          res.json({ valid: false, conflict });
        }
      } else {
        res.json(isValid);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if(req.body.puzzle) {
        const { puzzle } = req.body;
        const isValid = solver.validate(puzzle);
        if(isValid.valid) {
          // check for unsolvable string
          // solve puzzle and send response
          const puzzleSolution = solver.solve(puzzle);
          // send valid solution string in response
          res.json(puzzleSolution);
        } else {
          res.json(isValid);
        }
      } else {
        res.json({ error: 'Required field missing' });
      }
    });
};
