const mongoose=require("mongoose");

const bookingShcema=mongoose.Schema({
    userID:{type:String,require:true},
    doctorId:{type:String,require:true},
    email:{type:String,require:true},
    bookingDate:{type:String,require:true},
    bookingSlot:{type:String,require:true}
 
})

const BookingModal=mongoose.model("bookings",bookingShcema);


module.exports={BookingModal}