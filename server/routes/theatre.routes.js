const { createTheatre, getAllTheatres } = require("../controllers/theatre.controller");
const { verifyJWT, verifyAdminOrPartner, verifyAdmin } = require("../middlewares/auth.middleware");

module.exports = (app) =>{
    app.post('/theatres',[verifyJWT,verifyAdminOrPartner], createTheatre);
    app.get('/theatres',[verifyJWT, verifyAdmin], getAllTheatres);
}