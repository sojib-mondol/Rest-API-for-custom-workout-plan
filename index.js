const express = require("express");
const cors = require("cors");

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
