const express = require("express");

const PORT = "5000";
const app = express();

app.get("/gateways", (req, res) => {
  res.json("gateways endpoint");
});

app.get("/gateways/:id", (req, res) => {
  res.json("one gateway endpoint");
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
