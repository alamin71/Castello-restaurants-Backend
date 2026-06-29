import twilio from 'twilio';
import config from '../config';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

const sendSms = async (to: string, body: string): Promise<void> => {
  await client.messages.create({
    body,
    from: config.twilio.phoneNumber,
    to,
  });
};

export const twilioHelper = { sendSms };
