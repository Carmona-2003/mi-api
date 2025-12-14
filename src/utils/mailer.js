const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Solo para debug (no rompe nada en producción)
transporter.verify((error) => {
  if (error) {
    console.error("❌ Error en mailer:", error.message);
  } else {
    console.log("📧 Mailer configurado correctamente");
  }
});

module.exports = transporter;
