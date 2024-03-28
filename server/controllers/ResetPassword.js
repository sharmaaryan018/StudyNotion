const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
  
  try{
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Your Email is not registered with us',
      });
    }

    //generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate({email: email},{
      token: token,
      resetPasswordExpires: Date.now() + 5+60*1000,
    },
    {new:true});
    //create url
    const url = `http://localhost:3000/update-password/${token}`
    //send email containing the url
    await mailSender(email, "Password reset link",
    `Password reset link: ${url}`);
    //return response
    return res.json({
      success:true,
      message:'Email sent successfully, please check email and change pwd'
    });
  }
  catch(error) {
    console.log(error);
    return res.status(500) ({
      success:false,
      message:'Something went wrong while reset password mail',
    });
  }
   } 

//resetPassword

exports.resetPassword = async (req, res) => {
 try{
       //data fetch
  const {password, confirmPassword, token} = req.body;
  //Validation
  if(password !== confirmPassword) {
    return res.json({
      success:false,
      message:'Password not matching',
    });
  }
  //get User details from db using token
  const userDetails = await User.findOne({token: token});
  //if no entry - invalid token
  if(!userDetails) {
    return res.json({
      success:false,
      message:'Token is Invalid',
    });
  }
  //token time check
  if(userDetails.resetPasswordExpires < Date.now()) {
    return res.json({
      success:false,
      message:'Token is expired, pplease regenerate your token',
    });
  }
  //hash pwd
  const hashedPassword = await bcrypt.hash(password,10);

  //update password
  await User.findOneAndUpdate(
    {token: token},
    {password:hashedPassword},
    {new:true},
  )

  //return response
  return res.status(200).json({
    success:true,
    message:'Passsword reset successful',
  });
}
 
 catch(error) {
  console.log(error);
  return res.status(500).json ({
    success:false,
    message:'Something went wrong while reset password mail',
  });
 }
};