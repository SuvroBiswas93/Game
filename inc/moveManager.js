const crypto = require("crypto");

class MoveManager {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  getRandomMove() {
    const randomIndex = crypto.randomInt(0, this.numMoves);
    return this.moves[randomIndex];
  }

  determineWinner(userMove, computerMove) {
    const userIndex = this.moves.indexOf(userMove);
    const computerIndex = this.moves.indexOf(computerMove);

    if (userIndex === computerIndex) {
      return "Draw";
    }

    const half = Math.floor(this.numMoves / 2);
    if (
      (computerIndex > userIndex && computerIndex <= userIndex + half) ||
      (computerIndex < userIndex &&
        computerIndex <= userIndex + half - this.numMoves)
    ) {
      return "Computer wins!";
    } else {
      return "You win!";
    }
  }
}

module.exports = { MoveManager };
