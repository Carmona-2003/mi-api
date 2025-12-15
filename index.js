require("dotenv").config(); 
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "OK" : "MISSING");
console.log("BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL || "MISSING");
console.log("BREVO_SENDER_NAME:", process.env.BREVO_SENDER_NAME || "MISSING");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 API running on port", PORT);
});
