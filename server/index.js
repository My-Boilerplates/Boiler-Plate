const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(express.static(path.join(__dirname, "/public")));

app.use("/api", require("./api"));

// static file-serving middleware
app.use(express.static(path.join(__dirname, "public")));

// any remaining requests with an extension send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const port = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`listening on port http://localhost:${port}`)
);
