const { createTheatre, getAllTheatres, getMyTheatres, updateTheatre } = require("../controllers/theatre.controller");
const { verifyJWT, verifyAdminOrPartner, verifyAdmin, verifyTheatreOwnership } = require("../middlewares/auth.middleware");

module.exports = (app) =>{
    app.post('/theatres',[verifyJWT,verifyAdminOrPartner], createTheatre);
    app.get('/theatres',[verifyJWT, verifyAdmin], getAllTheatres);
    app.get('/theatres/my-theatres', [verifyJWT, verifyAdminOrPartner], getMyTheatres);
    app.put('/theatres/:id',[verifyJWT, verifyAdminOrPartner, verifyTheatreOwnership], updateTheatre)
}