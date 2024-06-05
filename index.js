/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

// jwt token
function createToken (users) {
  const token = jwt.sign(
    {
    data: 'foobar'
    }, 'secret', { expiresIn: '7d' });
  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  const verify = jwt.verify(token, "secret");

  // if (!verify?.email) {
  //   return res.send('You are not authorized')
  // }
  // req.user = verify.email;
  console.log(verify);
  next()
}

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
    const recipesDB = client.db("recipesDB");
    const usersDB = client.db("usersDB");
    const usersCollection =usersDB.collection("usersCollection")
    const recipesCollection = userDB.collection("recipes_collection");
    // Mongo emil users
    app.post('/users',async (req, res) => {
      const users = req.body;
      const token = createToken(users);
      console.log(token);
      const isUserExist = await usersCollection.findOne({ email: users?.email });
      if (isUserExist?._id) {
        return res.send({
          status: 'success',
          message: 'Login successfully',
          token:token
        })
      }
      console.log(isUserExist);
      await usersCollection.insertOne(users);
      res.send(token);
    })

    // Get all users endpoint
    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch users' });
      }
    });

     // Get userprofilEdit message 
     app.get('/users/get/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await usersCollection.findOne({
        _id: new ObjectId(id)
      }, );
      res.send(result)
    });
    // Get userprofilEdit message End
    app.patch('/users/:email', async (req, res) => {
      const email = req.params.email;
      const userData = req.body;
      
      const result = await usersCollection.updateOne({ email }, { $set: userData }, { upsert: true });
      console.log(result)
      res.send(result )
    });
    // Get all users endpoint
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send(result )
    });
   
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

    // Get Delete product
    app.delete("/recipes/:id", async (req, res) => {
      const id = req.params.id
      const result = await recipesCollection.deleteOne({
        _id: new ObjectId(id)
      }
      );
      console.log(id)
      res.send(result)
    })
    // Get delete end
    
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