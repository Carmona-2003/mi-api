import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendRecoveryEmail = async (to, token) => {
  const link = `${process.env.FRONT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: "JireSoft <no-reply@jiresoft.com>",
    to,
    subject: "Recuperar contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace expira en 15 minutos.</p>
    `,
  });
};
