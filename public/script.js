document.getElementById('smsForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const phone = this.phone.value.trim();
  const message = this.message.value.trim();
  const status = document.getElementById('status');
  status.innerText = 'Sending...';
  status.classList.remove('text-green-400', 'text-red-400');
  status.classList.add('text-yellow-400');

  try {
    const res = await fetch('/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    });

    const data = await res.json();

    if (data.success) {
  status.innerText = data.message;
  status.classList.remove('text-yellow-400', 'text-red-400');
  status.classList.add('text-green-400');
} else {
  status.innerText = 'Error: ' + data.error; // show Twilio error message
  status.classList.remove('text-yellow-400', 'text-green-400');
  status.classList.add('text-red-400');
}

  } catch (err) {
    console.error(err);
    status.innerText = 'Failed to send SMS. Please try again.';
    status.classList.remove('text-yellow-400', 'text-green-400');
    status.classList.add('text-red-400');
  }
});
