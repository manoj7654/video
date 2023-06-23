//outerfunction//
const authorisation=(role_array)=>{
    //inner function//
    return(req,res,next)=>{
       const role=req.body.role;
      //  console.log(userrole)
      if(role_array.includes(role)){
        next()
      }else{
        res.json({"msg":"Your are not authorised"})
      }
    }
    
}


module.exports={authorisation}