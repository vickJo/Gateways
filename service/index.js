const mongoose = require("mongoose");
const app = require("./app");

const PORT = 5000;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/msoft");
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

main().catch(console.log);
