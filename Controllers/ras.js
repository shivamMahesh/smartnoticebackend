const handleRequest=(req,res,db)=>
{
  const {section}=req.body;
  var c=new Date();
  var  cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
	

  db('image').where('fsd','<',cd)
  .andWhere('fed','>',cd)
  .update(
  {
    status:'current'
  }).then(data=>
  {
  // console.log(data);
  })
  .catch(err=>res.status(400).json(err))


  db('image').where('fsd','>',cd)
  .update(
  {
    status:'upcoming'
  }).then(data=>
  {
  //console.log(data);
  })
  .catch(err=>res.status(400).json(err))

  db('image').where('fed','<',cd)
  .update(
  {
    status:'previous'
  }).then(data=>
  {
  //console.log(data);
  })
  .catch(err=>res.status(400).json(err))


  db.select('description','name','fileid','fed','section','preference').from('image')
  .where({
	status:'current',
  section:section
  })
  .orderBy('preference', 'asc')
  .then(data=>
  {
  res.json(data);
  })
  .catch(err=>res.status(400).json(err))
  }


  module.exports={
	handleRequest:handleRequest
}
