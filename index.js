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
        const userCollection = client.db('projectSynergy').collection('users')
        // get all projects
        app.get('/projects', async (req, res) => {
            const query = {}
            const cursor = projectCollection.find(query)
            const projects = await cursor.toArray()
            res.send(projects)
        })
        //get projects by id
        app.get('/project/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const project = await projectCollection.findOne(query)
            res.send(project)
        })
        //adding new project to the db
        app.post('/project', async (req, res) => {
            const newProject = req.body
            const result = await projectCollection.insertOne(newProject)
            res.send(result)
            console.log(result)
        })
        // //update user profile
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = req.body
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    career: user.career,
                },
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        //get user by filtering email (my profile)
        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        //updating project
        app.put('/project/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProject = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: updatedProject.title,
                    img: updatedProject.img,
                    description: updatedProject.description,
                    catergory: updatedProject.catergory,
                    startDate: updatedProject.startDate,
                    endDates: updatedProject.endDates,
                    note: updatedProject.note,
                    liveSite: updatedProject.liveSite,
                }
            };
            const result = await projectCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        //delete project
        app.delete('/project/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await projectCollection.deleteOne(filter)
            res.send(result)
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