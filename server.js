const express=require('express');
const bcrypt=require('bcrypt-nodejs');
const bodyParser=require('body-parser');
const app=express();
const cors=require('cors');
const multer = require('multer');
const register=require('./Controllers/register');
const signin=require('./Controllers/signin');
const verify=require('./Controllers/verify');
const buttons=require('./Controllers/buttons');
const ras=require('./Controllers/ras');
const filesd=require('./Controllers/filesd');
var open = require('open');
const path = require('path');
const mail=require('./Controllers/mail');
const mail1=require('./Controllers/mail1');
const pass=require('./Controllers/pass');
const request=require('request');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
"use strict";
//var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fileid1=undefined;

//var subscriptionKey = '7c43b9819066481b83943c852587b4b7';
//var serviceRegion = "centralus";

var description, selectedFile, preference, name, fileid, status, fsd,fed,section=[],flag=0,email;

var db = require('knex')({
  client: 'pg',
  connection: {
   connectionString: process.env.DATABASE_URL,
  ssl: true,
  }
});


var newFilename;
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads');
      },
      filename: (req, file, cb) => {
        newFilename = `${(file.originalname)}`;
        cb(null, newFilename);
      },
    });
const upload = multer({ storage });

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var drive,oAuth2Client;
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';


app.get('/',(req,res)=>
{
  function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
   oAuth2Client = new google.auth.OAuth2(
      process.env.pass.client_id, process.env.pass.client_secret, process.env.pass.redirect_uris);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
  }

  function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
   });
  }
 
  function listFiles(auth) {
   drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 20,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
   files = res.data.files;
    if (files.length) {
     // console.log('Files:');
      files.map((file) => {
        //console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
  }
  res.json("drive working fine");

});



app.get('/utdb',(req,res)=>
{
  var sec=[];

for(i=0;i<=section.length-2;i=i+3)
  {
  sec.push(section[i]+section[i+1])
  }
  for(i=0;i<sec.length;i++)
  {
  db('image').insert(
    {description:description,
      name:name,
      fileid:fileid,
      fsd:fsd,
      fed:fed,
      status:status,
      preference:preference,
      section:sec[i],
      email:email
    })
  .then(res=>
  {
  })
  }
  res.json("added");
});



app.post('/signin',(req,res)=>
{
const directory = './uploads';

  fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    if(file!=='default.jpg'){
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
}}
});

	signin.handleSignin(req,res,db,bcrypt);
});

app.post('/register',(req,res)=>
{
	register.handleRegister(req,res,db,bcrypt);
});


app.post('/mail',(req,res)=>
{
   mail.handleMail(req,res,db);
});

app.post('/mail1',(req,res)=>
{
   mail1.handleMail(req,res,db);
}); 

app.post('/verify',(req,res)=>
{
 verify.handleVerify(req,res,db);
});


app.post('/upload',upload.single('selectedFile'),(req,res)=>
{
  
  fileid=undefined;
  description=req.body.description;
 var startd=req.body.startd,startt=req.body.startt, endd=req.body.endd,endt=req.body.endt;
  preference=req.body.preference;
  section=req.body.section;
  email=req.body.email;
  name=req.body.name;
  var currentTime = new Date();

var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;

var c = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
   console.log(cd);

  fsd=startd+' '+startt;
  fed=endd+' '+endt;
 if(fed<fsd )
 {
  res.status(400).json("wrong dates");
  }
  else if(preference>5 || preference<1)
  {
  res.status(400).json("wrong preference");
  }
 else if(fed<cd)
  status='previous';
  else if(fsd<cd && cd<fed)
  status='current';
  else if(fsd>cd)
  status='upcoming';

  var folderId = '1-KdVpDAjIbGBkDm_jrLDepcNjWQ-np6E';
  var fileMetadata = {
  'name': `${newFilename}`,
  parents:[folderId]
  };

  var type=(description==='pdf')?'application/pdf':'image/jpeg';

  var media = {
  mimeType: type,
  body: fs.createReadStream(`./uploads/${newFilename}`)
  };
  var flag1;
  drive.files.create({
  resource: fileMetadata,
  media: media,
  fields: 'id'
  }, function (err, file) {
  if (err) {
 
    console.error(err);
  } else {
   
    fileid=file.data.id;
    console.log('File Id: ', file.data.id);
    
  }
  });

 
 var _flagCheck = setInterval(function() {
    if (fileid!==undefined) {
        clearInterval(_flagCheck);
        theCallback(res); // the function to run once all flags are true
    }
}, 100); // interval set at 100 milliseconds
   
});
function theCallback(res)
{
   res.json("UPLOADED SUCCESSFULLY");
}


app.post('/download',(req,res)=>
{
  const {f_id}=req.body;
  db.select('fileid').from('image')
  .where({
  f_id:f_id})
  .catch(err=>res.status(400).json("invalid id"))
  .then(data=>
  {
  res.json(`https://drive.google.com/uc?export=download&id=${data[0].fileid}`);
});

  
});


app.post('/filesd',(req,res)=>
{
  filesd.handleFiles(req,res,db);
})


app.post('/buttons',(req,res)=>
{
  buttons.handleButtons(req,res,db);
});

app.post('/ras',(req,res)=>
{
ras.handleRequest(req,res,db);
});

app.post('/pass',(req,res)=>
{
pass.handlePassword(req,res,db,bcrypt);
})

app.post('/user',(req,res)=>
{
  db.select('name','designation').from('teachers')
  .where({email:req.body.email})
  .then(data=>
  {
  if(data.length)
    res.json(data);
  else
    res.status(400).json(`USER DOESN'T EXITS`);
})
});


/*app.post('/audio',upload.single('selectedFile'),(req,res)=>
{

fileid1=undefined;
var filename = `./uploads/${newFilename}`; 
var pushStream = sdk.AudioInputStream.createPushStream();


fs.createReadStream(filename).on('data', function(arrayBuffer) {
  pushStream.write(arrayBuffer.buffer);
}).on('end', function() {
  pushStream.close();
});


console.log("Now recognizing from: " + filename);


var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);


speechConfig.speechRecognitionLanguage = "en-IN";

var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

recognizer.recognizeOnceAsync(
  function (result) {
    console.log(result);
    fileid1=result;
    recognizer.close();
    recognizer = undefined;
  },
  function (err) {
    console.trace("err - " + err);

    recognizer.close();
    recognizer = undefined;
  });

var _flagCheck = setInterval(function() {
    if (fileid1!==undefined && fileid1.privText!==undefined) {
        clearInterval(_flagCheck);
        theCallback1(res); 
    }
}, 10000); 
   
});

function theCallback1(res)
{
var speech=fileid1.privText;
if(speech!==undefined)
{
var str=speech.split(' ');
var name=undefined,section=undefined;
var sem=undefined;
for(i=0;i<str.length-1;i++)
{
  if(str[i]=='Name')
    name=str[i+1];
  else if(str[i]=='Semester')
    sem=str[i+1];
  if(str[i]=='Section')
    section=str[i+1];
}
name='%'+name+'%';
console.log(name);
if(section!==undefined && sem!==undefined){
  section=sem.charAt(0)+section.charAt(0);
  console.log(section);
}

if(name===undefined && section===undefined)
{
  res.json([]);
}
else if(name!==undefined && section!==undefined)
{
db.select('email').from('teachers')
  .where('name','like',name)
  .then(data=>
  {
    console.log(data);
    if(data.length)
    {
db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
  email:data[0].email,
  section:section
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
  res.json(data);
  })
  .catch(err=>res.status(400).json(err));
}
else
res.json([]);
  })
  .catch(err=>res.status(400).json(err));
}
else if(name!==undefined)
{
db.select('email').from('teachers')
  .where('name','like',name)
  .then(data=>
  {
    if(data.length)
    {
db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
  email:data[0].email
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
  res.json(data);
  })
  .catch(err=>res.status(400).json(err))
  }
  else
    res.json([]);
  })
  .catch(err=>res.status(400).json(err));
}
else
{
  db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
  section:section
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
  res.json(data);
  })
  .catch(err=>res.status(400).json(err));
}
}
else
res.json("speech not recognized");
}
*/



app.listen(process.env.PORT || 3000,()=>
{
    console.log(`server is working on port ${process.env.PORT}`);
});
