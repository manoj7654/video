const jwt=require("jsonwebtoken")
const fs=require("fs")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    // console.log(token)
    if(!token){
        res.send("Please Login again first")
    }else{
      const blacklistdata=JSON.parse(fs.readFileSync("./blacklistdata.json","utf-8"))
      if(blacklistdata.includes(token)){
        return res.send("Login first")
      }else{
        try {
            const decode=jwt.verify(token,"masai");
                if(decode){
                    const role=decode.role
                    req.body.role=role
                    // console.log(userRole)
                    const userID=decode.userID
                    req.body.userID=userID
                    console.log(userID)
                    const email=decode.email
                    req.body.email=email
                    // console.log(userID)
                    next()
        
                }else{
                    res.json("Please login Again")
                } 
        } catch (err) {
            res.send({"err":err.message})
        } 
    }
}
}


module.exports={authenticate}