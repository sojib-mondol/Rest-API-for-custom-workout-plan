const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmcxwrx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{

      // collection 1
      const workoutPlansCollection = client.db('workoutPlansWebApplication').collection('workout-plans');
      // collection 2
      const usersCollection = client.db('workoutPlansWebApplication').collection('workout-plans-users');
    

      //------------------ Oprational section start -------------------------------/
      // Define a route for creating workout plans
      app.post('/workout-plans', async (req, res) => {
          // Insert the workout plan into the "workout-plans" collection
          const result = await workoutPlansCollection.insertOne(req.body);
          // Send a response indicating success
          res.send(result);
      });

      // Define a route for updating workout plans
      app.put('/workout-plans/:id', async (req, res) => {
          // Update the workout plan in the "workout-plans" collection
          const query = { _id: new ObjectId(req.params.id) };
          const update = { $set: req.body };
          const result = await workoutPlansCollection.updateOne(query, update);
           // Send a response indicating success
           res.send(result);
      });

      // Define a route for deleting workout plans
      app.delete('/workout-plans/:id', async (req, res) => {
          // Delete the workout plan from the "workout-plans" collection
          const query = { _id: new ObjectId(req.params.id) };
          const result = await workoutPlansCollection.deleteOne(query);
          // Send a response indicating success
          res.send(result);
      });

      // get APO for workout-plans
      app.get("/workout-plans", async (req, res) => {
        const query = {};
        const data = await workoutPlansCollection.find(query).toArray();
        res.send(data);
      });


      //------------------ Oprational section END -------------------------------/




      // --------------------- Authentication section  start ----------------------//
      // User registration endpoint
      app.post("/register", async (req, res) => {
        const { email, password } = req.body;
        // Check if user already exists
        const user = await usersCollection.findOne({ email });
        if (user) {
          return res.status(409).json({ message: 'Email already in use' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        const result = await usersCollection.insertOne({ email, password: hashedPassword });

        // Generate a JWT token for the new user
        const token = jwt.sign({ id: result.insertedId }, `${process.env.secret_keyRegister}`);

        res.status(201).json({ message: 'User created', token });
      });

      // User login endpoint
      app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        // Check if user exists
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate a JWT token for the user
        const token = jwt.sign({ id: user._id }, `${process.env.secret_keyLogin}`);

        res.status(200).json({ message: 'Login successful', token });        
      });

      // --------------------- Authentication section  END ----------------------//

  }
  finally{

  }
}
run().catch(err => console.error(err));


app.get("/", async (req, res) => {
  res.send("Custom work plan server is running");
});

app.listen(port, () =>
  console.log(`Custom work plan server running on ${port}`)
);
