const express = require("express");
const {BookingModal}=require("../modals/bookingModal")
const {authenticate}=require("../middleware/authentication")
const {authorisation}=require("../middleware/authorisation")
const bookingRouter = express.Router();
const nodemailer = require("nodemailer")
require("dotenv").config()

bookingRouter.get("/singleUser", authenticate,authorisation(["patient","doctor"]),async (req, res) => {
    //getting paticular user booking data
    let userID = req.body.userID;
    let role=req.body.role
    console.log(userID)
    try {
        if(role=="patient"){
            const resultData = await BookingModal.find({ userID });
            res.json({" msg": `All booking data of userId ${userID}`, "Data": resultData })
        }else{
            const resultData = await BookingModal.find({ doctorId:userID });
            
            res.json({ "msg": `All booking data of doctorId ${userID}`, "Data": resultData })
        }
        
     
    } catch (error) {
        console.log("error from getting paticular user booking data", error.message);
        res.json({ "msg": "error in getting paticular user booking data", "errorMsg": error.message })
    }
})
bookingRouter.get("/:doctorId",authenticate,authorisation(["doctor"]), async (req, res) => {
    //getting paticular doctor booking data
    let doctorId = req.params.doctorId;
    try {
        const resultData = await BookingModal.find({ doctorId });
        res.json({ "msg": `All booking data of doctorId ${doctorId}`, "Data": resultData })
    } catch (error) {
        console.log("error from getting paticular doctor booking data", error.message);
        res.json({ "msg": "error in getting paticular doctor booking data", "errorMsg": error.message })
    }
})
bookingRouter.post("/create",authenticate,authorisation(["patient"]) , async (req, res) => {
    //create new booking
    const data = req.body;
    try {
        let allBookings = await BookingModal.find({ doctorId: data.doctorId })
        if (allBookings.length === 0) {
            const addData = new BookingModal(data);
            await addData.save();
        } else {
            for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i].bookingDate === data.bookingDate&&allBookings[i].bookingSlot === data.bookingSlot) {
                        res.json({ "msg": "This Slot is Not Available." })
                        return;
                }
            }
            const addData = new BookingModal(data);
            await addData.save();
            
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'manojsfstm5@gmail.com',
                pass: process.env.emailpassword
            }
        });
        const mailOptions = {
            from: 'manojsfstm5@gmail.com',
            to: `${data.email}`,
            subject: 'Booking Confirmation from Doctor Patient Appointment Booking',
            text: `Your Booking is confirmed on ${data.bookingDate} date at ${data.bookingSlot} slot.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //console.log(error);
                return res.status(500).json({ "msg": 'Error while sending conformation mail' });
            } else {
                return res.status(200).json({ "msg": "new booking created successfully Confiramtion sent to email" });
            }
        });

    }
    catch (error) {
        console.log("error from adding new booking data", error.message);
        res.json({ msg: "error in adding new booking data", "errorMsg": error.message })
    }
})
bookingRouter.delete("/delete/:id", authenticate,authorisation(["patient"]),async (req, res) => {
    //removing the booking data
    const ID = req.params.id
    //console.log(ID);
    try {
        await BookingModal.findByIdAndDelete({ _id: ID });
        res.json({ msg: `booking id of ${ID} is deleted succesfully` })
    } catch (error) {
        console.log("error from deleting booking data", error.message);
        res.json({ msg: "error in deleting of booking data", errorMsg: error.message })
    }
})
module.exports={bookingRouter}