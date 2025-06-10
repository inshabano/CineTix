const { onRegister, onLogin } = require("../controllers/user.controller")

module.exports = (app) =>{
    app.post('/register',onRegister);
    app.post('/login', onLogin);
}