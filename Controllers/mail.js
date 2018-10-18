const randomstring=require('randomstring');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartnoticeboardrvce@gmail.com',
    pass: process.env.pass
  }
});

const sendMail=(req,res,db,name,designation,email)=>
{
	const token=randomstring.generate();
  const html=`Hi, ${name},${designation}
  <br>
  THANK YOU FOR REGISTERING FOR SMART NOTICE BOARD AT RVCE !!
  <br><br>
  PLEASE VERIFY YOUR EMAIL BY TYPING THE FOLLOWING TOKEN
  <br><br><b>${token}<br>`;

    var mailOptions = {
  from: 'smartnoticeboardrvce@gmail.com',
  to: email,
  subject: 'Verify Your Mail',
  html: html
  }

  db('teachers')
  .where({email:email})
  .update(
  {
    token:token
  })
  .then(data=>
	{
    if(data===1)
    {
		transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    //console.log('Email sent: ' + info.response);
  }})
	res.json(true);
  }
  else
  return res.status(400).json(false)})
}

const handleMail=(req,res,db)=>
{
	const {email}=req.body;
	 db.select('name','designation').from('teachers')
  .where({email:email})
  .then(data=>
  {
 if(data.length)
  sendMail(req,res,db,data[0].name,data[0].designation,email);
  else
	res.json(false);
})
}

module.exports={
	handleMail:handleMail
}