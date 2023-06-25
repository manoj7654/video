// importing express for making server
const express=require("express")
const http=require("http");
const {Server}=require("socket.io");

const cors=require("cors")
// importing dotenv for accessing env file
require("dotenv").config()
const {connection}=require("./config/db")

// importing userRouter from routes for accessing routes
const {userRouter}=require("./routes/userRoutes")
const {bookingRouter}=require("./routes/bookingRoute")






// middleware 

const app=express();

app.use(express.json())
app.use(cors())
const http_Server=http.createServer(app)
const io=new Server(http_Server)
app.get("/",(req,res)=>{
    res.send("Hello from server")
})
app.use("/users",userRouter)
app.use("/bookings",bookingRouter)


app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/:room",(req,res)=>{
  res.render('room',{roomId: req.params.room});
});

io.on("connection",(socket)=>{
  socket.on('join-room',(roomId,userId)=>{
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('userConnected',userId);

    socket.on('disconnect',()=>{
      socket.broadcast.to(roomId).emit('userDisconnected',userId);
    });
  })
});

// Server is running 
http_Server.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to DB")
    } catch (error) {
        console.log("Getting error while connected to DB")
    }
    console.log(`Server is running on port no ${process.env.port}`)
})



