const handleFiles=(req,res,db)=>
{
  const {status,section}=req.body;  
 	db.select('f_id','fileid','email','section').from('a.image')
	.where({
	status:status
	})
	.whereIn('section',section)
	.then(data=>
	{
  res.json(data);
	})
  .catch(err=>res.status(400).json(err))
}


module.exports={
	handleFiles:handleFiles
}