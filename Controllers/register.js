const handleRegister=(req,res,db,bcrypt)=>
{
	const { name , email ,password }=req.body;
const hash = bcrypt.hashSync(password);
if(!email || !name || !password)
{
	return res.status(400).json('unable to register');	
}
else
{
db.transaction(trx=>
	{
		trx.insert(
		{
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(logemail=>{
		return trx('users')
		.returning('*')
		.insert({
		email:logemail[0],
		name:name,
		joined:new Date()
	}).then(user=>
	{
		res.json(user[0]);
	})
}).then(trx.commit)
	.catch(trx.rollback)
	})	
	.catch(err=>res.status(400).json('unable to register'))	
}
}

module.exports={
	handleRegister:handleRegister
}