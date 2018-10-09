const handleVerify=(req,res,db)=>
{
 const {email , token}=req.body;
  if(!email || !token)
  {
   return res.status(400).json(false)
  }
  db('a.teachers').where({
    email:email,
    token:token})
  .update(
  {
    active:true
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
	handleVerify:handleVerify
}
