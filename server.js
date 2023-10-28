const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config({ path: "./.env" });
const app = require("./app");

const { oauth2ClientWebserver } = require("./oauth2/oauth2Client");

google.options({ auth: oauth2ClientWebserver });

const port = process.env.PORT || 3000;
console.log("starting on port ", port);
app.listen(port);
