require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { MailtrapClient } = require("mailtrap");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const client = new MailtrapClient({ token: process.env.MAILTRAP });

const sender = {
  email: "hello@demomailtrap.co",
  name: "Anfield Enquiry"
};

function clean(value = "") {
  return String(value).trim();
}

function escapeHtml(value = "") {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEnquiry(req, res) {
  console.log("--- Request received ---");
  console.log("Body:", JSON.stringify(req.body));

  try {
    
    if (!process.env.MAILTRAP) {
      console.log("FAILED: No API key");
      return res.status(500).json({ success: false, message: "Email service not configured" });
    }

    const name = clean(req.body.name);
    const number = clean(req.body.number);
    const email = clean(req.body.email);
    const enquiry = clean(req.body.enquiry);
    const message = clean(req.body.message);

 

    if (!name || !number || !enquiry) {
      console.log("FAILED: Missing fields");
      return res.status(400).json({ success: false, message: "Please provide name, phone number, and enquiry type" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("FAILED: Invalid email");
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

  

    const result = await client.send({
      from: sender,
      to: [{ email: "amal.nath@woxro.com" }],
      subject: `New Anfield Enquiry - ${enquiry}`,
      html: `
        <h2>New Anfield Contact Form Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(number)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>Enquiry Type:</strong> ${escapeHtml(enquiry)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || "No message provided").replace(/\n/g, "<br>")}</p>
      `,
      text: `New Anfield Enquiry\nName: ${name}\nPhone: ${number}\nEmail: ${email || "Not provided"}\nEnquiry: ${enquiry}\nMessage: ${message || "No message provided"}`,
      category: "Enquiry"
    });

   

    return res.json({ success: true, message: "Thank you. Your enquiry has been sent." });

  } catch (err) {
    const errorMsg = err?.message || String(err);
    console.error("CATCH BLOCK - Mailtrap email failed:", errorMsg);
    fs.appendFileSync(
      path.join(__dirname, "error.log"),
      new Date().toISOString() + " | " + errorMsg + "\n"
    );
    return res.status(500).json({ success: false, message: errorMsg });
  }
}

app.post("/send", sendEnquiry);
app.post("/api/send", sendEnquiry);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log("Mailtrap token loaded:", !!process.env.MAILTRAP);
});