const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();
const { connectToDB } = require("./config/connectToDB");
const { ErrorHandler } = require("./utils/errorHandler");
const { globalError } = require("./middlewares/errorMiddleware");

//config
require("dotenv").config();

// conect to DB
connectToDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// routes

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.use("/api", require("./routes/index"));

app.all("*", (req, res, next) => {
  next(
    new ErrorHandler(`can not found ${req.method} => ${req.originalUrl}`, 404)
  );
});

// error Handler
app.use(globalError);

// listen server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("runing in port", port);
});
