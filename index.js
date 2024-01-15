const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.er7kd0t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("byteCafeDb").collection("users");
    const itemsCollection = client.db("byteCafeDb").collection("items");
    const menuCollection = client.db("byteCafeDb").collection("menu");
    const categoriesCollection = client.db("byteCafeDb").collection("category");
    const chefCollection = client.db("byteCafeDb").collection("chef");
    const blogCollection = client.db("byteCafeDb").collection("blog");
    const reviewCollection = client.db("byteCafeDb").collection("review");

    const cartCollection = client.db("byteCafeDb").collection("carts");

    //user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //user get

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //send data from client site to server to mongo
    app.post("/items", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await itemsCollection.insertOne(item);
      res.send(result);
    });

    //get or read data from mongodb
    app.get("/items", async (req, res) => {
      const cursor = itemsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //update some data
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedItem = req.body;
      const item = {
        $set: {
          name: updatedItem.name,
          category: updatedItem.category,
          supplierName: updatedItem.supplierName,
          price: updatedItem.price,
          photo: updatedItem.photo,
        },
      };
      const result = await itemsCollection.updateOne(filter, options, item);
      res.send(result);
    });

    //delete
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    //get all menu item data

    app.get("/menu", async (req, res) => {
      const cursor = menuCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // all review

    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all categories data
    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all chef data
    app.get("/chef", async (req, res) => {
      const cursor = chefCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //find single chef
    app.get("/chef/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {
          name: 1,
          image_url: 1,
          bio: 1,
          experience: 1,
          phone: 1,
          email: 1,
          recipes: 1,
          best_recipe: 1,
        },
      };
      const result = await chefCollection.findOne(query, options);
      res.send(result);
    });

    //get all blog data
    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //cart collection

    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Byte cafe is running...");
});

app.listen(port, () => {
  console.log(`Byte server running is: ${port}`);
});
