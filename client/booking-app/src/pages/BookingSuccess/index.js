import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Row, Col } from 'antd';
import Loader from '../../components/Loader';
import { getBookingDetailsById } from '../../services/booking'; 
import './bookingSuccess.css'; 

function BookingSuccessPage() {
    const { bookingId } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    const getUsername = useCallback(() => {
        return localStorage.getItem('username') || 'Customer';
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setUsername(getUsername()); 

            if (!bookingId) {
                setError("Booking ID not found in URL.");
                setLoading(false);
                return;
            }

            try {
                const response = await getBookingDetailsById(bookingId);
                if (response.success) {
                    setBookingDetails(response.data);
                } else {
                    setError(response.message || "Failed to fetch booking details.");
                }
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError("An unexpected error occurred while fetching booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [bookingId, getUsername]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <>
                <div className="booking-success-container">
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                    />
                </div>
            </>
        );
    }

    if (!bookingDetails) {
        return (
            <>
                <div className="booking-success-container">
                    <Alert
                        message="Booking Not Found"
                        description="The booking details could not be loaded. Please check the ID."
                        type="warning"
                        showIcon
                    />
                </div>
            </>
        );
    }

    
    const showDate = bookingDetails.show?.showDate ? new Date(bookingDetails.show.showDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : 'N/A';
    const showTime = bookingDetails.show?.showTime || 'N/A';

    return (
        <div>
            <div className="booking-success-container">
                <Card
                    title={<h1 className="success-header">🎉 Booking Confirmed!</h1>}
                    bordered={false}
                    className="booking-success-card"
                >
                    <p className="welcome-message">Hello, <span className="highlight-username">{username}</span>!</p>
                    <p className="confirmation-message">Your booking has been successfully confirmed. Details are below:</p>

                    <Row gutter={[16, 16]} className="details-row">
                        <Col xs={24} md={12}>
                            <p><strong>Booking ID:</strong> <span className="highlight">{bookingDetails._id}</span></p>
                            <p><strong>Transaction ID:</strong> {bookingDetails.transactionId || 'N/A'}</p>
                            <p><strong>Movie:</strong> {bookingDetails.show?.movie?.movieName || 'N/A'} ({bookingDetails.show?.movie?.language || 'N/A'})</p>
                            <p><strong>Theatre:</strong> {bookingDetails.show?.theatre?.name || 'N/A'}</p>
                        </Col>
                        <Col xs={24} md={12}>
                            <p><strong>Address:</strong> {bookingDetails.show?.theatre?.address || 'N/A'}</p>
                            <p><strong>Date:</strong> {showDate}</p>
                            <p><strong>Time:</strong> {showTime}</p>
                            <p><strong>Seats:</strong> <span className="highlight">{bookingDetails.seats.join(', ')}</span></p>
                            <p><strong>Total Amount:</strong> ₹{(bookingDetails.totalAmount || 0).toFixed(2)}</p>
                        </Col>
                    </Row>
                    <p className="thank-you-message">An email confirmation has been sent to your registered email address.</p>
                    <p className="enjoy-message">Enjoy the movie!</p>
                </Card>
            </div>
        </div>
    );
}

export default BookingSuccessPage;