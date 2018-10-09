const handleButtons=(req,res,db)=>
{
 	  const {email}=req.body;
 	 db.select('section').from('a.bridge')
	.where('t_email','=',email)
	.then(data=>
	{
  	res.json(data);
	})
  .catch(err=>res.status(400).json(err))
}


module.exports={
	handleButtons:handleButtons
}