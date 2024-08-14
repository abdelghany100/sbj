const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const compression = require("compression");
const { errorHandler, notFound } = require("./middlewares/error");

const app = express();

const DB = process.env.DATABASE_URI.replace("<USER>", process.env.DATABASE_USER)
  .replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  .replace("<DATABASENAME>", process.env.DATABASE_NAME);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

// Add compression middleware
app.use(compression());

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/order", require("./routes/OrderRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/notifications", require("./routes/notivicationRoute"));
app.use("/api/favorites", require("./routes/FavotiteRoute"));

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server has started on port 8000");
});
