import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send a WhatsApp message
function send_notification(message) {
    client.messages
        .create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: process.env.TWILIO_TARGET_NUMBER
        })
        .then((message) => {
            console.log('WhatsApp message sent: ', message.sid);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

export {send_notification}