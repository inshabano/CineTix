const Show = require("../models/show.model");
const Booking = require('../models/booking.model');

const deleteOldShows = async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${currentHour}:${currentMinute}`;

        const pastShows = await Show.find({
            $or: [
                { showDate: { $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } },
                {
                    showDate: { $eq: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
                    showTime: { $lt: currentTimeString }
                }
            ]
        });

        if (pastShows.length > 0) {
            const pastShowIds = pastShows.map(show => show._id);

            const updateBookingsResult = await Booking.updateMany(
                { show: { $in: pastShowIds }, status: { $ne: 'cancelled' } },
                { $set: { status: 'cancelled' } }
            );
            console.log(`Automated Deletion: Updated ${updateBookingsResult.modifiedCount} bookings to 'cancelled' status for past shows.`);

            const deleteResult = await Show.deleteMany({ _id: { $in: pastShowIds } });
            console.log(`Automated Deletion: Deleted ${deleteResult.deletedCount} past shows.`);
        } else {
            console.log('Automated Deletion: No past shows found to delete.');
        }

    } catch (error) {
        console.error('Automated Deletion Error: Failed to delete past shows:', error);
    }
};

module.exports = deleteOldShows;