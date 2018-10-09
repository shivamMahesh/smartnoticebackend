const handlePassword=(req,res,db,bcrypt)=>
{
const {email , password}=req.body;
const pas = bcrypt.hashSync(password);
  if(!email || !password)
  {
   return res.status(400).json(false)
  }
  
  db('teachers').where({
    email:email})
  .update(
  {
    pass:pas
  })
  .then(data=>
  {
    if(data===1)
    res.json(true);
  else
    res.status(400).json(false);
  })
  .catch(err=>res.status(400).json(false))
}

module.exports={
handlePassword:handlePassword
}