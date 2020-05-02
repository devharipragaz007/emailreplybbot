const express = require("express");
const app = express();
var http = require('http');
var session = require('express-session');
const bodyParser = require("body-parser");
var cors = require('cors'); 
const path = require("path");
const _ = require("underscore");
const port = process.env.PORT || "5000";
var nodemailer = require('nodemailer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors());
app.use(session({
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));


async function main(email, msg, req) {

  var user = req.query.email;
  var password = req.query.password;
  var host = req.query.outgoing_host;
  var port = req.query.outgoing_port;

  let transporter = nodemailer.createTransport({
    host: host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: user, // generated ethereal user
      pass: password // generated ethereal password
    }
  });
  // console.log(email.from)
  let info = await transporter.sendMail({
    from: '<' + user + '>', // sender address
    to: email.from, // list of receivers
    subject: 'RE: ' + email.subject, // Subject line
    // bcc:'<testing@hindujaleylandfinance.com>',
    inReplyTo: email.msgId,
    // text: "Hello world?", // plain text body
    html: msg // html body
  });
  console.log("Message sent: %s", info.messageId);

}



app.get("/replyall", (req, res) => {
  var mailCount = req.query.count ? req.query.count : 9999999;

  var reply = req.query.msg;
  var timeset = req.query.interval ? req.query.interval : 5000;
  var from = req.query.fromDate ? req.query.fromDate : '1900-01-01';
  var to = req.query.toDate ? req.query.toDate : '3000-12-31';

  var c = 0;
  var result = {
    header: [],
    attrs: [],
  };
  var Imap = require('imap'),
    inspect = require('util').inspect;

  var imap = new Imap({
    user: req.query.email,
    password: req.query.password,
    host: req.query.host,
    port: req.query.port,
    tls: true,
    secure: true,
    // debug : console.log,
    authTimeout : 50000,
    tlsOptions: {
      rejectUnauthorized: false
    }
  });
  // console.log(imap)
  function openInbox(cb) {
    imap.openBox('INBOX', false, cb);

  }

  imap.once('ready', function () {
    openInbox(function (err, box) {
      if (err) throw err;
      //  imap.sort(['-ARRIVAL'], ["UNSEEN", ['SINCE', from],
      //     ['BEFORE', to]
      //   ]
      imap.search(['UNSEEN', ['SINCE', from],
        ['BEFORE', to]
      ], function (err, results) {
        if (err) {
          console.log(err)
          
            return res.code(500).send({
              message: err
          });
          // res.set("Connection", "close");
          // res.end();
          // return res;
        } else {
          if (results.length === 0) {
            imap.end();
            // ree().send("All Mails were read");
            code : 200,
            // res.end();
            console.log(results.length);
            res.json({
              code : 200,
              status: 'success',
              message: "All Mails were read"
            });
          } else {
            c = results.length;
            var f = imap.fetch(results, {
              bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)',
            });
            // console.log(results)

            f.on('message', function (msg, seqno) {
              var prefix = '(#' + seqno + ') ';
              msg.on('body', function (stream, info) {
                var buffer = '';
                stream.on('data', function (chunk) {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', function () {
                  result.header[seqno] = buffer;
                });
              });
              msg.once('attributes', function (attrs) {
                result.attrs[seqno] = attrs;
              });
              msg.once('end', function () {

                var emails = [];

                function extractEmails(result) {
                  var t = [];
                  result.header.forEach(function (head, key) {
                    var msgId = head.split('\r\n')[2].match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
                    var subject = head.split('\r\n')[3].split(':')[1]
                    t.push({
                      from: head.split('\r\n')[0],
                      subject: subject,
                      msgId: msgId,
                      uid: result.attrs[key].uid,
                    })
                  })
                  return t;
                }

                emails = extractEmails(result)

                // console.log(emails.length);

                if (c > 0 && c === emails.length) {
                  var newEmails = [];
                  if (mailCount > emails.length) {
                    emails.forEach(function (email) {
                      setTimeout(function () {
                        console.log(email, reply)
                        main(email, reply, req).catch(console.error);
                      }, timeset);
                    })
                  } else {
                    for (i = 0; i < mailCount; i++) {
                      setTimeout(function () {
                        main(emails[i], reply, req).catch(console.error);
                        sentMail.push(email.uid)
                        console.log(sentMail)
                      }, timeset);
                    }
                  }
                  var k = 0;
                  emails.forEach(function (email) {
                    var t = imap.setFlags(email.uid, ["Seen"], function (err, res) {
                      if (!err) {
                        k++;
                        console.log("marked as read", k);
                      } else {
                        console.log(err);
                      }
                    })
                  })

                }

              })
            });

            f.once('error', function (err) {
              console.log('Fetch error: ' + err);
            });

            f.once('end', function () {

              result.header.forEach(function (head) {
                var mapObj = {
                  From: "To",
                  To: "From",
                  '<br>': '\r\n'
                };
                head += reply;
                head = head.replace(/From|To|<br>/gi, function (matched) {
                  return mapObj[matched];
                });
                // imap.append("Sent",head)
                imap.append(head, {
                  mailbox: 'Sent',
                  flags: ['\\Seen']
                }, function (err) {
                  if (err) {
                    err;
                  } else {
                    imap.end();
                  }
                });
              })

              var returnText = req.query.fromDate && req.query.toDate ? "All mails were replied from " + from + " to " + to : (req.query.fromDate ? "All mails were replied from " + from : req.query.toDate ? "All mails were replied till " + to : 'All mails were replied');
              res.send({
                code : 200,
                message : returnText,
                status : 'success'
              });
            });
          }
        }
      });
    });

  });

  imap.once('error', function (err) {
    console.log('243',err);
    return res.send({
      code : 500,
      message : "Invalid Credentials",
      status : 'error'
    });
  });

  imap.once('end', function () {
    console.log('Connection ended');
  });

  imap.connect();

});

app.get('/test', (req,res) => {
  console.log('hari')
  return ree().send({
    code : 200,
    message: 'This is an error!',
    status : 'success'
 });
})
// console.log(process.env.PORT);
// if(process.env.NODE_ENV === 'production')
// {
//   app.use(express.static('react/build'))
// }

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});