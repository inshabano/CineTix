const { forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { onRegister, onLogin, getAllUsers, getCurrentUser, getUserProfile, updateUserProfile } = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

module.exports = (app) =>{
    app.post('/register',onRegister);
    app.post('/login', onLogin);
    app.get('/users', getAllUsers);
    app.get('/users/current',getCurrentUser);
    app.get('/profile', verifyJWT, getUserProfile);
    app.put('/profile',verifyJWT, updateUserProfile);
    app.post('/forgot-password', forgotPassword);
    app.post('/reset-password/:token', resetPassword); 
}