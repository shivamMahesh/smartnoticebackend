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
const pass=require('./Controllers/pass')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listFiles);
  });


  function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
   oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

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
      //console.log('No files found.');
    }
  });
  }
  res.json("drive working fine");

});



app.get('/utdb',(req,res)=>
{
  var sec=[],count=0;

 
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
    count=count+1;
  
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
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
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
var c=new Date(),cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
  fsd=startd+' '+startt;
  fed=endd+' '+endt;
  //console.log(fsd,'  ',fed,' ',cd);
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
    if (flag1!==undefined) {
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
  open( `https://drive.google.com/uc?export=download&id=${data[0].fileid}`, function (err) {
  if ( err ) throw err;    
  });
});

  res.json("starting download");
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
});
});

app.listen(process.env.PORT || 3000,()=>
{
    console.log(`server is working on port ${process.env.PORT}`);
});
