const updateCurrent=(db,res,cd)=>
{
db('image').where('fsd','<',cd)
  .andWhere('fed','>',cd)
  .update(
  {
    status:'current'
  }).then(data=>
  {
 console.log("changing current");
 updateUpcoming(db,res,cd);
  })
  .catch(err=>res.status(400).json(err))	
   return true;
}

const updateUpcoming=(db,res,cd)=>
{
db('image').where('fsd','>',cd)
  .update(
  {
    status:'upcoming'
  }).then(data=>
  {
console.log("changing upcoming");
updatePrevious(db,res,cd);
  })
  .catch(err=>res.status(400).json(err))
  return true;
}

const updatePrevious=(db,res,cd)=>
{
	 db('image').where('fed','<',cd)
  .update(
  {
    status:'previous'
  }).then(data=>
  {
console.log("changing previous");
handleRas(section,res,db);
  })
  .catch(err=>res.status(400).json(err))
  return true;
}

const handleRas=(section,res,db)=>
{
db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
	status:'current',
  section:section
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
    console.log("sending to rpi")
  res.json(data);
  })
  .catch(err=>res.status(400).json(err))
}

const handleRequest=(req,res,db)=>
{
  const {section}=req.body;
  var c=new Date();
  var  cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
	
updateCurrent(db,res,cd);
}

  module.exports={
	handleRequest:handleRequest
}
