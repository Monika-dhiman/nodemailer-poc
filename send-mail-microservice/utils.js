 import nodemailer from 'nodemailer';

export const sendMail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'monikadhiman2205@gmail.com',
            pass: 'kgfpvcatjqrghlph'
        },
    });
    const mailOptions = {
        from: 'monikadhiman2205@gmail.com',
        to: email,
        subject: "Happy birthday dear 🎂🎂",
        text: "Happy birthday dear 🎂🎂"
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.log(error);
    }
};