import transporter from "../config/mail.js";

const sendEmail = async (
    to,
    subject,
    html
) => {

    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject,
        html
    });

};

export default sendEmail;