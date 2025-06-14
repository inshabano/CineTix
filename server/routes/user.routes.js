const { onRegister, onLogin, getAllUsers, getCurrentUser } = require("../controllers/user.controller")

module.exports = (app) =>{
    app.post('/register',onRegister);
    app.post('/login', onLogin);
    app.get('/users', getAllUsers);
    app.get('/users/current',getCurrentUser);
}