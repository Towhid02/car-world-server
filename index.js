const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

 console.log(process.env.DB_USER);
 console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0klimfk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const brandsCollection = client.db('carsDB').collection('brands');
    const carsCollection = client.db('carsDB').collection('cars');
        // const userCollection = client.db('coffeeDB').collection('user');
    app.post('/user', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await carsCollection.insertOne(user);
        res.send(result);
      })

    app.get('/cars', async (req, res) => {
        const cursor = carsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        })
    app.get('/brands', async (req, res) => {
        const cursor = brandsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        })

    app.get('/cars/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await carsCollection.findOne(query);
        res.send(result);
        })

    app.get('/brand/:brand', async (req, res) => {
        const brand = req.params.brand;
        const query = {brand:brand}
        const cursor = carsCollection.find(query)
        const result = await cursor.toArray(query);
        res.send(result);
        })
        
    app.post('/cars', async (req, res) => {
        const newCar = req.body;
        console.log(newCar);
        const result = await carsCollection.insertOne(newCar);
        res.send(result);
      })
    
      app.put('/cars/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedCar = req.body
        const updated = {
          $set: {
            name: updatedCar.name, 
            brand: updatedCar.brand, 
            model: updatedCar.model, 
            type: updatedCar.type, 
            rating: updatedCar.rating, 
            price:updatedCar.price, 
            image: updatedCar.image,
          }
        }
        const result = await carsCollection.updateOne(filter, updated, options);
        res.send(result);
      })

    app.delete('/cars/:id', async(req, res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result= await carsCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/cars', async (req, res) => {
        const cursor = carsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
})

    
        
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car making server is running')
})

app.listen(port, () => {
    console.log(`Car's Server is running on port: ${port}`)
})