const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2486a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const projectCollection = client.db('projectSynergy').collection('projects')
        // get all projects
        app.get('/projects', async (req, res) => {
            const query = {}
            const cursor = projectCollection.find(query)
            const projects = await cursor.toArray()
            res.send(projects)
        })
        //get projects ny id
        app.get('/project/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const project = await projectCollection.findOne(query)
            res.send(project)
        })
    }
    finally {

    }
}
run().catch(console.dir)


//root api
app.get('/', async (req, res) => {
    res.send('My Project Synergy is running.')
})
app.listen(port, async (req, res) => {
    console.log('Listening to port:', port)
})