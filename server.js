const express=require('express');
const bcrypt=require('bcrypt-nodejs');
const bodyParser=require('body-parser');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(bodyParser.json());
const register=require('./Controllers/register');
const signin=require('./Controllers/signin');
const profile=require('./Controllers/profile');
const image=require('./Controllers/image');
var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Shivam@1234',
    database : 'smart_brain'
  }
});

app.post('/signin',(req,res)=>
{
	signin.handleSignin(req,res,db,bcrypt);
})

app.post('/register',(req,res)=>
{
	register.handleRegister(req,res,db,bcrypt);
})


app.get('/profile/:id',(req,res)=>
{
	profile.handleProfile(req,res,db);
})

app.put('/image',(req,res)=>
{
	image.handleImage(req,res,db);
})

app.post('/imageurl',(req,res)=>
{
  image.handleApiCall(req,res);
})


app.listen(3000,()=>
  {
    console.log('server is working');
  });
