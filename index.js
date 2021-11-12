const express =require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfvuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('Shop-BD');
        const serviceCollection=database.collection('services');
        const purchasedCollection=database.collection('purchased');

        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        });
        // fetch by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            console.log('load', result);
            res.send(result);
        });

        app.post('/purchased', async (req, res) => {
            const cursor = req.body;
            const result = await purchasedCollection.insertOne(cursor);
            res.json(result);
          });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server run');
})
app.listen(port, () => {
    console.log('Server run:', port);
})