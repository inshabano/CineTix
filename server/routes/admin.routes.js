const { 
    submitPartnerApplication,
    getAllPartnerApplications,
    approvePartnerApplication,
    rejectPartnerApplication 
} = require('../controllers/admin.controller'); 
const { verifyJWT, verifyAdmin } = require('../middlewares/auth.middleware'); 

module.exports = (app) => {
    app.post('/partner-applications', submitPartnerApplication);
    app.get('/admin/partner-applications', [verifyJWT, verifyAdmin], getAllPartnerApplications);
    app.post('/admin/partner-applications/:applicationId/approve', [verifyJWT, verifyAdmin], approvePartnerApplication);
    app.post('/admin/partner-applications/:applicationId/reject', [verifyJWT, verifyAdmin], rejectPartnerApplication);
};