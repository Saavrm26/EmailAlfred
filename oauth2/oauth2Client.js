const { google } = require("googleapis");
const keys = require("./oauth2Keys");

// oauth client for webserver
const oauth2ClientWebserver = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0],
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.modify",
];

const getAuthUrl = () => {
  const authorizeUrl = oauth2ClientWebserver.generateAuthUrl({
    access_type: "online",
    scope: scopes.join(" "),
  });
  return authorizeUrl;
};

module.exports = { oauth2ClientWebserver, getAuthUrl, keys };
