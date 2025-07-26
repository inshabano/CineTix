import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { message } from 'antd'; 
import { getUserBookings } from '../../services/booking';
import moment from 'moment'; 

import './mybookings.css'; 

const Bookings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); 

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserBookings();
            if (response.success) {
                const fetchedBookings = response.data;
                const now = moment(); 

                const upcoming = [];
                const past = [];

                console.log("--- Debugging Bookings Categorization ---");
                console.log(`Current Time (now): ${now.format('YYYY-MM-DD HH:mm:ss Z')}`); 

                fetchedBookings.forEach(booking => {
                    
                    
                    const showDateMoment = moment(booking.show.showDate); 

                    
                    const [hours, minutes] = booking.show.showTime.split(':').map(Number);

                    
                    
                    
                    const showDateTime = showDateMoment.set({
                        hour: hours,
                        minute: minutes,
                        second: 0,
                        millisecond: 0
                    });

                    console.log(`\nBooking ID: ${booking._id}`);
                    console.log(`  Raw DB Show Date: ${booking.show.showDate}`); 
                    console.log(`  Raw DB Show Time: ${booking.show.showTime}`); 
                    console.log(`  Constructed ShowDateTime: ${showDateTime.format('YYYY-MM-DD HH:mm:ss Z')}`); 

                    if (showDateTime.isSameOrAfter(now, 'minute')) {
                        console.log("  -> Categorized as: UPCOMING");
                        upcoming.push(booking);
                    } else {
                        console.log("  -> Categorized as: PAST");
                        past.push(booking);
                    }
                });

                
                upcoming.sort((a, b) => {
                    const timeA = moment(a.show.showDate).set({
                        hour: parseInt(a.show.showTime.split(':')[0]),
                        minute: parseInt(a.show.showTime.split(':')[1])
                    });
                    const timeB = moment(b.show.showDate).set({
                        hour: parseInt(b.show.showTime.split(':')[0]),
                        minute: parseInt(b.show.showTime.split(':')[1])
                    });
                    return timeA.valueOf() - timeB.valueOf();
                });

                past.sort((a, b) => {
                    const timeA = moment(a.show.showDate).set({
                        hour: parseInt(a.show.showTime.split(':')[0]),
                        minute: parseInt(a.show.showTime.split(':')[1])
                    });
                    const timeB = moment(b.show.showDate).set({
                        hour: parseInt(b.show.showTime.split(':')[0]),
                        minute: parseInt(b.show.showTime.split(':')[1])
                    });
                    return timeB.valueOf() - timeA.valueOf(); 
                });

                setUpcomingBookings(upcoming);
                setPastBookings(past);

            } else {
                message.error(response.message || "Failed to fetch bookings.");
                setError(response.message || "Failed to fetch bookings.");
            }
        } catch (err) {
            console.error("Error fetching user bookings:", err);
            message.error("An error occurred while fetching your bookings.");
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <>
                <div className="bookings-container">
                    <div className="error-message-box">
                        <h2>Error: {error}</h2>
                        <p>Please try again later or contact support if the problem persists.</p>
                    </div>
                </div>
            </>
        );
    }

    const renderBookingCard = (booking) => (
        <div key={booking._id} className="booking-card">
            <div className="booking-card-header">
                <h3 className="movie-name">{booking.show.movie.movieName}</h3>
                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                </span>
            </div>
            <div className="booking-card-body">
                <p><strong>Date:</strong> {moment(booking.show.showDate).format('MMM DD, YYYY')}</p>
                <p><strong>Time:</strong> {booking.show.showTime}</p>
                <p><strong>Theatre:</strong> {booking.show.theatre.name}</p>
                <p><strong>Location:</strong> {booking.show.theatre.address}</p>
                <p><strong>Seats:</strong> <span className="seats-list">{booking.seats.join(', ')}</span></p>
                <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                {/* Add more details as needed */}
            </div>
            <div className="booking-card-footer">
                <span className="booking-id">Booking ID: {booking._id.substring(0, 8)}...</span>
            </div>
        </div>
    );

    return (
        <div>
            <div className="bookings-container">
                <div className="page-header">
                    <h1>My Bookings</h1>
                    <p className="page-subtitle">View your upcoming and past movie shows.</p> 
                </div>

                <div className="tabs-navigation">
                    <button
                        className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Shows ({upcomingBookings.length}) 
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Bookings ({pastBookings.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'upcoming' && (
                        upcomingBookings.length > 0 ? (
                            <div className="bookings-grid">
                                {upcomingBookings.map(renderBookingCard)}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Looks like you don't have any upcoming shows.</p> 
                                <img src="/images/no-upcoming.png" alt="No Upcoming Bookings" />
                                <button className="explore-button" onClick={() => window.location.href = '/'}>Explore Movies</button>
                            </div>
                        )
                    )}

                    {activeTab === 'past' && (
                        pastBookings.length > 0 ? (
                            <div className="bookings-grid">
                                {pastBookings.map(renderBookingCard)}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>You haven't made any bookings yet.</p>
                                <img src="/images/no-past.png" alt="No Past Bookings" />
                                <button className="explore-button" onClick={() => window.location.href = '/'}>Start Booking</button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;