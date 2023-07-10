// *********** Requires ************* //
const express = require("express");
const app = express();


// Extra Security Packages
const helmet = require('helmet')
const cors = require("cors");
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
// Helmet

// Rate limiter
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, //Limit each IP to 100 requests per windowMs
  })
); 

// core error options
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) //cores 

app.use(helmet()) //Helmet 
app.use(xss()) //xss 

app.send("/", (req, res) => {
  res.send("Habit tracker API");
});

// *************************

require("dotenv").config();
app.use(express.json());
const DBconnect = require("./db/connect");
// Middliwares
const authRouter = require("./routes/auth");
const habitsRouter = require("./routes/habit");
const authenticate = require('./middlwares/authentication')

// dynamic port setup
const port = process.env.PORT || 3000;

// Base URL setup
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/habit", authenticate, habitsRouter);

const start = async () => {
  try {
    const connectionURL = process.env.MONGO_URI;
    await DBconnect(connectionURL);
    console.log("DB connected ...");

    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
