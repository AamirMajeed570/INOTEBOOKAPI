var jwt = require('jsonwebtoken');
const JWT_SEC_KEY = "AamirMajeedKhan@2000";
//Get User from jwt token  and add ID
const FetchUser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using valid token"});

    }
    try{

        const data = jwt.verify(token,JWT_SEC_KEY);
        req.user=data.user;
        next();
    }
    catch(err){
        res.status(401).send({error:"Please authenticate using valid token"});
    }
}

module.exports=FetchUser;