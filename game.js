const crypto = require("crypto");
const readline = require("readline");

class KeyGenerator {
  static generateKey() {
    return crypto.randomBytes(32).toString("hex"); // 256-bit key
  }
}

class HmacGenerator {
  static generateHmac(key, move) {
    return crypto.createHmac("sha256", key).update(move).digest("hex");
  }
}

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

class HelpTable {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  printHelp() {
    console.log("\nHelp Table:");
    const table = [];

    // Prepare the header row
    let header = ["Moves"];
    header.push(...this.moves);
    table.push(header);

    // Prepare the rows for the table
    for (let i = 0; i < this.numMoves; i++) {
      const row = [this.moves[i]];
      for (let j = 0; j < this.numMoves; j++) {
        if (i === j) {
          row.push("Draw");
        } else {
          const moveManager = new MoveManager(this.moves);
          const result = moveManager.determineWinner(
            this.moves[i],
            this.moves[j]
          );
          row.push(result === "You win!" ? "Win" : "Lose");
        }
      }
      table.push(row);
    }

    // Display table
    for (const row of table) {
      console.log(row.map((cell) => cell.padEnd(10)).join(" "));
    }
  }
}

class Game {
  constructor(moves = []) {
    this.moves = moves;
  }
  validateMoves() {
    if (this.moves.length < 3 || this.moves.length % 2 === 0) {
      throw new Error(
        "You must provide an odd number of moves greater than or equal to 3."
      );
    }

    const uniqueMoves = new Set(this.moves);
    if (uniqueMoves.size !== this.moves.length) {
      throw new Error("All moves must be unique.");
    }
  }
  displayMenu() {
    console.log("Available moves:");
    this.moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
    console.log("0 - exit");
    console.log("? - help");
  }
  handleInput(input, moveManager, computerMove, key) {
    input = input.trim();

    if (input === "0") {
      console.log("Exiting the game...");
      process.exit(0);
    } else if (input === "?") {
      const helpTable = new HelpTable(this.moves);
      helpTable.printHelp();
    } else {
      const userMoveIndex = parseInt(input, 10) - 1;

      if (userMoveIndex >= 0 && userMoveIndex < this.moves.length) {
        const userMove = this.moves[userMoveIndex];
        console.log("Your move:", userMove);
        console.log("Computer move:", computerMove);
        console.log(moveManager.determineWinner(userMove, computerMove));
        console.log("HMAC key:", key);
        process.exit(0);
      } else {
        console.log("Invalid input. Please try again.");
      }
    }
  }
  async playGame() {
    try {
      this.validateMoves();
      const moveManager = new MoveManager(this.moves);
      const key = KeyGenerator.generateKey();
      const computerMove = moveManager.getRandomMove();
      const hmac = HmacGenerator.generateHmac(key, computerMove);

      console.log("HMAC:", hmac);

      this.displayMenu();

      const input = await readConsole("Enter your move: ");

      this.handleInput(input, moveManager, computerMove, key);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }
}

async function readConsole(message) {
  const readInterface = readline.createInterface(process.stdin, process.stdout);
  return new Promise((resolve) =>
    readInterface.question(message, (input) => {
      readInterface.close();
      resolve(input);
    })
  );
}

(async function main() {
  const moves = process.argv.slice(2);
  if (moves.length === 0) {
    console.log(
      "Please provide the moves as command line arguments, moves should be an odd number"
    );
    process.exit(1);
  }
  const game = new Game(moves);
  await game.playGame();
})();
