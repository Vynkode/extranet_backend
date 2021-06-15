const { JWT } = require('google-auth-library');

async function initServiceClient() {
  return new JWT({
    email: 'extranetemail@extranet-296817.iam.gserviceaccount.com',
    key: process.env.PRIVATE_KEY_GOOGLE.replace(/\\n/g, '\n'),
    scopes: ['https://mail.google.com/'],
    subject: 'info@mgvwatch.com',
  });
}

async function sendRawEmail(emailBody) {
  const client = await initServiceClient();

  // see https://github.com/googleapis/gaxios
  const options = {
    method: 'POST',
    url: `https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send`,
    headers: {
      'Content-Type': 'message/rfc822',
    },
    body: emailBody,
  };
  return await client.request(options);
}

const field = (f, v) => (v ? f + ': ' + v + '\r\n' : '');

module.exports.sendEmail = async function ({
  to = 'info@mgvwatch.com',
  cc = undefined,
  bcc = undefined,
  subject = '',
  message = '',
} = {}) {
  if (!to) {
    throw new Error('"To" field is required');
  }

  const email = `${field('Subject', subject)}${field('To', to)}${field(
    'cc',
    cc
  )}${field('bcc', bcc)}\r\n${message}`;
  return sendRawEmail(email);
};
