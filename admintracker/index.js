const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require('mysql');
const fs = require("fs");

const app = express();

var urlencodeParse = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const homePage = fs.readFileSync("./admintracker/index.html", "utf-8");
const ogViewHtml = fs.readFileSync("./admintracker/viewitem/view.html", "utf-8");
const ogViewAdminHtml = fs.readFileSync("./admintracker/admin/viewitem-admin/view-admin.html", "utf-8");
const ogApproveAdminHtml = fs.readFileSync("./admintracker/admin/approveitem-admin/approveitem-admin.html", "utf-8");

var AllTags = new Set();
var AllPeople = new Set();

// var CurrentAuthTokens = { // Form: useragent[String] |--> valid auth token[String]

// };
var CurrentAuthTokens = [];

const AvailableCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-";

function GenerateNewAuthToken() { // Cryptography go brrrr
    let toReturn = "";
    for (let i = 0; i < 40; i++) {
        toReturn += AvailableCharacters[Math.floor(Math.random() * AvailableCharacters.length)];
    }
    return toReturn;
}

app.get('/', (req, res) => {
    res.sendFile("./index.html", { root: __dirname });
});

app.get('/style.css', (req, res) => {
    res.sendFile('style.css', { root: __dirname });
});

app.get('/tracker.js', (req, res) => {
    res.sendFile('tracker.js', { root: __dirname });
});

app.get("/ComputerModernSerif.ttf", (req, res) => {
    res.sendFile("./fonts/cmunrm.ttf", { root: __dirname });
});

app.get("/submit", (req, res) => {
    res.redirect("/submit/Quote");
});

app.get("/submit/:type", (req, res) => {
    res.sendFile("./submit.html", { root: __dirname });
});

app.get("/explore", (req, res) => {
    res.sendFile("./explore/explore.html", { root: __dirname });
});

app.get("/explore.js", (req, res) => {
    res.sendFile("./explore/explore.js", { root: __dirname });
});

app.get(["/search/", "/tag/:tag", "/people/:person"], (req, res) => {
    res.sendFile("./search/search.html", { root: __dirname });
});

app.get("/search.js", (req, res) => {
    res.sendFile("./search/search.js", { root: __dirname });
});

app.get(["/people", "/tag"], (req, res) => {
    res.redirect("/search");
});

app.get("/login", (req, res) => {
    res.redirect("/admin/login");
});

app.get("/admin/login", (req, res) => { // This /admin page does *not* need authentication
    res.sendFile("./login/login.html", { root: __dirname });
});

app.post("/api/searchitems", (req, res) => {
    if (req.body == null || req.body == undefined) return;
    // console.log(req.body);
    let toSearch = `SELECT * FROM sys.items`;
    let addends = [];
    if (req.body.person && req.body.person != "") {
        addends.push(`person='${req.body.person}'`);
    }
    if (req.body.quotetext && req.body.quotetext != "") {
        addends.push(`text LIKE '%${req.body.quotetext}%'`);
    }
    if (false) { // Addl search methods

    }
    if (addends.length) {
        toSearch += " WHERE ";
        toSearch += addends.join(" and ");
    }
    toSearch += " LIMIT 50;";
    connection.query(toSearch, (err, rows, fields) => {
        let toSend = rows || [];

        if (req.body.taglist) for (var i = 0; i < toSend.length; i++) { // Filter for `taglist` given
            let tTags = (toSend[i].tags || "").split(",");
            if (tTags.length == 0 || !req.body.taglist.every(v => tTags.includes(v))) {
                toSend.splice(i, 1);
                i--;
            }
        }

        res.send({ rows: toSend || [] });
    });
});

app.post("/api/searchtags", (req, res) => {
    if (!req.body || !req.body.tagFragment) {
        res.send({ success: false, code: 400, message: "No body or tag fragment sent." });
        return;
    }
    let toSend = [];
    AllTags.forEach(tag => {
        if (toSend.length >= 5) return;
        if (tag && tag.startsWith(req.body.tagFragment)) {
            toSend.push(tag);
            if (toSend.length >= 5) {
                return;
            }
        }
    });
    toSend.sort();
    res.send({ bestGuesses: toSend, ogSearch: req.body.tagFragment });
});

app.post("/api/searchpeople", (req, res) => {
    if (!req.body || !req.body.personFragment) {
        res.send({ success: false, code: 400, message: "No body or tag fragment sent." });
        return;
    }
    let toSend = [];
    AllPeople.forEach(person => {
        if (toSend.length >= 5) return;
        if (person && person.toLowerCase().startsWith(req.body.personFragment)) {
            toSend.push(person);
            if (toSend.length >= 5) {
                return;
            }
        }
    });
    toSend.sort();
    res.send({ bestGuesses: toSend, ogSearch: req.body.personFragment });
});

app.post("/api/getsingleitem", (req, res) => {
    if (!req.body || !req.body.id) {
        res.send({ success: false, code: 400, message: "No body or id provided" });
        return;
    }
    connection.query(`SELECT id, type, text, person, time, location, tags, description, source, archivedsource FROM sys.items WHERE id=${req.body.id}`, (err, rows, fields) => {
        if (err) throw err;

        res.send(rows[0]);
    });
});

app.get("/quote/quote.js", (req, res) => {
    res.sendFile("./viewquote/quote.js", { root: __dirname });
});

app.get(["/quote/:id", "/action/:id", "/item/:id"], (req, res) => {
    if (isNaN(req.params.id) || !(req.params.id && req.params.id.length)) {
        let toSend = ogViewHtml.replace("/* %CURRENTQUOTE */", "null");

        res.type("html");
        res.send(toSend);

        return;
    }

    connection.query(`SELECT id, type, text, person, time, location, tags, description, source, archivedsource FROM sys.items WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (err) throw err;

        if (!rows.length) rows = [{ success: false, message: "No such item found" }];

        if (rows[0].type && req.url.split("/")[1] != rows[0].type.toLowerCase()) {
            res.redirect(`/${rows[0].type.toLowerCase()}/${req.params.id}`);
            return;
        }

        if (rows[0]["success"] != false) rows[0]["success"] = true;

        let toSend = ogViewHtml.replace("/* %CURRENTQUOTE */", JSON.stringify(rows[0]));

        res.type("html");
        res.send(toSend);
    });
});

app.get("/action/action.js", (req, res) => {
    res.sendFile("./viewaction/action.js", { root: __dirname });
});

app.get("/logout", (req, res) => {
    if (req.cookies.authentication && CurrentAuthTokens.includes(req.cookies.authentication)) {
        CurrentAuthTokens.splice(CurrentAuthTokens.indexOf(req.cookies.authentication), 1); // Invalidate authentication token on navigation to /logout
    }
    res.redirect("/");
});

app.post("/submit", (req, res) => {
    let b = req.body;
    if (JSON.stringify(b).includes(");")) {
        console.warn(`Caught potential SQL injection: ${JSON.stringify(b)}`);
        res.send("Caught potential SQL injection, halting.");
        return;
    }

    connection.query("INSERT INTO `sys`.`proposed_items` (`text`, `person`, `time`, `location`, `tags`, `description`, `source`, `archivedsource`, `type`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [b.shortDesc, b.person, b.datetime, b.location, b.tags, b.description, b.sourceurl, b.archiveurl, b.type],
        (err, rows, fields) => {
            if (err) console.log(err);

            console.log(`Proposed item ${req.body.quoteText}`);
        });

    res.sendFile("./submit.html", { root: __dirname });
});

app.post("/api/login", (req, res) => {
    // console.log(req.body);
    if (!req.body || !req.body.password) {
        res.send({ success: false, code: 400, message: "No body or password provided" });
        return;
    }
    if (req.body.password == process.env.ADMIN_PSWD) {
        let newAuth = GenerateNewAuthToken();
        CurrentAuthTokens.push(newAuth);
        res.send({
            success: true,
            code: 200,
            authCookie: newAuth
        });
    } else {
        res.status(401);
        res.send({ success: false, code: 401, message: "Invalid login" });
    }
});

// ----------------------------------------- ADMIN ONLY BELOW HERE ------------------------------------------

app.use((req, res, next) => { // Handle authentication for admin stuff
    if (!req.cookies.authentication || !CurrentAuthTokens.includes(req.cookies.authentication)) {
        res.status(401);
        res.redirect("/login");
        return;
    }
    next();
});

app.get("/admin", (req, res) => {
    res.sendFile("./admin/admin.html", { root: __dirname });
});

app.get(["/admin/quote/:id", "/admin/action/:id", "/admin/item/:id"], (req, res) => {
    res.redirect(`/admin/edit/${req.params.id}`);
});

app.get("/admin/edit/:id", (req, res) => {
    if (isNaN(req.params.id) || !(req.params.id && req.params.id.length)) {
        res.redirect("/admin/");

        return;
    }
    connection.query(`SELECT * FROM items WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (err) throw err;

        let toSend = ogViewAdminHtml.replace("/* %CURRENTQUOTE */", JSON.stringify(rows[0]));

        res.type("html");
        res.send(toSend);
    });
});

app.get(["/admin/approve", "/admin/approve/"], (req, res) => {
    connection.query(`SELECT id FROM sys.proposed_items LIMIT 1;`, (err, rows, fields) => {
        if (err) reject(err);

        if (rows.length) {
            res.redirect(`/admin/approve/${rows[0].id}`);
        } else {
            res.sendFile("./admin/approveitem-admin/no-more-needed.html", { root: __dirname });
        }
    });
});

app.get("/admin/approve/:id", (req, res) => {
    connection.query(`SELECT * FROM sys.proposed_items WHERE id=${req.params.id};`, (err, rows, fields) => {
        if (err) reject(err);

        if (rows.length) {
            let toSend = ogApproveAdminHtml;
            toSend = toSend.replace("/* %CURRENTQUOTE */", JSON.stringify(rows[0]) || "null");

            res.type("html");
            res.send(toSend);
        } else {
            res.send("Proposed item not found");
        }
    });
});

app.post("/api/admin/approveproposeditem", async (req, res) => {
    if (!req.body || !req.body.id) {
        res.send({ success: false, code: 400, message: "No body or id provided" });
        return;
    }
    let b = req.body;
    await new Promise((resolve, reject) => {
        connection.query("INSERT INTO `sys`.`items` (`text`, `person`, `time`, `location`, `tags`, `description`, `source`, `archivedsource`, `type`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [b.text, b.person, b.datetime, b.location, b.tags, b.description, b.sourceurl, b.archiveurl, b.type],
            (err, rows, fields) => {
                if (err) console.log(err);

                console.log(`Successfully approved item ${b.text}`);
                resolve();
            });
    });
    await new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM sys.proposed_items WHERE id=${req.body.id};`,
            (err, rows, fields) => {
                if (err) {
                    console.warn(err);
                    reject(err);
                }

                console.log(`Successfully deleted proposed item with proposal id ${req.body.id} as part of the approval process`);
                resolve();
            }
        );
    });
    res.send({ success: true, code: 200, message: "Item approved" });
});

app.post("/api/admin/getbasicadmininfo", async (req, res) => { // Collect and send basic info for admin dashboard
    let toSend = {};
    await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM sys.items;`, (err, rows, fields) => {
            if (err) reject(err);

            toSend.numberPublicItems = rows.length;
            resolve();
        });
    });
    await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM sys.proposed_items;`, (err, rows, fields) => {
            if (err) reject(err);

            toSend.numberProposedItems = rows.length;
            resolve();
        });
    });
    res.send(toSend);
});

app.post("/api/admin/goto", (req, res) => {
    res.redirect(`/admin/edit/${req.body.id}`);
});

app.post("/api/admin/deleteitem", async (req, res) => {
    if (!req.body || !req.body.idToDelete) {
        res.send({ success: false, code: 400, message: "No ID provided to delete" });
        return;
    }

    await new Promise((resolve, reject) => {
        connection.query("INSERT INTO sys.deleted_items (id, text, person, time, location, tags, description, source, archivedsource, type) SELECT id, text, person, time, location, tags, description, source, archivedsource, type FROM sys.items WHERE id=" + req.body.idToDelete + ";",
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(`Successfully copied item with it ${req.body.idToDelete} to deleted table`);
                resolve();
            });
    });
    await new Promise((resolve, reject) => {
        connection.query(`DELETE FROM sys.items WHERE id=${req.body.idToDelete};`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            console.log(`Successfully dropped item with id ${req.body.idToDelete} from main table`);
            resolve();
        });
    });
    res.send(`Successfully deleted item with id ${req.body.idToDelete}`);
});

app.post("/api/admin/updateitem", (req, res) => {
    if (!req.body) {
        res.send({ success: false, code: 400, message: "No body provided to update" });
        return;
    }

    let b = req.body;
    if (JSON.stringify(b).includes(");")) {
        console.warn(`Caught potential SQL injection: ${JSON.stringify(b)}`);
        res.send("Caught potential SQL injection, halting.");
        return;
    }

    // console.log(b);

    connection.query("UPDATE `sys`.`items` SET `text`=?, `person`=?, `time`=?, `location`=?, `tags`=?, `description`=?, `source`=?, `archivedsource`=?, `type`=? WHERE id = ?;",
        [b.text, b.person, b.datetime, b.location, b.tags, b.description, b.sourceurl, b.archiveurl, b.type, b.id],
        (err, rows, fields) => {
            if (err) console.log(err);

            console.log(`Updated quote ${req.body.text} with ID ${req.body.id}`);
        });

    res.sendFile("./submit.html", { root: __dirname });
});

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.MYSQL_USRN,
    password: process.env.MYSQL_PSWD,
    database: "sys",
    port: 3300
});

module.exports.app = app;

module.exports.startUpFunction = function() {
    connection.connect();

    console.log("  Reading all possible tags and people...");
    connection.query(`SELECT tags, person FROM items;`, (err, rows, fields) => {
        if (err) throw err;

        rows.forEach((row) => {
            row.tags.split(",").forEach((tag) => {
                AllTags.add(tag);
            });
            AllPeople.add(row.person);
        });
    });

    setInterval(function() {
        connection.query("SELECT 1;", (err, rows, fields) => {

        });
    }, 1800000);
};

module.exports.shutDownFunction = function() {
    connection.end();
};
