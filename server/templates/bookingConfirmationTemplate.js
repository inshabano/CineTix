module.exports = (showDetails, bookingDetails) => {
    // Ensure showDetails.movie and showDetails.theatre are populated
    const movieName = showDetails.movie.movieName;
    const movieLanguage = showDetails.movie.language;
    const theatreName = showDetails.theatre.name;
    const theatreAddress = showDetails.theatre.address;

    // Subject of the email
    const subject = `Booking Confirmed for ${movieName} (${movieLanguage}) - ${bookingDetails.seats.length} Tickets`;

    const body = () => {
        return `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-top: 5px solid #ef424a; /* Accent color */
                }
                .header {
                    text-align: center;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: #ef424a;
                    margin: 0;
                    font-size: 28px;
                }
                .content p {
                    margin-bottom: 10px;
                }
                .details-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .details-table th, .details-table td {
                    border: 1px solid #eee;
                    padding: 10px;
                    text-align: left;
                }
                .details-table th {
                    background-color: #f9f9f9;
                    font-weight: bold;
                    width: 35%; /* Adjust column width */
                }
                .details-table td {
                    width: 65%;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #777;
                    font-size: 0.9em;
                }
                .highlight {
                    color: #ef424a;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Booking Confirmed!</h1>
                    <p>Thank you for choosing us for your movie experience.</p>
                </div>
                <div class="content">
                    <p>Dear Customer,</p>
                    <p>Your booking for <span class="highlight">${movieName}</span> has been successfully confirmed!</p>
                    
                    <table class="details-table">
                        <tr>
                            <th>Booking ID:</th>
                            <td><span class="highlight">${bookingDetails._id || 'N/A'}</span></td>
                        </tr>
                        <tr>
                            <th>Transaction ID:</th>
                            <td>${bookingDetails.transactionId || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Movie:</th>
                            <td>${movieName} (${movieLanguage})</td>
                        </tr>
                        <tr>
                            <th>Theatre:</th>
                            <td>${theatreName}</td>
                        </tr>
                        <tr>
                            <th>Address:</th>
                            <td>${theatreAddress}</td>
                        </tr>
                        <tr>
                            <th>Date:</th>
                            <td>${showDetails.showDate ? new Date(showDetails.showDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'N/A'}</td>
                            </tr>
                        <tr>
                            <th>Time:</th>
                            <td>${showDetails.showTime || 'N/A'}</td>
                            </tr>
                        <tr>
                            <th>Seats Booked:</th>
                            <td><span class="highlight">${bookingDetails.seats.join(', ') || 'N/A'}</span></td>
                        </tr>
                        <tr>
                            <th>Total Amount:</th>
                            <td>₹${(bookingDetails.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                    </table>

                    <p style="margin-top: 20px;">Please arrive at the theatre at least 15 minutes before the showtime. You can show your Booking ID and photo ID at the counter.</p>
                    <p>Enjoy the movie!</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                    <p>&copy; ${new Date().getFullYear()} BookMyShow Clone. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    };

    return { subject, body };
};