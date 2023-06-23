// importing express for making users and doctors router
const expres=require("express");
const userRouter=expres.Router();


// importing  usermodal 
const {UserModal}=require("../modals/userModal")

// importing bcrypt for hashing the password 
const bcrypt=require("bcrypt")

// for generating token
const jwt=require("jsonwebtoken")

// for accessing env file
require("dotenv").config()

// for accessing file sytem module
const fs=require("fs")
userRouter.get("/",(req,res)=>{
    res.send("Welcome")
})


// registration for doctors and users based on the role
userRouter.post("/register",async(req,res)=>{
    const {name,email,password,role,gender,specialty,location}=req.body
    try {
        const check=await UserModal.find({email})
        if(check.length>0){
            return res.json({"message":"User already exist"})
        }
        bcrypt.hash(password, 5, async(err, secure_password)=> {
           if(err){
            console.log(err)
           }else{
            const user=new UserModal({name,email,password:secure_password,role,gender,specialty:specialty||"none",location});
            await user.save();
            res.json({"message":"Registration successfully"})
           }
        });
    } catch (err) {
        console.log(err);
        console.log({"message":"Something went wrong"})
    }
})


// for signing users and doctors
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModal.find({email})
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result)=> {
                if(result){
                    
                    const token=jwt.sign({userID:user[0]._id,role:user[0].role,email:user[0].email},process.env.key );
                    const refresh_token=jwt.sign({userID:user[0]._id},process.env.secret_key,{expiresIn:180})
                    
                    res.json({"token":token,"refresh_token":refresh_token,"role":user[0].role,"email":user[0].email,"name":user[0].name,"userId":user[0]._id,"message":"Login Successfuly"})
                }else{
                    res.json({"message":"Wrong credential"})
                }
            });
        }else{
            res.json("Wrong credential")
        }
    } catch (err) {
        console.log(err);
         console.log({"err":"Something went wrong"})
    }
})

//getting all doctors

userRouter.get("/doctors",async(req,res)=>{
    try {
        const allData=await UserModal.find({role:"doctor"});
        res.json(allData)
    } catch (error) {
        console.log(error)
    }
})
 

// this is logout if users wants to logout then they will logged out
userRouter.get("/logout", (req,res)=>{

   const token=req.headers.authorization;
    const blacklistdata=JSON.parse(fs.readFileSync("./blacklistdata.json","utf-8"))
    blacklistdata.push(token)
    fs.writeFileSync("./blacklistdata.json",JSON.stringify(blacklistdata))
    res.send("logout successful")
})










module.exports={userRouter}




// {
//     "name":"Manoj Kumar",
//     "email":"manojsfstm5@gmail.com",
//     "password":"manoj",
//     "role":"doctor",
//     "gender":"male",
//     "specialty":"dentalist",
//     "location":"Sitamarhi"
//   }

// {
//     "name":"Santosh Kumar",
//     "email":"santosh@gmail.com",
//     "password":"santosh",
//     "gender":"male",
//     "location":"Sitamarhi"
//   }