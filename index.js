const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

// MongoDb

const uri = "mongodb+srv://shormilyrais:M2qHf0oL4JAyZ6Db@cluster0.ilh29rz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect()
    const userDB = client.db("userDB");
    const userCollection = userDB.collection("user_collection");
    const recipesDB = client.db("recipesDB");
    const recipesCollection = userDB.collection("recipes_collection");

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })
    // get add product

     app.post("/recipes", async (req, res) => {
       const recipesData = req.body;
      const result = await recipesCollection.insertOne(recipesData);
      res.send(result)
    })
    //  get add routes

    // Get all product

    app.get("/recipes", async (req, res) => {
      const recipesData =recipesCollection.find();
      const result = await recipesData.toArray();
      res.send(result)
    })
    // Get all product End

    // Get edit id start
    app.get("/recipes/:id", async (req, res) => {
      const id = req.params.id
      console.log(id)
      const recipesData = await recipesCollection.findOne({
        _id:new ObjectId(id)
      });
      console.log(recipesData)
      res.send(recipesData)
    })
    // Get edit id end

    // Get Update id start
    app.patch("/recipes/:id", async (req, res) => {
      const id = req.params.id
      const updatedData = req.body;
      const result = await recipesCollection.updateOne({
        _id: new ObjectId(id)
      },
        { $set: updatedData }
      );
      console.log(id)
      res.send(result)
    })

    // Get Update id end
    
    console.log("successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// MongoDB

app.get('/', (req, res) => {
  res.send('Hello Worlds!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// shormilyrais
// M2qHf0oL4JAyZ6Db