const clarifai=require('clarifai');
const app=new Clarifai.App({apiKey:process.env.API_KEY});

const handleApiCall=(req,res)=>
{
 app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
 .then(data=>
 {
  res.json(data);
 })
 .catch(err=>res.status(400).json('unable to work with api'));
}


const handleImage=(req,res,db)=>
{
const {id} =req.body;
	db('users').where('id','=',id)
	.increment('enteries',1)
	.returning('enteries')
	.then(enteries=>
	{
		res.json(enteries[0]);
	})
	.catch(err=>res.status(400).json('error getting enteries'))
}

module.exports=
{
	handleImage:handleImage,
	handleApiCall:handleApiCall
}