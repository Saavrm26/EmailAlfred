// Functionality to read credentials for oauth
const fs = require("fs");
const path = require("path");

// credentials.json contains client_id, redirect_uri, and javascipt_origin
const keyPath = path.join(__dirname, "../secrets/credentials.json");
let keys = { redirect_uris: [""] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

module.exports = keys;
