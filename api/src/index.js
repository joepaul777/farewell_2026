const serverless = require("serverless-http");
const { createApp } = require("./app.js");

module.exports = serverless(createApp());

