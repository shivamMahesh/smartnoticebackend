
const handleRegister=(req,res,db,bcrypt)=>
{
	const { name , email ,password }=req.body;
  console.log(name,' ',email,' ',password );
  const pass = bcrypt.hashSync(password);

  if(!email || !name || !password)
  {
	return res.status(400).json('unable to register');	
  }
  else
  {
  db.select('name').from('teachers')
  .where({email:email
  })
  .then(data=>
  {
 if(data.length)
  {
  db('teachers')
.where({email:email,
  active:false})
 .update(
  {
    pass:pass
  })
  .then(data=>
  {
    if(data===1)
    {
 return   res.json(true);
  }
  else
  res.json('already registered');
  })
  }
  else
  res.json('email not found');
  })
  .catch(err=>res.json(err));
  }
}

module.exports={
	handleRegister:handleRegister
}