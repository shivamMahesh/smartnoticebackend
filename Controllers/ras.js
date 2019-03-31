const updateCurrent=(req,res,db,cd)=>
{
db('image').where('fsd','<',cd)
  .andWhere('fed','>',cd)
  .update(
  {
    status:'current'
  }).then(data=>
  {
    console.log("updating current");
  updateUpcoming(req,res,db,cd);
    })
  .catch(err=>res.status(400).json(err))  
}

const updateUpcoming=(req,res,db,cd)=>
{
db('image').where('fsd','>',cd)
  .update(
  {
    status:'upcoming'
  }).then(data=>
  {
updatePrevious(req,res,db,cd);
  })
  .catch(err=>res.status(400).json(err))
}

const updatePrevious=(req,res,db,cd)=>
{
   db('image').where('fed','<',cd)
  .update(
  {
    status:'previous'
  }).then(data=>
  {
    handleRas(req,res,db);
  })
  .catch(err=>res.status(400).json(err))
}

const handleRas=(req,res,db)=>
{
var section=req.body.section;
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

const handleRequest=(req,res,db)=>
{

  var currentTime = new Date();

var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;

var c = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
cd=c.getFullYear()+"-"+(((c.getMonth()+1)<10)?'0':'')+(c.getMonth()+1)+"-"+((c.getDate()<10)?'0':'')+c.getDate()+" " +((c.getHours()<10)?'0':'')+c.getHours() + ":"  
                +((c.getMinutes()<10)?'0':'')+ c.getMinutes();
   console.log(cd);
   
  updateCurrent(req,res,db,cd);
  
}

  module.exports={
  handleRequest:handleRequest
}
