const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema ({
    courseName: {
        type:String,
        required:true,
        trim:true,
    },
    courseDescription: {
        type:String,
        required:true,
        trim:true,
    },
    instructor: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    whatYouWillLearn : {
        type:String,
        required:true,
    },
    courseContent: [
        {
            type:String,
            ref:"Section",
        }
    ],
    ratingAndReviews: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReviews",
    },
    price: {
            type:String,
        },
    thumbnail:{
        type:String,
        },
        tag:  {
            type:[String],
            required:true,
        },
    category:  {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
        },
        studentsEnrolled:[
            {
             type:mongoose.Schema.Types.ObjectId,
             required:true,
             ref:"User",
    
        }
    ],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},

}); 

module.exports = mongoose.model("Course", courseSchema);