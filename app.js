require("dotenv").config();
const express = require("express");
const http = require("http");
const { default: mongoose } = require("mongoose");
const UserRouter = require("./routes/userRoute");
const ProfileRouter = require("./routes/profileRoute");
const passport = require("passport");
const bodyParser = require("body-parser");
const { requireAuth } = require("./middlewares/requireAuth");

// initialize app and server
const app = express();
const server = http.createServer(app);

// port
const PORT = process.env.PORT || 8000;

// uri
const db = process.env.MONGO_URL;

// middlewares
app.use(bodyParser.json());

// passport
app.use(passport.initialize());
require("./config/passport")(passport);

// db
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// route

app.use("/api/auth", UserRouter);
app.use("/api/profile", ProfileRouter);

// server
server.listen(PORT, () => {
  console.log(`server running at port : ${PORT} `);
});
