require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportConfig = require("./passport");
const webSocket = require("./socket");
const PORT = process.env.PORT || 3500;
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data and for json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

passportConfig();
app.use(passport.initialize());

//middleware for cookies
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

webSocket(server, app);
