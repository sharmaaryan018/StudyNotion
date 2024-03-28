const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        expires: 5 * 60, // Expires in 5 minutes (5 * 60 seconds)
    },
});

// Function to Send Emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email Sent Successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending the mail", error);
        throw error;
    }
}
    //pre save middleware
OTPSchema.pre("save", { document: true, }, async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
