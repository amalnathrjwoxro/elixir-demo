const { MailtrapClient } = require("mailtrap");

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

const client = new MailtrapClient({ token: process.env.MAILTRAP });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, number, email, enquiry, message } = req.body;

  if (!name || !number || !enquiry) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address" });
  }

  try {
    await client.send({
      from: { email: "no-reply@elixirhomes.com", name: "Anfield Enquiry" },
      to: [{ email: "sales@elixirhomes.com" }],
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
    console.error("Mailtrap error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message || "Failed to send enquiry" });
  }
};