let nodemailer = require('nodemailer');

module.exports = (credentials) => {
  let mailTransport = nodemailer.createTransport({
    host: 'smtp.sina.com',
    secure: true,
    auth: {
      user: credentials.email.user,
      pass: credentials.email.password
    }
  });

  const from = '<sxy@test.com>';
  const errorRecipient = '<sxy@develop.test.com>';

  return {
    send(to, subject, body) {
      mailTransport.sendMail({
        from,
        to,
        subject,
        html: body,
      }, (error) => {
        if (error) console.error(error)
      })
    },

    emailError(message, filename, exception) {
      let body = `<h1>Meadowlark Travel Site Error</h1>message:<br><pre>${message}</pre><br>`;
      if (exception) body += `exception:<br><pre>${exception}</pre><br>`;
      if (filename) body += `filename:<br><pre>${filename}</pre><br>`;

      mailTransport.sendMail({
        from,
        to: errorRecipient,
        subject: 'Error Message',
        html: body,
      }, (error) => {
        if (error) console.error(error)
      })
    }
  }
};
