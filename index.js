const { KeyGenerator } = require("./inc/keyGenerator");
const { HmacGenerator } = require("./inc/hmacGenerator");
const { MoveManager } = require("./inc/moveManager");
const { Help } = require("./inc/help");
const { Console } = require("./inc/console");
const { Game } = require("./inc/game");

// Start progressing the game
(async function main() {
  const moves = process.argv.slice(2);
  if (moves.length === 0) {
    console.log(
      "Please provide the moves as command line arguments, moves should be an odd number"
    );
    process.exit(1);
  }
  const moveManager = new MoveManager(moves);
  const help = new Help(moveManager);
  const game = new Game(moveManager, help);
  await game.playGame(KeyGenerator, HmacGenerator, Console);
})();
