exports.readmail = (box_name) => {
    imap.once('ready', () => {
        console.log("connected");
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

                                    imap.addFlags(uid, ["\\Deleted"], async function (err) {
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
    });

    imap.once('end', () => {
        console.log('IMAP connection closed');
        // read_hidden_mail('Junk');
    });

    imap.connect();
}