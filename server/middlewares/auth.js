const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async(req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        // if token is missing, then return reponse
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is Missing',
            });
        }

        //verify the token
        try {
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verifivation issue
            return res.status(401).json({
                success:false,
                message:'Token is In valid',
            });
        }
        next();
    }
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}



//isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
          if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
          }
          next();
    }
    catch(error) {
        return res.status(500).json({
           success:false,
           message:'User Role cannot be verified, please try again', 
        });
    }
}

//isStudent
exports.isStudent = async(req, res, next) => {
    try {
          if(req.user.accountType !== "Student") {
            return res.status(401).json({
                 success:false,
                message:'This is a protected route for student only',
            });
          }
          next();
    }
    catch(error) {
        return res.status(500).json({
           success:false,
           message:'User Role cannot be verified, please try again', 
        });
    }
}




//isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
          if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for student only',
            });
          }
          next();
    }
    catch(error) {
        return res.status(500).json({
           success:false,
           message:'User Role cannot be verified, please try again', 
        });
    }
}