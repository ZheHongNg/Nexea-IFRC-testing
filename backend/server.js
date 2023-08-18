const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./config/databaseSetup");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const LocalStrategy = require("passport-local").Strategy;
const MongoConnect = require("connect-mongo");
const cookieParser = require('cookie-parser')
const errorHandler = require("./middleware/errorHandler.js");
const loginRoute = require("./routes/loginRoute");
const registerRouter = require("./routes/registerRoute");
const countryRoute = require("./routes/countryRoute");
const userRoute = require("./routes/userRoute")
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

const app = express();
const DB_URL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser())
//Login Route Middleware
app.use("/login", loginRoute);
// Register Route Middleware
app.use("/register", registerRouter);
app.use("/countries", countryRoute);
// app.use("/user", userRoute)

// Error handler
app.use(errorHandler);

// Create a session and store inside the database
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoConnect.create({
      mongoUrl: DB_URL,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, //expires in 14 days time
    },
  })
);

// Default homepage
app.get("/", (req, res) => {
  res.json({
    status: `Server for ${process.env.NODE_ENV} is up and running !`,
  });
});

connection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
