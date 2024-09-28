import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';


const app = express();
app.use(express.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = 'personDB';
let db;

const connectmongo = async () =>
{
    try{
        const client = await MongoClient.connect(url);
        console.log("connected to DB");
        db = client.db(dbName);
    }catch (error)
    {
        console.log("Error connecting to db",error);
    }
}

connectmongo();

app.post('/api/person', async (req,res) => 
{
    const {name, age, phone,address } = req.body;
    const newPerson = { name,age, phone, address};

    try{
        const result = await db.collection('persons').insertOne(newPerson);
        res.status(201).send('Person Saved Succesfully');
    }catch (error)
    {
        console.error('Error saving person ',error);
        res.status(500).send('Error Saving Person');
    }
})


app.get('/api/getpersons', async (req,res) =>
{
    try{
        const persons = await db.collection('persons').find({}).toArray();
        res.status(200).json(persons);
    }catch(error)
    {
        console.error('Error Fetching Perons : ',error);
        res.status(500).send('Error Fetching Persons');
    }
})

app.listen(5000, () =>{
    console.log('sever is running on port 5000');
})