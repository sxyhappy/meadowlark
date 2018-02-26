let nodemailer = require('nodemailer');
let credentials = require('./credentials');

let mailTransport = nodemailer.createTransport({
  host: 'smtp.sina.com',
  secure: true,
  auth: {
    user: credentials.email.user,
    pass: credentials.email.password
  }
});

mailTransport.sendMail({
  from: '"sxy" <sxyhappiness@sina.com>',
  to: 'sxyhappiness@sina.com, sxy@sxyblog.com, 993763501@qq.com',
  subject: 'nodemailer test',
  text: 'hello nodemailer'
}, (error, info) => {
  if (error) console.log(error);
  console.log(info)
});
