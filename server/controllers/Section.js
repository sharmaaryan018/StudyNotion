const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req, res) => {
    try{
        //data fetch
        const{sectionName, courseId} = req.body;
        //data  Validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate (
            courseId,{
                $push:{
                    courseContent:newSection._id,
                }
        },
        {new:true});
        //hw - use populate to replace sections/sub-sections
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created Successfully',
            updatedCourseDetails,
        })

    }

    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        });
    }
}

exports.updateSection = async(req, res) => {
    try{
        //data input
        const{sectionName, sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName}, {new:true});
        //return response

        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
};

exports.deleteSection = async (req, res) => {

    try{
        //get id - Assuming that we re sending id in params
        const {sectionId} = req.body;
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'Unable to delete Section, please try again',
            error: error.message,
        });
    }
};
   