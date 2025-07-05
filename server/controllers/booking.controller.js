const availableDate = async (req,res)=>{
    try {
        const { movieid } = req.params;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        const datesWithShows = [
            today.toISOString().split('T')[0], // Today
            tomorrow.toISOString().split('T')[0], // Tomorrow
            dayAfterTomorrow.toISOString().split('T')[0] // Day after
        ];

        res.send({ success: true, data: datesWithShows });
    } catch (error) {
        console.error("Backend error getting available dates:", error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}

const getTheaters = (req,res)=>{
     try {
        const { movieid } = req.params;
        const { date } = req.query; // This will be a "YYYY-MM-DD" string

        if (!date) {
            return res.status(400).send({ success: false, message: "Date parameter is required." });
        }

        const dummyTheaters = [
            {
                _id: "theater123",
                name: "Cineplex Grand",
                address: "123 Main St",
                showtimes: ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:00 PM"]
            },
            {
                _id: "theater456",
                name: "Star Theaters",
                address: "456 Oak Ave",
                showtimes: ["11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM"]
            },
            {
                _id: "theater789",
                name: "Galaxy Multiplex",
                address: "789 Pine Ln",
                showtimes: ["10:30 AM", "01:45 PM", "04:00 PM", "07:15 PM"]
            }
        ];

        res.send({ success: true, data: dummyTheaters });
    } catch (error) {
        console.error("Backend error getting theaters and showtimes:", error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}

module.exports = {
    availableDate,
    getTheaters,
}