const ratingAndreviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const RatingAndReviews = require("../models/RatingAndReviews");
const { default: mongoose } = require("mongoose");

//createRating
exports.createRating = async(req, res) => {
    try{
        //get user id
        const userId = req.user.id;
        //fetch user id from req body
        const {rating, review, courseId} = req.body;
        //check if user enrolled or not
        const courseDetails = await Course.findOne({_id:courseId,
        studentsEnrolled : {selectMatch: {$eq : userId}},
    });
    if(!courseDetails) {
        return res.status(404).json({
            success:false,
            message:`Student is not enrolled in the course`,
        });
    }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
            user:userId,
            course:courseId
        });
        
        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the User',
            })
        }
        //create rating and review
        const ratingReview = await RatingAndReviews.create({
            rating,
            review,
            course : courseId,
            user: userId,
        });
        //update the course with ratingAndreview
       const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new:true}); 

            console.log(updatedCourseDetails);

            //return response
            return res.status(200).json({
                success:true,
                message:"Rating and Review created Successfully",
                ratingReview,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//getAverageRating
exports.getAverageRating = async(req, res) => {
    try{
        //get course id
        const courseId = req.body.courseId;
        //calculate averageRating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ])
        //return rating
        if(result.length> 0) {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }
        //if no ratingReview exist
        return res.status(500).json({
            success:true,
            message:'Average Rating is 0, no rating till now',
            averageRating:0,
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

//getAllRating

exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await RatingAndReviews.find({}).sort({rating: "desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
    return res.status(200).json({
        success:true,
        message:"All reviews fetched Successfully",
        data:allReviews,
    });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}