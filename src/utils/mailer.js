import crypto from "crypto";
import { transporter } from "../utils/mailer.js";

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  await transporter.sendMail({
    from: `"Soporte" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Restablecer contraseña",
    html: `
      <p>Haz clic para restablecer tu contraseña:</p>
      <a href="http://localhost:5173/reset-password?token=${token}">
        Restablecer contraseña
      </a>
    `,
  });

  res.json({ ok: true, message: "Correo enviado (Mailtrap Sandbox)" });
});
