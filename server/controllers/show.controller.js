const { default: mongoose } = require("mongoose");
const movieModel = require("../models/movie.model");
const showModel = require("../models/show.model");
const theatreModel = require("../models/theatre.model");
const moment = require("moment");

const createTestShows = async (req, res) => {
  try {
    const movies = await movieModel.find({});
    const randomTheatre = await theatreModel.aggregate([
      { $sample: { size: 1 } },
    ]);
    const theatre = randomTheatre[0];

    console.log(
      "[createTestShows] Initial check: Movies found:",
      movies.length
    );
    console.log("[createTestShows] Initial check: Theatre sampled:", !!theatre);

    if (movies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No movies found in DB to create shows for.",
      });
    }

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "No theatres found in DB to create shows for.",
      });
    }

    const commonShowTimes = ["10:00 AM", "04:00 PM", "10:00 PM"];
    const daysToCreate = 5;
    const defaultTotalSeats = 150;
    const defaultTicketPrice = 250;

    const allShowsCreated = [];
    const existingShowsSkipped = [];

    for (const movie of movies) {
      for (let i = 0; i < daysToCreate; i++) {
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + i);
        showDate.setHours(0, 0, 0, 0);

        for (const time of commonShowTimes) {
          const existingShow = await showModel.findOne({
            movie: movie._id,
            theatre: theatre._id,
            showDate: showDate,
            showTime: time,
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

    res.status(200).json({
      success: true,
      message: `Automation complete. Created ${allShowsCreated.length} new shows. ${existingShowsSkipped.length} existing shows skipped.`,
      newShows: allShowsCreated,
      skippedShows: existingShowsSkipped.map((id) => id.toString()),
    });
  } catch (error) {
    console.error("Error in createTestShows:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to automate show creation.",
    });
  }
};

const createShow = async (req, res) => {
  const { movie, theatre, showDate, showTime, totalSeats } = req.body;
  const userId = req.userDetails._id;
  const userType = req.userDetails.userType;
  try {
    const getTheatre = await theatreModel.findById(theatre);
    if (getTheatre == null) {
      return res
        .status(400)
        .send({ success: false, message: "Please enter correct theatre ID" });
    }
    const getMovie = await movieModel.findById(movie);
    if (getMovie == null) {
      return res
        .status(400)
        .send({ success: false, message: "Please enter correct Movie ID" });
    }
    if (
      userType === "partner" &&
      getTheatre.owner.toString() !== userId.toString()
    ) {
      return res.status(403).send({
        success: false,
        message: "Access Denied: You do not own this theatre.",
      });
    }

    const newShow = new showModel(req.body);
    const response = await newShow.save();
    return res.status(201).send({
      success: true,
      message: "New Show has been added successfully.",
      data: response,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again" });
  }
};

const getAllShows = async (req, res) => {
  try {
    const allShows = await showModel
      .find({})
      .populate("movie")
      .populate("theatre");
    return res.status(200).send({
      success: true,
      message: "All show has been fetched",
      data: allShows,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

const getTheatresAndShowsByMovie = async (req, res) => {
  const { movieid } = req.params;
  const { date } = req.query;
  try {
    const getMovie = await movieModel.findById(movieid);
    if (!getMovie) {
      return res
        .status(400)
        .send({ success: false, message: "Please enter correct Movie ID" });
    }

    const filter = { movie: movieid };
    if (date) {
      const selectedDate = moment(date).startOf("day").toDate();
      const nextDay = moment(date).endOf("day").toDate();

      filter.showDate = {
        $gte: selectedDate,
        $lt: nextDay,
      };
    }
    const allShows = await showModel
      .find(filter)
      .populate("theatre")
      .populate("movie");

    let showsByTheatreId = {};
    allShows.forEach((show) => {
      if (!show.theatre || !show.movie) return;

      const theatreId = show.theatre._id.toString();
      if (!showsByTheatreId[theatreId]) {
        showsByTheatreId[theatreId] = {
          _id: show.theatre._id,
          name: show.theatre.name,
          address: show.theatre.address,
          showtimes: [],
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
      data: theatresWithShows,
    });
  } catch (err) {
    console.error("Error in getTheatresAndShowsByMovie:", err);
    return res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const getShowDetailsByShowId = async (req, res) => {
  try {
    const showId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid show Id format",
      });
    }
    const show = await showModel
      .findById(showId)
      .populate("movie")
      .populate("theatre");
    if (!show) {
      return res.status(400).send({
        success: false,
        message: "Invalid show Id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Fetched the show details for the movie successfully",
      data: show,
    });
  } catch (err) {
    console.error("Error in getting show details:", err);
    return res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const getMyTheatreShows = async (req, res) => {
  try {
    const ownerId = req.userDetails._id;
    const myTheatres = await theatreModel
      .find({ owner: ownerId })
      .select("_id");
    const myTheatreIds = myTheatres.map((theatre) => theatre._id);

    if (myTheatreIds.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No theatres found for this partner, hence no shows.",
        data: [],
      });
    }
    const myShows = await showModel
      .find({ theatre: { $in: myTheatreIds } })
      .populate("movie")
      .populate("theatre");

    return res.status(200).send({
      success: true,
      message: "My theatre shows fetched successfully.",
      data: myShows,
    });
  } catch (err) {
    console.error("Error fetching my theatre shows:", err);
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

const updateShow = async (req, res) => {
  try {
    const showId = req.params.id;
    const updates = req.body;
    const updatedShow = await showModel.findByIdAndUpdate(
      showId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedShow) {
      return res
        .status(404)
        .send({ success: false, message: "Show not found." });
    }
    return res.status(200).send({
      success: true,
      message: "Show updated successfully.",
      data: updatedShow,
    });
  } catch (err) {
    console.error("Error updating show:", err);
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

const deleteShow = async (req, res) => {
  try {
    const showId = req.params.id;
    const deletedShow = await showModel.findByIdAndDelete(showId);

    if (!deletedShow) {
      return res
        .status(404)
        .send({ success: false, message: "Show not found." });
    }

    return res.status(200).send({
      success: true,
      message: "Show deleted successfully.",
      data: deletedShow,
    });
  } catch (err) {
    console.error("Error deleting show:", err);
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

module.exports = {
  createShow,
  getAllShows,
  getTheatresAndShowsByMovie,
  getShowDetailsByShowId,
  createTestShows,
  getMyTheatreShows,
  updateShow,
  deleteShow,
};
