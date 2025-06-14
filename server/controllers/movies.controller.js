const getAllMovies = (req,res)=>{
    return res.send({success:true, data:[1,2]});
}

const getMovieById = (req,res)=>{
    return res.send({success:true, data:{movieId:"123"}});
}

const addMovie = (req,res)=>{
    return res.send({success:true, message:"New movie added successfully"});
}

const createBooking = (req,res)=> {
    return res.send({success:true, message:"New booking created successfully!!"});
}

module.exports = {getAllMovies, getMovieById, addMovie, createBooking}