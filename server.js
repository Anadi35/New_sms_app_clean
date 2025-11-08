const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');
const path = require('path');

dotenv.config();

const app = express();

// ✅ Render will assign PORT automatically
const PORT = process.env.PORT || 3000;

// Load Twilio credentials from env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

if (!accountSid || !authToken || !twilioPhone) {
  console.error("❌ Missing Twilio credentials. Please set environment variables in Render.");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// ✅ API endpoint for sending SMS
app.post('/send-sms', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.json({ success: false, error: "Phone and message are required" });
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,   // Must be your Twilio number
      to: phone            // Trial accounts need verified numbers
    });

    console.log('✅ Message sent:', response.sid);
    res.json({ success: true, sid: response.sid, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('❌ Twilio Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
