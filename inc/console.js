const readline = require("readline");

class Console {
  static async readLine(message) {
    const readInterface = readline.createInterface(
      process.stdin,
      process.stdout
    );
    return new Promise((resolve) =>
      readInterface.question(message, (input) => {
        readInterface.close();
        resolve(input);
      })
    );
  }
}

module.exports = { Console };
