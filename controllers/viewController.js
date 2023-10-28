const { getAuthUrl } = require("../oauth2/oauth2Client");

const getLoginPage = (req, res, next) => {
  const authUrl = getAuthUrl();
  res.render("index", { title: "Login", authUrl: authUrl });
};

module.exports = {
  getLoginPage,
};
