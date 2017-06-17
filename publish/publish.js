var notify = require('./notify')
var mapper = require('./mapper')

mapper.toCSV((csv) => {
    let mailOptions = {
        from: 'vitor_btf@hotmail.com', // sender address
        to: 'vitor.tfreitas@gmail.com', // list of receivers
        subject: `Flight Report - ${new Date().toISOString()}`, // Subject line
        text: 'Flight Report',
        attachments: {
            filename: "report.html",
            content: mapper.toHtml(csv)
        }
    };

    notify.send(mailOptions)
})
