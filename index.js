const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


const app = express()
// middlewar
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6scxok5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
    // Send a ping to confirm a successful connection
    const toysCollections = client.db('toysdb').collection('toycollection')


    app.get('/toys/:text',async(req,res)=>{
      if(req.params.text=='science kits'||req.params.text=='engineering kits'||req.params.text=='math learning toys'){
        const result = await toysCollections.find({Subcategory:req.params.text}).toArray()
        return res.send(result)
      }
       
       
    })

    app.get('/singledata/:id',async(req,res)=>{
      const id = req.params.id
       const quary = {_id: new ObjectId(id)}
       const result = await toysCollections.findOne(quary)
       res.send(result)
    })

    app.get('/alltoys',async(req,res)=>{
      const result = await toysCollections.find().toArray()
      res.send(result)
    })

   app.get('/mytoys',async(req,res)=>{
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email }; 
    }
    const result = await toysCollections.find(query).toArray();
    res.send(result);
   })

   app.get('/sorting',async(req,res)=>{
     const sort = req.query.sort
     const email = req.query.email
     let result;
     if(sort==='asending'){
      result = await toysCollections.find({email:email}).sort({price:1}).toArray()
    
     }
     else if(sort==='desending'){
       result = await toysCollections.find({email:email}).sort({price:-1}).toArray()
     
     }
     
    res.send(result);
     

   })

    app.post('/toys', async(req,res)=>{
      const booking = req.body
      const result = await toysCollections.insertOne(booking)
      res.send(result)
  })
  app.delete('/mytoys/:id',async(req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await toysCollections.deleteOne(query)
    res.send(result)
  })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    app.get('/',(req,res)=>{
    res.send('Start server')
})
app.listen(port,(req,res)=>{
    console.log('Server running Succesgully',)
})

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



