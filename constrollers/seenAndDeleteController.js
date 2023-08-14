var Imap = require("node-imap");
const { parse } = require("path");

const box_name = "INBOX";
var delay = 100 * 24 * 3600 * 1000;
var search_time = new Date();
search_time.setTime(Date.now() - delay);
search_time = search_time.toISOString();

exports.deleteEmail = async(req, res) => {
    try{
        console.log(JSON.parse(JSON.stringify(req.body)));
        const{ImapEmail, imapPassword, ImapHost, ImapPort} = req.body;
    
        var imap = new Imap({
            user: ImapEmail,
            password: imapPassword,
            host:ImapHost,
            port: ImapPort,
            tls: true,
        });
    
        imap.once('ready', () => {
    
            console.log("connected");
            res.status(200).send("server connected, please check your inbox after sometime")
            imap.openBox(box_name, false, () => {
                try {
                    console.log("inbox open");
                    // const searchCriteria = [['HEADER', 'SUBJECT', 'hvmjvbjhm']];
    
                    const searchCriteria = ['SEEN', ['SINCE', search_time]];
    
                    const fetchOptions = { bodies: ['HEADER'], struct: true };
                    imap.search(searchCriteria, (err, results) => {
                        if (err || results.length === 0) {
                            imap.end();
                            return;
                        }
                        let seeResult = [];
                        var f = imap.fetch(results, fetchOptions);
                        f.on("message", async (msg, seqno) => {
    
                            // var prefix = "(#" + seqno + ") ";
                            msg.on("body", function (stream, info) {
                                // var buffer = "";
                                // var count = 0;
                                stream.on("data", function (chunk) {
                                    // count += chunk.length;
                                    // buffer += chunk.toString("utf8");
                                });
                                stream.once("end", function () {
                                    // parseBody1(buffer);
                                    // console.log("Header",buffer);
                                    msg.once("attributes", function (attrs) {
                                        let uid = attrs.uid;
    
                                        imap.addFlags(uid, ["\\Deleted"], async function (err) {
                                            console.log("thanks");
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log("deleted");
                                            }
                                        });
                                    });
                                });
                            });
                            msg.once("end", function () {
                                // console.log(prefix + "Finished");
                            });
                        });
                        f.once("error", function (err) {
                            console.log("Fetch error: " + err);
                        });
                        f.once("end", function () {
                            imap.end();
                        });
                    });
    
                } catch (error) {
                    console.log("error in search the spam message", error);
                }
            });
        });
    
        imap.once('error', (err) => {
            console.error('IMAP error:', err);
            res.status(201).send({msg:"Server not connected", err:err})
    
        });
    
        imap.once('end', () => {
            console.log('IMAP connection closed');
            // read_hidden_mail('Junk');
        });
    
        imap.connect();  
    }catch(err){
        res.status(201).send({msg:"Something went wrong!", err:err})
    }
}

exports.readEmail = async(req, res) => {
    try{
        console.log(JSON.parse(JSON.stringify(req.body)));
        const{ImapEmail, imapPassword, ImapHost, ImapPort} = req.body;
    
        var imap = new Imap({
            user: ImapEmail,
            password: imapPassword,
            host:ImapHost,
            port: ImapPort,
            tls: true,
        });
    
        imap.once('ready', () => {
    
            console.log("connected");
            res.status(200).send("server connected, please check your inbox after sometime")
            imap.openBox(box_name, false, () => {
                try {
                    console.log("inbox open");
                    // const searchCriteria = [['HEADER', 'SUBJECT', 'hvmjvbjhm']];
    
                    const searchCriteria = ['UNSEEN', ['SINCE', search_time]];
    
                    const fetchOptions = { bodies: ['HEADER'], struct: true };
                    imap.search(searchCriteria, (err, results) => {
                        if (err || results.length === 0) {
                            imap.end();
                            return;
                        }
                        let seeResult = [];
                        var f = imap.fetch(results, fetchOptions);
                        f.on("message", async (msg, seqno) => {
    
                            // var prefix = "(#" + seqno + ") ";
                            msg.on("body", function (stream, info) {
                                // var buffer = "";
                                // var count = 0;
                                stream.on("data", function (chunk) {
                                    // count += chunk.length;
                                    // buffer += chunk.toString("utf8");
                                });
                                stream.once("end", function () {
                                    // parseBody1(buffer);
                                    // console.log("Header",buffer);
                                    msg.once("attributes", function (attrs) {
                                        let uid = attrs.uid;
    
                                        imap.addFlags(uid, ["\\seen"], async function (err) {
                                            console.log("thanks");
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log("seen");
                                            }
                                        });
                                    });
                                });
                            });
                            msg.once("end", function () {
                                // console.log(prefix + "Finished");
                            });
                        });
                        f.once("error", function (err) {
                            console.log("Fetch error: " + err);
                        });
                        f.once("end", function () {
                            imap.end();
                        });
                    });
    
                } catch (error) {
                    console.log("error in search the spam message", error);
                }
            });
        });
    
        imap.once('error', (err) => {
            console.error('IMAP error:', err);
            res.status(201).send({msg:"Server not connected", err:err})
    
        });
    
        imap.once('end', () => {
            console.log('IMAP connection closed');
            // read_hidden_mail('Junk');
        });
    
        imap.connect();  
    }catch(err){
        res.status(201).send({msg:"Something went wrong!", err:err})
    }
}
