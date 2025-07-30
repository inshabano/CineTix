
const PartnerApplication = require('../models/partnerApplication.model');
const { userModel } = require('../models/user.model');
const theatreModel = require('../models/theatre.model'); 


const submitPartnerApplication = async (req, res) => {
    try {
        const { applicantName, applicantEmail, theatreName, theatreAddress, contactPhone } = req.body;
        const userId = req.userDetails?._id; 

        if (!applicantName || !applicantEmail || !theatreName || !theatreAddress || !contactPhone) {
            return res.status(400).json({ success: false, message: "All application fields are required." });
        }

        const existingApp = await PartnerApplication.findOne({ applicantEmail, status: 'pending' });
        if (existingApp) {
            return res.status(400).json({ success: false, message: "You already have a pending partner application." });
        }
        if (userId) {
            const user = await userModel.findById(userId);
            if (user && (user.userType === 'partner' || user.userType === 'admin')) {
                return res.status(400).json({ success: false, message: "You are already a partner or admin." });
            }
        }
        const newApplication = new PartnerApplication({
            userId: userId, 
            applicantName,
            applicantEmail,
            theatreName,
            theatreAddress,
            contactPhone,
            status: 'pending',
        });

        await newApplication.save();
        return res.status(201).json({ success: true, message: "Your partner application has been submitted successfully! We will review it shortly." });

    } catch (error) {
        console.error("Error submitting partner application:", error);
        res.status(500).json({ success: false, message: "Server error: Could not submit application." });
    }
};


const getAllPartnerApplications = async (req, res) => {
    try {
        const applications = await PartnerApplication.find({}).populate('userId', 'username email'); 
        return res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error fetching partner applications:", error);
        res.status(500).json({ success: false, message: "Server error: Could not fetch applications." });
    }
};


const approvePartnerApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { adminNotes } = req.body; 

        const application = await PartnerApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: "Partner application not found." });
        }
        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Application is already ${application.status}.` });
        }
        
        let userToUpdate = null;
        if (application.userId) { 
            userToUpdate = await userModel.findById(application.userId);
        } else { 
            userToUpdate = await userModel.findOne({ email: application.applicantEmail });
            if (!userToUpdate) {
                
                
                return res.status(400).json({ success: false, message: "User for this application not found. Applicant must register first." });
            }
        }
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: "Associated user not found." });
        }
        userToUpdate.userType = 'partner';
        await userToUpdate.save();
        const newTheatre = new theatreModel({
            name: application.theatreName,
            address: application.theatreAddress,
            email: application.applicantEmail,
            phone: application.contactPhone,
            owner: userToUpdate._id, 
        });
        await newTheatre.save();
        application.status = 'approved';
        application.adminNotes = adminNotes || '';
        await application.save();
        return res.status(200).json({ success: true, message: "Partner application approved and user assigned partner role.", newTheatre: newTheatre._id, partnerUser: userToUpdate._id });

    } catch (error) {
        console.error("Error approving partner application:", error);
        res.status(500).json({ success: false, message: "Server error: Could not approve application." });
    }
};


const rejectPartnerApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { adminNotes } = req.body;

        const application = await PartnerApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: "Partner application not found." });
        }
        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Application is already ${application.status}.` });
        }

        application.status = 'rejected';
        application.adminNotes = adminNotes || '';
        await application.save();
        return res.status(200).json({ success: true, message: "Partner application rejected." });

    } catch (error) {
        console.error("Error rejecting partner application:", error);
        res.status(500).json({ success: false, message: "Server error: Could not reject application." });
    }
};

module.exports = {
    submitPartnerApplication,
    getAllPartnerApplications,
    approvePartnerApplication,
    rejectPartnerApplication,
};