import nodemailer from "nodemailer";

// Vercel serverless function - expects environment variables:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email address" });
  }

  // Read SMTP configuration from environment
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL; // where messages should be sent

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    return res.status(500).json({ success: false, error: "Server not configured. Missing SMTP settings." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: CONTACT_TO_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      text: `You received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<p>You received a new message from your portfolio contact form.</p>
             <p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
             <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Error sending contact email:", err);
    // If DEBUG_CONTACT is set, include the error message to aid debugging (do NOT enable in production)
    if (process.env.DEBUG_CONTACT === "true") {
      return res.status(500).json({ success: false, error: "Failed to send message.", details: err.message });
    }
    return res.status(500).json({ success: false, error: "Failed to send message." });
  }
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
