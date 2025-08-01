require('dotenv').config();
const express = require("express");
const connectDB = require('./config/db');
const userRoutes = require("./routes/user.routes");
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const movieRoutes = require("./routes/movie.routes");
const theatreRoutes = require("./routes/theatre.routes");
const showRoutes = require("./routes/show.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require('./routes/payment.routes');
const deleteOldShows = require('./utils/deletePastShows');
const watchlistRoutes = require('./routes/watchlist.routes');
const adminRoutes = require('./routes/admin.routes');
const { createTestShows } = require('./controllers/show.controller');
const { userModel } = require('./models/user.model');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

connectDB();

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: "Too many requests from this IP, please try again in 3 min"
});

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.use(bodyParser.json());

app.use(cors({
    origin: 'https://cinetix-a3z3.onrender.com',
    credentials: true
}));

app.use(apiLimiter);

userRoutes(app);
movieRoutes(app);
theatreRoutes(app);
showRoutes(app);
bookingRoutes(app);
paymentRoutes(app);
watchlistRoutes(app);
adminRoutes(app);

let adminUserId = null;

const initializeAdminUserId = async () => {
    try {
        const adminUser = await userModel.findOne({ userType: 'admin' }).select('_id');
        if (adminUser) {
            adminUserId = adminUser._id;
            console.log(`[Cron Init] Found admin user ID: ${adminUserId}`);
        } else {
            console.warn('[Cron Init] No admin user found in DB. Automated show creation might fail if route is admin-protected.');
            console.warn('[Cron Init] Please ensure you have at least one user with userType: "admin" in your database.');
        }
    } catch (error) {
        console.error('[Cron Init] Error finding admin user for cron job:', error);
    }
};

cron.schedule('0 14 * * *', async () => { 
    console.log(`[Cron Job] Triggered at ${new Date()}`);
    console.log('[Cron Job] Running daily task: Creating test shows for all movies and theatres...');
    if (!adminUserId) {
        await initializeAdminUserId(); 
    }
    if (!adminUserId) {
        console.error('[Cron Job] Skipping show creation: No admin user ID available for authentication. Please create an admin user.');
        return;
    }

    try {
        const mockReq = {
            userDetails: { _id: adminUserId, userType: 'admin' }, 
            body: {} 
        };
        const mockRes = {
            status: (code) => {
                console.log(`[Cron Job - CreateShows] API Response Status: ${code}`);
                return mockRes;
            },
            json: (data) => {
                console.log('[Cron Job - CreateShows] API Response:', data);
            }
        };

        await createTestShows(mockReq, mockRes);
        console.log('[Cron Job] Daily test shows creation complete.');

    } catch (error) {
        console.error('[Cron Job - CreateShows] Critical Error in daily test show cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
});

cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled job: Deleting past shows...');
    deleteOldShows();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
    console.log(` Server is running successfully on port: ${port}`);
    await initializeAdminUserId();
});
