import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getShowDetails } from "../../services/shows";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../services/payment";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import styles from './booking.module.css';
import { Card, Row, Col, Button, message, Spin } from 'antd';
import Loader from '../../components/Loader';

const RAZORPAY_KEY_ID = 'rzp_test_nmWcpPrF78hHbO';

function Booking() {
    const params = useParams();
    const showId = params.showId;
    const [showDetails, setShowDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInitialLoader, setShowInitialLoader] = useState(true);

    const [seatsLayout, setSeatsLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const generateSeatsLayout = useCallback((totalSeats, bookedSeatsList = []) => {
        const fixedColsPerRow = 15;
        const numRows = Math.ceil(totalSeats / fixedColsPerRow);
        const newLayout = [];
        let seatCount = 0;

        for (let r = 0; r < numRows; r++) {
            const rowSeats = [];
            for (let c = 0; c < fixedColsPerRow; c++) {
                if (seatCount < totalSeats) {
                    const seatIdentifier = `${String.fromCharCode(65 + r)}${c + 1}`;
                    const isSeatBooked = bookedSeatsList.includes(seatIdentifier);
                    rowSeats.push({
                        id: seatIdentifier,
                        row: String.fromCharCode(65 + r),
                        column: c + 1,
                        status: isSeatBooked ? 'booked' : 'available'
                    });
                    seatCount++;
                } else {
                    break;
                }
            }
            newLayout.push(rowSeats);
        }
        return newLayout;
    }, []);

    const fetchShowData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const showResponse = await getShowDetails(showId);
            if (showResponse.success) {
                setShowDetails(showResponse.data);
                const initialSeats = generateSeatsLayout(showResponse.data.totalSeats || 150, showResponse.data.bookedSeats || []);
                setSeatsLayout(initialSeats);
            } else {
                setError(showResponse.message || "Failed to fetch show details.");
            }

        } catch (err) {
            console.error("Error fetching show details:", err);
            setError("An unexpected error occurred while fetching show details.");
        } finally {
            const minLoaderTime = 500;
            const startTime = Date.now();

            setLoading(false);

            const elapsedTime = Date.now() - startTime;
            const remainingTime = minLoaderTime - elapsedTime;

            if (remainingTime > 0) {
                setTimeout(() => {
                    setShowInitialLoader(false);
                }, remainingTime);
            } else {
                setShowInitialLoader(false);
            }
        }
    }, [showId, generateSeatsLayout]);

    useEffect(() => {
        fetchShowData();
    }, [showId, fetchShowData]);

    const handleSeatSelection = (seat) => {
        if (seat.status === 'booked') {
            return;
        }

        const isCurrentlySelected = selectedSeats.some(s => s.id === seat.id);

        if (isCurrentlySelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const calculateTotalAmount = () => {
        const currentTicketPrice = showDetails ? showDetails.ticketPrice : 0;
        return selectedSeats.length * currentTicketPrice;
    };

    const handleProceedToPay = async () => {
        if (selectedSeats.length === 0) {
            message.warning('Please select at least one seat.');
            return;
        }

        if (!showDetails) {
            message.error('Show details not loaded. Please try again.');
            return;
        }

        setIsProcessingPayment(true);
        message.loading({ content: 'Initiating payment...', key: 'payment_init' });

        const seatIdsToBook = selectedSeats.map(seat => seat.id);

        try {
            const orderResponse = await createRazorpayOrder(showDetails._id, seatIdsToBook);
            
            if (!orderResponse.success) {
                message.error({ content: orderResponse.message || 'Failed to create payment order.', key: 'payment_init', duration: 3 });
                throw new Error(orderResponse.message || 'Failed to create order');
            }

            const { orderId, amount, currency, bookingId } = orderResponse.data;

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: 'MovieBooking',
                description: `Tickets for ${showDetails.movie.movieName}`,
                order_id: orderId,
                handler: async function (response) {
                    message.loading({ content: 'Verifying payment...', key: 'payment_verify' });

                    const verifyData = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId: bookingId
                    });

                    if (verifyData.success) {
                        message.success({ content: 'Payment successful! Booking confirmed.', key: 'payment_verify', duration: 3 });
                        setTimeout(() => {
                            window.location.href = `/booking-success/${bookingId}`;
                        }, 1000);
                    } else {
                        message.error({ content: verifyData.message || 'Payment verification failed.', key: 'payment_verify', duration: 5 });
                        console.error('Verification failed:', verifyData);
                    }
                },
                theme: {
                    color: '#ef424a'
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                message.error({ content: `Payment Failed: ${response.error.description}`, key: 'payment_init', duration: 5 });
                console.error('Payment failed:', response.error);
            });

            rzp.open();

        } catch (error) {
            console.error('Error during payment process:', error);
            message.error({ content: 'An unexpected error occurred. Please try again.', key: 'payment_init', duration: 5 });
        } finally {
            setIsProcessingPayment(false);
            message.destroy('payment_init');
            message.destroy('payment_verify');
        }
    };

    if (showInitialLoader) {
        return <Loader />;
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="ms-3 pt-3">
                    <h2>Error: {error}</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div>
            <Navbar />
            {
                !showDetails && !loading ? (
                    <div className="ms-3 pt-3">
                        <h2>No show details found or loaded.</h2>
                    </div>
                ) : null
            }

            {
                showDetails && (
                    <div className={styles.bookingContainer} >
                        <Row>
                            <Col>
                                <Card
                                    title={
                                        <div>
                                            <h1>{showDetails.movie.movieName} <span>({showDetails.movie.language})</span></h1>
                                            <p>{showDetails.theatre.name} </p>
                                            <p>{showDetails.theatre.address}</p>
                                            <p>
                                                {showDetails.showDate ? new Date(showDetails.showDate).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : 'N/A'} ,{showDetails.showTime}
                                            </p>
                                        </div>

                                    } className={styles.cardContainer}
                                    extra={
                                        <div className={styles.showdetails}>
                                            <p> Ticket Price: ₹ {showDetails.ticketPrice}/-</p>
                                            <p>Total seats: {showDetails.totalSeats}</p>
                                            <p>Available seats: {showDetails.totalSeats - (showDetails.bookedSeats ? showDetails.bookedSeats.length : 0)}</p>
                                        </div>
                                    } >
                                    <div className={styles.screenDisplayArea}>
                                        <div className={styles.movieScreenVisual}>SCREEN</div>
                                    </div>

                                    <div className={styles.seatsGridWrapper}>
                                        {seatsLayout.map((seatRow, rowIndex) => (
                                            <div key={rowIndex} className={styles.seatRowContainer}>
                                                <div className={styles.rowLabelText}>{seatRow[0].row}</div>
                                                {seatRow.map(seat => {
                                                    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
                                                    return (
                                                        <div
                                                            key={seat.id}
                                                            className={`${styles.seatUnit} ${styles[seat.status]} ${isSeatSelected ? styles.selectedSeat : ''}`}
                                                            onClick={() => handleSeatSelection(seat)}
                                                        >
                                                            {seat.column}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.seatStatusLegend}>
                                        <div className={styles.legendItemEntry}><span className={`${styles.seatUnit} ${styles.available}`}></span> Available</div>
                                        <div className={styles.legendItemEntry}><span className={`${styles.seatUnit} ${styles.selectedSeat}`}></span> Selected</div>
                                        <div className={styles.legendItemEntry}><span className={`${styles.seatUnit} ${styles.booked}`}></span> Booked</div>
                                    </div>

                                </Card>
                            </Col>
                            <Col>
                                <Card title="Booking Summary" bordered={false} className={styles.bookingdetails}>
                                    <p><strong>Selected Seats ({selectedSeats.length}):</strong></p>
                                    <div className={styles.chosenSeatsList}>
                                        {selectedSeats.length > 0 ? (
                                            selectedSeats.map(seat => (
                                                <span key={seat.id} className={styles.selectedSeatBadge}>
                                                    {seat.id}
                                                </span>
                                            ))
                                        ) : (
                                            <p>No seats selected.</p>
                                        )}
                                    </div>
                                    <h3>Total Price: ₹{calculateTotalAmount()}</h3>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className={styles.bookTicketsButton}
                                        disabled={selectedSeats.length === 0 || isProcessingPayment}
                                        onClick={handleProceedToPay}
                                    >
                                        {isProcessingPayment ? <Spin size="small" /> : 'Proceed to Pay'}
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
            }
            <Footer />
        </div>
    );
}

export default Booking;