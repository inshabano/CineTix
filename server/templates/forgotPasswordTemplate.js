module.exports = (resetUrl) => {
        return `
        <!DOCTYPE html>
       <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Reset Request - CineTix</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                    width: 100% !important;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    border: 1px solid #e0e0e0;
                }
                .header {
                    background-color: #ef424a; /* Your brand red */
                    padding: 25px;
                    text-align: center;
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                    font-size: 16px;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .button {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #007bff; /* A nice blue for CTA */
                    color: #ffffff !important; /* !important to override client styles */
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    border: none;
                    cursor: pointer;
                    -webkit-transition: all 0.3s ease;
                    -moz-transition: all 0.3s ease;
                    -ms-transition: all 0.3s ease;
                    -o-transition: all 0.3s ease;
                    transition: all 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                }
                .footer {
                    padding: 20px 30px;
                    text-align: center;
                    font-size: 14px;
                    color: #777777;
                    border-top: 1px solid #e0e0e0;
                    margin-top: 20px;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .warning {
                    color: #dc3545; /* Bootstrap danger red */
                    font-size: 14px;
                    margin-top: 20px;
                    border-top: 1px dashed #e0e0e0;
                    padding-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    CineTix Password Reset
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>You are receiving this email because we received a password reset request for your account.</p>
                    <p>Please click on the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
                    
                    <div class="button-container">
                        <a href="${resetUrl}" class="button">Reset Your Password</a>
                    </div>

                    <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>

                    <div class="warning">
                        <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 1 hour.</p>
                    </div>
                    <p>Thank you,<br>The CineTix Team</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} CineTix. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        `;
    };

