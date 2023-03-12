const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Custom work plan server is running");
});

app.listen(port, () =>
  console.log(`Custom work plan server running on ${port}`)
);
