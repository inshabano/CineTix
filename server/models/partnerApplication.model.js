
const mongoose = require('mongoose');

const partnerApplicationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false, 
    },
    applicantEmail: { 
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    applicantName: { 
        type: String,
        required: true,
        trim: true,
    },
    theatreName: { 
        type: String,
        required: true,
        trim: true,
    },
    theatreAddress: { 
        type: String,
        required: true,
        trim: true,
    },
    contactPhone: { 
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminNotes: { 
        type: String,
        default: '',
    },
}, {
    timestamps: true 
});

const PartnerApplication = mongoose.model('PartnerApplication', partnerApplicationSchema);
module.exports = PartnerApplication;