import twilio from "twilio";

const client = twilio(
    process.env.Twilio_Account_SID,
    process.env.Twilio_Auth_Token
);

export const sendPasswordResetSMS = async({mobile, otp})=>{
await client.messages.create({
    body:  `Your password reset OTP is ${otp}. It will expire in 5 minutes. If you did not request this, please ignore this message.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${mobile}`
})
}