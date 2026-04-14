
import nodemailer from 'nodemailer';
import EnvVars from './EnvVars';

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure : false,
    auth: {
        user: EnvVars.NODEMAILER_USER,
        pass: EnvVars.NODEMAILER_PASS,
    },
});


transporter.verify((error, success) => {
    if (error) {
        console.log("Email not ready to send Mail")
    } else {
        console.log("Nodemailer ready to send email")
    }
})

const sendEmail = async (to: string, subject: string, body: string) => {
    await transporter.sendMail({
        from: `Your Expansio. ${EnvVars.NODEMAILER_USER}`,
        to,
        subject,
        html: body
    })
}


export const sendVerificationToEmail = async (to: string, token: string) => {
    let verificationUrl = `${EnvVars.FRONTEND_URL}/verify-email/${token}`

    let html =
        `
        <a 
          href="${verificationUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        `

    await sendEmail(to, "Please Verify Your Email Address", html)
}


export const sendResetPassToEmail = async (to: string, token: string) => {
    let resetUrl = `${EnvVars.FRONTEND_URL}/reset-password/${token}`

    let html =
        `
        <a 
          href="${resetUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Reset Password
        </a>
        `

    await sendEmail(to, "Please Reset Your Email Password", html)
}