import user from "../models/auth.js";
//generatre otp
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
//request otp
export const requestOTP = async (req, res) => {
    try{
        const { language } = req.body;
        const user=req.userId;
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        //send otp
        if(language === "French"){
            //send otp to email
            console.log(`OTP sent to email: ${otp}`);
        }else{
            //send otp to mobile
            console.log(`OTP sent to mobile: ${otp}`);
        }
        res.status(200).json({ 
            message: "OTP sent successfully",
                      method: language==="French"?"email":"mobile"
        });
    } 
    catch (error) {
        res.status(500).json({ message: "Error occurred while sending OTP" });
    }
};
// Verify OTP and switch language
export const verifyOTP = async (req, res) => {
    try {
        const { otp , language} = req.body;
        const user = req.userId;
        if (user.otp === otp && user.otpExpiry > new Date()) {
            user.language = language;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            res.status(200).json({ message: "Language switched successfully", language: language });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while verifying OTP" });
    }
};