
const verifyCreateMovieRequest = (req, res, next) =>{
    const {poster, movieName, description} = req.body;
    if(!poster){
        return res.status(400).send({success:false, message: "Poster URL is missing"});
    }
     if(!movieName){
        return res.status(400).send({success:false, message: "Movie name is missing"});
    }
     if(!description){
        return res.status(400).send({success:false, message: "Movie description is missing"});
    }
    next();
}

module.exports = {verifyCreateMovieRequest};