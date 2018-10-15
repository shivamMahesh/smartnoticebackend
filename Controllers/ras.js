const handleRequest=(req,res,db)=>
{
  const {section}=req.body;
  var c=new Date();
  var  cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
	
db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
  status:'current',
  section:section
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
    console.log("sending to rpi",data)
  res.json(data);
  })
  .catch(err=>res.status(400).json(err))
}

  module.exports={
	handleRequest:handleRequest
}
