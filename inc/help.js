const { table } = require("table");

class Help {
  constructor(moveManager) {
    this.moveManager = moveManager;
    this.moves = moveManager.moves;
    this.numMoves = this.moves.length;
  }

  getResult(move, opponentMove) {
    if (move === opponentMove) return "Draw";
    return this.moveManager.determineWinner(move, opponentMove) === "You win!"
      ? "Win"
      : "Lose";
  }

  generateTableData() {
    const headerRow = ["Moves", ...this.moves];
    const bodyRows = this.moves.map((move) => [
      move,
      ...this.moves.map((opponentMove) => this.getResult(move, opponentMove)), // Result for each move comparison
    ]);
    return [headerRow, ...bodyRows];
  }

  // Method to print the help table
  printHelp() {
    console.log("\nHelp Table:");
    const tableData = this.generateTableData();
    console.log(table(tableData));
  }
}

module.exports = { Help };
