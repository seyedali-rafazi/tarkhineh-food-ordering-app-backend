const Application = require("./app/server.js");

const app = new Application();
app.startServer();

module.exports = app.getApp();
