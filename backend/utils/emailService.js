const nodemailer = require('nodemailer');

const sendInquiryEmail = async (inquiryData, propertyTitle = 'General Inquiry') => {
    try {
        const { name, email, phone, message } = inquiryData;

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Aadinath Builders Website" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Inquiry: ${propertyTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px;">New Customer Inquiry</h2>
                    <p><strong>Property/Type:</strong> ${propertyTitle}</p>
                    <p><strong>Customer Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #1e3a8a; margin-top: 20px;">
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        This inquiry was submitted via the Aadinath Builders website contact form.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email service error:', error);
        // We don't throw here to avoid failing the inquiry save if email fails
        return null;
    }
};

module.exports = { sendInquiryEmail };
