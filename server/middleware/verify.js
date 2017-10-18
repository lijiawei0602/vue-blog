import jwt from 'jsonwebtoken';
import config from '../configs';

export default async(ctx,next) => {
    const authorization = ctx.get("Authorization");
    if(authorization === ""){
        ctx.throw(401,"no token detected in thhp header \'Authorization\'");
    }
    const token = authorization.split(" ")[1];
    let tokenContent;
    try{
        tokenContent = await jwt.verify(token , config.jtw.secret);
    }catch(err){
        if("TokenExpiredError" === err.name){
            ctx.throw(401 , "token expired");
        }
        ctx.throw(401 , "invaild token");
    }
    await next();
};