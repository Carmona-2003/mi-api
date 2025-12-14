const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "resend",
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// Verificación (muy importante para logs)
transporter.verify((error) => {
  if (error) {
    console.error("❌ Error en mailer:", error.message);
  } else {
    console.log("📧 Mailer configurado correctamente con Resend");
  }
});

module.exports = transporter;
