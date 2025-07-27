const { default: mongoose } = require("mongoose");
const movieModel = require("../models/movie.model");
const showModel = require("../models/show.model");
const theatreModel = require("../models/theatre.model");

const createTestShows = async (req, res) => {
    try {
        const movies = await movieModel.find({});
        const theatres = await theatreModel.find({});

        if (movies.length === 0) {
            return res.status(404).json({ success: false, message: "No movies found in DB to create shows for." });
        }
        if (theatres.length === 0) {
            return res.status(404).json({ success: false, message: "No theatres found in DB to create shows for." });
        }
        const commonShowTimes = ['10:00 AM', '04:00 PM', '10:00 PM'];
        const daysToCreate = 5;
        const defaultTotalSeats = 150;
        const defaultTicketPrice = 250;

        const allShowsCreated = [];
        const existingShowsSkipped = [];

        for (const movie of movies) {
            for (const theatre of theatres) {
                for (let i = 0; i < daysToCreate; i++) {
                    const showDate = new Date();
                    showDate.setDate(showDate.getDate() + i);
                    showDate.setHours(0, 0, 0, 0); 

                    for (const time of commonShowTimes) {
                        const existingShow = await showModel.findOne({
                            movie: movie._id,
                            theatre: theatre._id,
                            showDate: showDate,
                            showTime: time
                        });

                        if (!existingShow) {
                            const newShow = new showModel({
                                movie: movie._id,
                                theatre: theatre._id,
                                showDate: showDate,
                                showTime: time, 
                                totalSeats: defaultTotalSeats,
                                bookedSeats: [],
                                ticketPrice: defaultTicketPrice,
                            });
                            await newShow.save();
                            allShowsCreated.push(newShow._id);
                        } else {
                            existingShowsSkipped.push(existingShow._id);
                        }
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Automation complete. Created ${allShowsCreated.length} new shows. ${existingShowsSkipped.length} existing shows skipped.`,
            newShows: allShowsCreated,
            skippedShows: existingShowsSkipped.map(id => id.toString())
        });

    } catch (error) {
        console.error("Error in createTestShows:", error);
        res.status(500).json({ success: false, message: "Server error: Failed to automate show creation." });
    }
};


const createShow = async (req, res) =>{
    const {movie, theatre, showDate, showTime, totalSeats} = req.body;
    try{
       const getTheatre = await theatreModel.findById(theatre);
       if(getTheatre == null){
        return res.status(400).send({success:false, message: "Please enter correct theatre ID"})
       }
       const getMovie = await movieModel.findById(movie);
       if(getMovie == null){
        return res.status(400).send({success:false, message: "Please enter correct Movie ID"})
       }

       const newShow = new showModel(req.body);
       const response = await newShow.save();
       return res.status(201).send({
        success:true,
        message: "New Show has been added successfully.",
        data: response
       })
       
    }catch(err){
        return res.status(500).send({message: "Something went wrong. Please try again"})
    }

}

const getAllShows =async (req,res) => {
    try{
        const allShows = await showModel.find({}).populate('movie').populate('theatre');
        return res.status(200).send({
                success: true,
                message: "All show has been fetched",
                data: allShows,
            })
    }catch(err){
        return res.status(500).send({message:"Something went wrong. Please try again."})
    }
}


const getTheatresAndShowsByMovie = async (req, res) => {
    const { movieid } = req.params;
    const { date } = req.query;
    try {
        const getMovie = await movieModel.findById(movieid);
        if (!getMovie) {
            return res.status(400).send({ success: false, message: "Please enter correct Movie ID" });
        }

        const filter = { movie: movieid };
        if (date) {
            const selectedDate = new Date(date); 
            selectedDate.setUTCHours(0, 0, 0, 0); 
            const nextDay = new Date(selectedDate);
            nextDay.setUTCDate(selectedDate.getUTCDate() + 1); 

            filter.showDate = {
                $gte: selectedDate, 
                $lt: nextDay       
            };
        }
        const allShows = await showModel.find(filter).populate('theatre').populate('movie');

        let showsByTheatreId = {};
        allShows.forEach(show => {
            if (!show.theatre || !show.movie) return;

            const theatreId = show.theatre._id.toString();
            if (!showsByTheatreId[theatreId]) {
                showsByTheatreId[theatreId] = {
                    _id: show.theatre._id,
                    name: show.theatre.name,
                    address: show.theatre.address,
                    showtimes: []
                };
            }
            showsByTheatreId[theatreId].showtimes.push({
                showId: show._id,
                time: show.showTime,
                totalSeats: show.totalSeats,
            });
        });

        const theatresWithShows = Object.values(showsByTheatreId);

        return res.status(200).send({
            success: true,
            message: "Fetched all the shows for the movie successfully",
            data: theatresWithShows
        });

    } catch (err) {
        console.error("Error in getTheatresAndShowsByMovie:", err);
        return res.status(500).send({ success: false, message: "Something went wrong. Please try again." });
    }
}

const getShowDetailsByShowId = async (req,res)=>{
    try{
        const showId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(showId)){
            return res.status(400).send({
                success: false,
                message: "Invalid show Id format"
            })
        }
        const show = await showModel.findById(showId).populate('movie').populate('theatre');
        if(!show){
            return res.status(400).send({
                success: false,
                message: "Invalid show Id"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Fetched the show details for the movie successfully",
            data: show
        });

    }catch(err){
        console.error("Error in getting show details:", err);
        return res.status(500).send({ success: false, message: "Something went wrong. Please try again." });
    }
}

module.exports = {
    createShow,
    getAllShows,
    getTheatresAndShowsByMovie,
    getShowDetailsByShowId,
    createTestShows
}