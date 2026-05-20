const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({ token: process.env.MAILTRAP });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, number, email, enquiry, message } = req.body;

  if (!name || !number || !enquiry) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  await client.send({
    from: { email: "hello@demomailtrap.co", name: "Anfield Enquiry" },
    to: [{ email: "sales@elixirhomes.com" }],
    subject: `New Anfield Enquiry - ${enquiry}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Phone:</strong> ${number}</p>
           <p><strong>Email:</strong> ${email || "Not provided"}</p>
           <p><strong>Enquiry:</strong> ${enquiry}</p>
           <p><strong>Message:</strong> ${message || "None"}</p>`,
  });

  return res.json({ success: true, message: "Enquiry sent." });
}