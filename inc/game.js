// Main game class
class Game {
  constructor(moveManager, help) {
    this.moveManager = moveManager;
    this.help = help;
    this.moves = moveManager.moves;
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

  handleInput(playerMove, computerMove, key) {
    playerMove = playerMove.trim();

    if (playerMove === "0") {
      console.log("Exiting the game...");
      process.exit(0);
    } else if (playerMove === "?") {
      this.help.printHelp();
    } else {
      const userMoveIndex = parseInt(playerMove, 10) - 1;

      if (userMoveIndex >= 0 && userMoveIndex < this.moves.length) {
        const userMove = this.moves[userMoveIndex];
        console.log("Your move:", userMove);
        console.log("Computer move:", computerMove);
        console.log(this.moveManager.determineWinner(userMove, computerMove));
        console.log("HMAC key:", key);
        process.exit(0);
      } else {
        console.log("Invalid playerMove. Please try again.");
      }
    }
  }

  async playGame(KeyGenerator, HmacGenerator, Reader) {
    try {
      this.validateMoves();
      const keyLength = 32;
      const key = KeyGenerator.generateKey(keyLength);
      const computerMove = this.moveManager.getRandomMove();
      const hmac = HmacGenerator.generateHmac(key, computerMove);

      console.log("HMAC:", hmac);

      this.displayMenu();

      const playerMove = await Reader.readLine("Enter your move: ");

      this.handleInput(playerMove, computerMove, key);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }
}

module.exports = { Game };
