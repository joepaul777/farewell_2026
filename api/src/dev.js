require("dotenv").config();
const { createApp } = require("./app.js");

const port = Number(process.env.PORT || 3001);
const app = createApp();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

