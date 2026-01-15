const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInquiryEmail = async (inquiryData, propertyTitle = 'General Inquiry') => {
    try {
        const { name, email, phone, message } = inquiryData;

        // On Resend's free tier, you can only send TO the email you signed up with
        // Unless you verify a domain.
        const adminEmail = process.env.ADMIN_EMAIL || 'infoaadinathbuilders@gmail.com';

        const { data, error } = await resend.emails.send({
            from: 'Aadinath Builders <onboarding@resend.dev>', // Resend default for unverified domains
            to: adminEmail,
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
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return null;
        }

        console.log('Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('Email service error:', error);
        return null;
    }
};

module.exports = { sendInquiryEmail };
