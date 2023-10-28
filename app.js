const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const loginRouter = require("./routes/loginRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json({ limit: "50kb" }));

app.use("/login", loginRouter);
app.use("/", viewRouter);

// All routes that are not matched
app.use("*", (req, res, next) => {
  const err = new Error("Not such route");
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    err,
  });
});

module.exports = app;
