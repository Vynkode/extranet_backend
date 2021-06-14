// const nodemailer = require('nodemailer');
//
// const key = require('./key.json');
//
// // const email = 'extranetemail@extranet-296817.iam.gserviceaccount.com ';
// const email = 'kevin.munoz@mgvwatch.com';
//
// async function start() {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       type: 'OAuth2',
//       user: email,
//       clientId: key.client_id,
//       clientSecret: key.private_key,
//     },
//   });
//   console.log(transporter);
//   try {
//     await transporter.verify();
//     await transporter.sendMail({
//       from: email,
//       to: 'kevinmuqu@gmail.com',
//       subject: 'Pruebas emails extranet',
//       text: 'Estamos probando el envio de emails',
//     });
//   } catch (e) {
//     console.error(e);
//   }
// }
//
// start();
// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');
//
// const SCOPES = ['https://mail.google.com/'];
//
// const TOKEN_PATH = 'token.json';
//
// fs.readFile('key2.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   authorize(JSON.parse(content), listLabels);
// });
//
// function authorize(credentials, callback) {
//   // const { client_secret, client_id } = credentials;
//   // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
//   const auth = new google.auth.GoogleAuth({
//     keyFile: credentials,
//     scopes: SCOPES,
//   });
//
//   console.log(auth);

// Check if we have previously stored a token.
// fs.readFile(TOKEN_PATH, (err, token) => {
//   if (err) return getNewToken(oAuth2Client, callback);
//   oAuth2Client.setCredentials(JSON.parse(token));
//   callback(oAuth2Client);
// });
// }
//
// function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'online',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', code => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }
//
// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listLabels(auth) {
//   const gmail = google.gmail({ version: 'v1', auth });
//   gmail.users.labels.list(
//     {
//       userId: 'me',
//     },
//     (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const labels = res.data.labels;
//       if (labels.length) {
//         console.log('Labels:');
//         labels.forEach(label => {
//           console.log(`- ${label.name}`);
//         });
//       } else {
//         console.log('No labels found.');
//       }
//     }
//   );
// }

// const { JWT } = require('google-auth-library');
//THE PATH TO YOUR SERVICE ACCOUNT CRENDETIALS JSON FILE
const keys = require('./key2.json');

// async function main() {
//   const client = new JWT({
//     email: keys.client_email,
//     key: keys.private_key,
//     scopes: ['https://mail.google.com/'],
//     subject: 'kevinmuqu@gmail.com',
//   });
//   const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
//   const res = await client.request({ url });
//   console.log(res.data);
// }
//
// main().catch(console.error);

// const { GoogleAuth } = require('google-auth-library');
//
// async function main() {
//   const auth = new GoogleAuth({
//     keyFile: './key2.json',
//     scopes: 'https://www.googleapis.com/auth/gmail.send',
//   });
//   // console.log(auth);
//   const client = await auth.getClient();
//   console.log(client);
//   const url = `https://dns.googleapis.com/dns/v1/projects/extranet-296817`;
//   const res = await client.request({ url });
//   console.log(res.data);
// }
//
// main().catch(console.error);

const { JWT } = require('google-auth-library');

async function initServiceClient() {
  return new JWT({
    email: 'extranetemail@extranet-296817.iam.gserviceaccount.com',
    key: keys.private_key.replace(/\\n/g, '\n'),
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
  to = 'kevinmuqu@gmail.com',
  cc = undefined,
  bcc = undefined,
  subject = 'Prueba email',
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
