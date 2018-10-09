const handleSignin=(req,res,db,bcrypt)=>
{
	const {email,password}=req.body;
	if(!email || !password)
	{
   return res.status(400).json('wrong creditials')
	}
	else
	{
	db.select('email','pass').from('teachers')
	.where('email','=',req.body.email)
	.then(data=>
	{
	const isValid=bcrypt.compareSync(req.body.password,data[0].pass);
	if(isValid)
	{
		return db.select('*').from('teachers')
		.where('email','=',req.body.email)
		.then(user=>
		{
			res.json(user[0]);
		})
		.catch(err=>res.status(400).json('unable to get user'))
	} 
	else
	{
	res.status(400).json('wrong creditials')
	}})
	.catch(err=>res.status(400).json('wrong creditials'))
	}
}


module.exports={
	handleSignin:handleSignin
}