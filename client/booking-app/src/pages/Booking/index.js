import {useParams} from "react-router-dom";
import {useEffect, useState, useCallback} from "react";
import { getShowDetails } from "../../services/shows";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import styles from './booking.module.css';
import { Card, Row, Col, Button} from 'antd';


function Booking(){
    const params = useParams();
    const showId = params.showId;
    const [showDetails, setShowDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInitialLoader, setShowInitialLoader] = useState(true);

    const [seatsLayout, setSeatsLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

     const generateSeatsLayout = (totalSeats, bookedSeatsList = []) => {
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
    };


    const fetchShowData = useCallback(async ()=>{
        setLoading(true);
        setError(null);
        try{
            const showResponse = await getShowDetails(showId);
            if(showResponse.success){
                setShowDetails(showResponse.data);
                const initialSeats = generateSeatsLayout(showResponse.data.totalSeats || 150);
                setSeatsLayout(initialSeats);
            } else {
                setError(showResponse.message || "Failed to fetch show details.");
            }

        }catch(err){
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
    },[showId]);

    useEffect(()=>{
        fetchShowData();
    },[showId, fetchShowData]);

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


    if (showInitialLoader) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loaderText}>Loading...</p>
            </div>
        );
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
                                        }) : 'N/A'}  ,{showDetails.showTime}
                                    </p>
                                    </div>
                                
                                } className={styles.cardContainer}
                                extra = {
                                    <div className={styles.showdetails}>
                                        <p> Ticket Price: Rs {showDetails.ticketPrice}/-</p>
                                        <p>Total seats: {showDetails.totalSeats}</p>
                                        <p>Available seats: {showDetails.totalSeats - showDetails.bookedSeats}</p>
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
                                    <Button type="primary" size="large" className={styles.bookTicketsButton} disabled={selectedSeats.length === 0}>
                                        Proceed to Pay
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