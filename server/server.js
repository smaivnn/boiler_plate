require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const logger = require("./config/logger");
const morganMiddleware = require("./middlewares/morgan");
const credentials = require("./utils/middleware/credentials");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn");

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

//middleware for cookies
app.use(cookieParser());

app.use(morganMiddleware);

app.use("/test", require("./routes/test"));

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
