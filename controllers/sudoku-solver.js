class SudokuSolver {

  getRowMap(){
    return { 
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
      0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I'
    }
  }

  validate(puzzleString) {
    let resp;
    if(puzzleString.length !== 81) {
      resp = { error: 'Expected puzzle to be 81 characters long' };
    } else if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      resp = { error: 'Invalid characters in puzzle' };
    } else {
      resp = { valid: true };
    }
    return resp;
  }

  parsePuzzleToString(puzzleBoard) {
    let pString = '';
    puzzleBoard.forEach((row) => pString+=row.join(""));
    return pString;
  }

  parsePuzzleToArray(puzzleString) {
    let parsedPuzzle = [];
    const puzzleArray = puzzleString.split('').map(s => s === '.' ? 0 : +s);

    for(let i=0; i<puzzleArray.length; i+=9) {
      parsedPuzzle.push(puzzleArray.slice(i, i+9));
    }
    return parsedPuzzle;
  }

  getDotPositions(puzzleBoard) {
    let dotPositions = [];
    for(let i=0; i<puzzleBoard.length; i++) {
      for(let j=0; j<puzzleBoard[i].length; j++) {
        if(puzzleBoard[i][j] === 0) {
          dotPositions.push([i, j]);
        } 
      }
    }
    return dotPositions;
  }

  checkValue(pBoard, row, col, value) {
    const rgRow = this.getRowMap()[row];
    const pString = this.parsePuzzleToString(pBoard);
    
    const isRow = this.checkRowPlacement(pString, row, col+1, value).valid;
    const isCol = this.checkColPlacement(pString, row, col+1, value).valid;
    const isRegion = this.checkRegionPlacement(pString, rgRow, col+1, value).valid;

    if(isRow && isCol && isRegion) return true;

    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowIdx = /^[0-9]$/.test(row) ? row : this.getRowMap()[row];

    for(let i=0; i<pBoard[rowIdx].length; i++) {
      if(pBoard[rowIdx][i] === value) {
        return { valid: false, conflict: [ "row" ] };
      }
    }  

    return { valid: true }; 
  }

  checkColPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);

    // console.log("**", row, column, value);

    for(let i=0; i<pBoard.length; i++) {
      // console.log()
      if(pBoard[i][column-1] === value) {
        return { valid: false, conflict: [ "column" ] };
      }
    } 

    return { valid: true }; 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowsInRegionMap = { 
      'A': 0, 'B': 0, 'C': 0, 'D': 3, 'E': 3, 'F': 3, 'G': 6, 'H': 6, 'I': 6 
    };
    const colsInRegionMap = { 1: 0, 2: 0, 3: 0, 4: 3, 5: 3, 6: 3, 7: 6, 8: 6, 9: 6 };
    const idxOfCol = colsInRegionMap[column];
    const idxOfRow = rowsInRegionMap[row];

    for(let i=idxOfRow; i<idxOfRow+3; i++) {
      for(let j=idxOfCol; j<idxOfCol+3; j++) {
        if(pBoard[i][j] === value) {
          return { valid: false, conflict: [ "region" ] };
        }
      }
    }

    return { valid: true }; 
  }

  solve(puzzleString) {
    if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      return { error: "Invalid characters in puzzle" };  
    }

    const puzzleBoard = this.parsePuzzleToArray(puzzleString);
    const dotPositions = this.getDotPositions(puzzleBoard);
    const breakPt = dotPositions.length;
    let limit = 9, i, row, col, value, found;


    for(i=0; (i>=0 && i<breakPt);) {

      row = dotPositions[i][0];
      col = dotPositions[i][1];

      value = puzzleBoard[row][col] + 1;

      found = false;

      while(!found && value<=limit) {
        if(this.checkValue(puzzleBoard, row, col, value)) {
          found = true;
          puzzleBoard[row][col] = value;
          i++;
        } else {
          value++;
        }
      }

      if(!found) {
        i--;
        puzzleBoard[row][col] = 0;
      } 
    }

    if(i<0) {
      return { error: "Puzzle cannot be solved" };
    }

    return { solution: this.parsePuzzleToString(puzzleBoard) };
  }
}

module.exports = SudokuSolver;

class SudokuSolver {

  getRowMap(){
    return { 
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
      0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I'
    }
  }

  validate(puzzleString) {
    let resp;
    if(puzzleString.length !== 81) {
      resp = { error: 'Expected puzzle to be 81 characters long' };
    } else if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      resp = { error: 'Invalid characters in puzzle' };
    } else {
      resp = { valid: true };
    }
    return resp;
  }

  parsePuzzleToString(puzzleBoard) {
    let pString = '';
    puzzleBoard.forEach((row) => pString+=row.join(""));
    return pString;
  }

  parsePuzzleToArray(puzzleString) {
    let parsedPuzzle = [];
    const puzzleArray = puzzleString.split('').map(s => s === '.' ? 0 : +s);

    for(let i=0; i<puzzleArray.length; i+=9) {
      parsedPuzzle.push(puzzleArray.slice(i, i+9));
    }
    return parsedPuzzle;
  }

  getDotPositions(puzzleBoard) {
    let dotPositions = [];
    for(let i=0; i<puzzleBoard.length; i++) {
      for(let j=0; j<puzzleBoard[i].length; j++) {
        if(puzzleBoard[i][j] === 0) {
          dotPositions.push([i, j]);
        } 
      }
    }
    return dotPositions;
  }

  checkValue(pBoard, row, col, value) {
    const rgRow = this.getRowMap()[row];
    const pString = this.parsePuzzleToString(pBoard);
    
    const isRow = this.checkRowPlacement(pString, row, col+1, value).valid;
    const isCol = this.checkColPlacement(pString, row, col+1, value).valid;
    const isRegion = this.checkRegionPlacement(pString, rgRow, col+1, value).valid;

    if(isRow && isCol && isRegion) return true;

    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowIdx = /^[0-9]$/.test(row) ? row : this.getRowMap()[row];

    for(let i=0; i<pBoard[rowIdx].length; i++) {
      if(pBoard[rowIdx][i] === value) {
        return { valid: false, conflict: [ "row" ] };
      }
    }  

    return { valid: true }; 
  }

  checkColPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);

    // console.log("**", row, column, value);

    for(let i=0; i<pBoard.length; i++) {
      // console.log()
      if(pBoard[i][column-1] === value) {
        return { valid: false, conflict: [ "column" ] };
      }
    } 

    return { valid: true }; 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowsInRegionMap = { 
      'A': 0, 'B': 0, 'C': 0, 'D': 3, 'E': 3, 'F': 3, 'G': 6, 'H': 6, 'I': 6 
    };
    const colsInRegionMap = { 1: 0, 2: 0, 3: 0, 4: 3, 5: 3, 6: 3, 7: 6, 8: 6, 9: 6 };
    const idxOfCol = colsInRegionMap[column];
    const idxOfRow = rowsInRegionMap[row];

    for(let i=idxOfRow; i<idxOfRow+3; i++) {
      for(let j=idxOfCol; j<idxOfCol+3; j++) {
        if(pBoard[i][j] === value) {
          return { valid: false, conflict: [ "region" ] };
        }
      }
    }

    return { valid: true }; 
  }

  solve(puzzleString) {
    if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      return { error: "Invalid characters in puzzle" };  
    }

    const puzzleBoard = this.parsePuzzleToArray(puzzleString);
    const dotPositions = this.getDotPositions(puzzleBoard);
    const breakPt = dotPositions.length;
    let limit = 9, i, row, col, value, found;


    for(i=0; (i>=0 && i<breakPt);) {

      row = dotPositions[i][0];
      col = dotPositions[i][1];

      value = puzzleBoard[row][col] + 1;

      found = false;

      while(!found && value<=limit) {
        if(this.checkValue(puzzleBoard, row, col, value)) {
          found = true;
          puzzleBoard[row][col] = value;
          i++;
        } else {
          value++;
        }
      }

      if(!found) {
        i--;
        puzzleBoard[row][col] = 0;
      } 
    }

    if(i<0) {
      return { error: "Puzzle cannot be solved" };
    }

    return { solution: this.parsePuzzleToString(puzzleBoard) };
  }
}

module.exports = SudokuSolver;

class SudokuSolver {

  getRowMap(){
    return { 
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
      0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I'
    }
  }

  validate(puzzleString) {
    let resp;
    if(puzzleString.length !== 81) {
      resp = { error: 'Expected puzzle to be 81 characters long' };
    } else if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      resp = { error: 'Invalid characters in puzzle' };
    } else {
      resp = { valid: true };
    }
    return resp;
  }

  parsePuzzleToString(puzzleBoard) {
    let pString = '';
    puzzleBoard.forEach((row) => pString+=row.join(""));
    return pString;
  }

  parsePuzzleToArray(puzzleString) {
    let parsedPuzzle = [];
    const puzzleArray = puzzleString.split('').map(s => s === '.' ? 0 : +s);

    for(let i=0; i<puzzleArray.length; i+=9) {
      parsedPuzzle.push(puzzleArray.slice(i, i+9));
    }
    return parsedPuzzle;
  }

  getDotPositions(puzzleBoard) {
    let dotPositions = [];
    for(let i=0; i<puzzleBoard.length; i++) {
      for(let j=0; j<puzzleBoard[i].length; j++) {
        if(puzzleBoard[i][j] === 0) {
          dotPositions.push([i, j]);
        } 
      }
    }
    return dotPositions;
  }

  checkValue(pBoard, row, col, value) {
    const rgRow = this.getRowMap()[row];
    const pString = this.parsePuzzleToString(pBoard);
    
    const isRow = this.checkRowPlacement(pString, row, col+1, value).valid;
    const isCol = this.checkColPlacement(pString, row, col+1, value).valid;
    const isRegion = this.checkRegionPlacement(pString, rgRow, col+1, value).valid;

    if(isRow && isCol && isRegion) return true;

    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowIdx = /^[0-9]$/.test(row) ? row : this.getRowMap()[row];

    for(let i=0; i<pBoard[rowIdx].length; i++) {
      if(pBoard[rowIdx][i] === value) {
        return { valid: false, conflict: [ "row" ] };
      }
    }  

    return { valid: true }; 
  }

  checkColPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);

    // console.log("**", row, column, value);

    for(let i=0; i<pBoard.length; i++) {
      // console.log()
      if(pBoard[i][column-1] === value) {
        return { valid: false, conflict: [ "column" ] };
      }
    } 

    return { valid: true }; 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowsInRegionMap = { 
      'A': 0, 'B': 0, 'C': 0, 'D': 3, 'E': 3, 'F': 3, 'G': 6, 'H': 6, 'I': 6 
    };
    const colsInRegionMap = { 1: 0, 2: 0, 3: 0, 4: 3, 5: 3, 6: 3, 7: 6, 8: 6, 9: 6 };
    const idxOfCol = colsInRegionMap[column];
    const idxOfRow = rowsInRegionMap[row];

    for(let i=idxOfRow; i<idxOfRow+3; i++) {
      for(let j=idxOfCol; j<idxOfCol+3; j++) {
        if(pBoard[i][j] === value) {
          return { valid: false, conflict: [ "region" ] };
        }
      }
    }

    return { valid: true }; 
  }

  solve(puzzleString) {
    if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      return { error: "Invalid characters in puzzle" };  
    }

    const puzzleBoard = this.parsePuzzleToArray(puzzleString);
    const dotPositions = this.getDotPositions(puzzleBoard);
    const breakPt = dotPositions.length;
    let limit = 9, i, row, col, value, found;


    for(i=0; (i>=0 && i<breakPt);) {

      row = dotPositions[i][0];
      col = dotPositions[i][1];

      value = puzzleBoard[row][col] + 1;

      found = false;

      while(!found && value<=limit) {
        if(this.checkValue(puzzleBoard, row, col, value)) {
          found = true;
          puzzleBoard[row][col] = value;
          i++;
        } else {
          value++;
        }
      }

      if(!found) {
        i--;
        puzzleBoard[row][col] = 0;
      } 
    }

    if(i<0) {
      return { error: "Puzzle cannot be solved" };
    }

    return { solution: this.parsePuzzleToString(puzzleBoard) };
  }
}

module.exports = SudokuSolver;

class SudokuSolver {

  getRowMap(){
    return { 
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
      0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I'
    }
  }

  validate(puzzleString) {
    let resp;
    if(puzzleString.length !== 81) {
      resp = { error: 'Expected puzzle to be 81 characters long' };
    } else if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      resp = { error: 'Invalid characters in puzzle' };
    } else {
      resp = { valid: true };
    }
    return resp;
  }

  parsePuzzleToString(puzzleBoard) {
    let pString = '';
    puzzleBoard.forEach((row) => pString+=row.join(""));
    return pString;
  }

  parsePuzzleToArray(puzzleString) {
    let parsedPuzzle = [];
    const puzzleArray = puzzleString.split('').map(s => s === '.' ? 0 : +s);

    for(let i=0; i<puzzleArray.length; i+=9) {
      parsedPuzzle.push(puzzleArray.slice(i, i+9));
    }
    return parsedPuzzle;
  }

  getDotPositions(puzzleBoard) {
    let dotPositions = [];
    for(let i=0; i<puzzleBoard.length; i++) {
      for(let j=0; j<puzzleBoard[i].length; j++) {
        if(puzzleBoard[i][j] === 0) {
          dotPositions.push([i, j]);
        } 
      }
    }
    return dotPositions;
  }

  checkValue(pBoard, row, col, value) {
    const rgRow = this.getRowMap()[row];
    const pString = this.parsePuzzleToString(pBoard);
    
    const isRow = this.checkRowPlacement(pString, row, col+1, value).valid;
    const isCol = this.checkColPlacement(pString, row, col+1, value).valid;
    const isRegion = this.checkRegionPlacement(pString, rgRow, col+1, value).valid;

    if(isRow && isCol && isRegion) return true;

    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowIdx = /^[0-9]$/.test(row) ? row : this.getRowMap()[row];

    for(let i=0; i<pBoard[rowIdx].length; i++) {
      if(pBoard[rowIdx][i] === value) {
        return { valid: false, conflict: [ "row" ] };
      }
    }  

    return { valid: true }; 
  }

  checkColPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);

    // console.log("**", row, column, value);

    for(let i=0; i<pBoard.length; i++) {
      // console.log()
      if(pBoard[i][column-1] === value) {
        return { valid: false, conflict: [ "column" ] };
      }
    } 

    return { valid: true }; 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const pBoard = this.parsePuzzleToArray(puzzleString);
    const rowsInRegionMap = { 
      'A': 0, 'B': 0, 'C': 0, 'D': 3, 'E': 3, 'F': 3, 'G': 6, 'H': 6, 'I': 6 
    };
    const colsInRegionMap = { 1: 0, 2: 0, 3: 0, 4: 3, 5: 3, 6: 3, 7: 6, 8: 6, 9: 6 };
    const idxOfCol = colsInRegionMap[column];
    const idxOfRow = rowsInRegionMap[row];

    for(let i=idxOfRow; i<idxOfRow+3; i++) {
      for(let j=idxOfCol; j<idxOfCol+3; j++) {
        if(pBoard[i][j] === value) {
          return { valid: false, conflict: [ "region" ] };
        }
      }
    }

    return { valid: true }; 
  }

  solve(puzzleString) {
    if(!(/^(\.|[1-9])+$/.test(puzzleString))) {
      return { error: "Invalid characters in puzzle" };  
    }

    const puzzleBoard = this.parsePuzzleToArray(puzzleString);
    const dotPositions = this.getDotPositions(puzzleBoard);
    const breakPt = dotPositions.length;
    let limit = 9, i, row, col, value, found;


    for(i=0; (i>=0 && i<breakPt);) {

      row = dotPositions[i][0];
      col = dotPositions[i][1];

      value = puzzleBoard[row][col] + 1;

      found = false;

      while(!found && value<=limit) {
        if(this.checkValue(puzzleBoard, row, col, value)) {
          found = true;
          puzzleBoard[row][col] = value;
          i++;
        } else {
          value++;
        }
      }

      if(!found) {
        i--;
        puzzleBoard[row][col] = 0;
      } 
    }

    if(i<0) {
      return { error: "Puzzle cannot be solved" };
    }

    return { solution: this.parsePuzzleToString(puzzleBoard) };
  }
}

module.exports = SudokuSolver;

