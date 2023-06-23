// importing express for making server
const express=require("express");
const app=express();

// importing dotenv for accessing env file
require("dotenv").config()
const connection=require("./config/db")

// importing userRouter from routes for accessing routes
const {userRouter}=require("./routes/userRoutes")
const {bookingRouter}=require("./routes/bookingRoute")
const cors=require("cors")
// middleware 
app.use(express.json())


app.use(cors())
app.get("/",(req,res)=>{
    res.send("Hello from server")
})
app.use("/users",userRouter)
app.use("/bookings",bookingRouter)


// Server is running 
app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to DB")
    } catch (error) {
        console.log("Getting error while connected to DB")
    }
    console.log(`Server is running on port no ${process.env.port}`)
})



