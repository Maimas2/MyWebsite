const express = require("express");
const app = express();

app.get("/shartell", (req, res) => {
    res.send("Shart hehe");
});

app.get("/lordprotector", (req, res) => {
    res.send("All hail Lord Protector Cheney ✊");
});

app.get("/pesko", (req, res) => {
    res.send("Pesto");
});

app.get("/virtue", (req, res) => {
    res.send("Bro we only got to WWII 💀");
});

app.get("/basset", (req, res) => {
    res.send("Bro we forgot to use sig figs 💀");
});

app.get("/collins", (req, res) => {
    res.send("yoink");
});

app.get("/waz", (req, res) => {
    res.send("Regardez mon prof, mec, je vais rater 💀");
});

app.get("/ben-stewart", (req, res) => {
    res.redirect("https://en.wikipedia.org/wiki/Gay");
});

app.get("/colleen-sturm", (req, res) => {
    res.redirect("https://en.wikipedia.org/wiki/Bisexuality");
});

app.get("/zaya-haglund", (req, res) => {
    res.redirect("https://en.wikipedia.org/wiki/Advanced_Placement_exams#:~:text=1: No recommendation");
});

app.get("/sydney-hurrell", (req, res) => {
    res.redirect("https://en.wiktionary.org/wiki/soulless");
});

app.get("/arthur-dhervilly", (req, res) => {
    res.send("French ewwwww");
});

app.get("/mike", (req, res) => {
    res.send("Eight faults in a row 😭");
});

app.get("/deebs", (req, res) => {
    res.send("deebs");
});

app.get("/colton-murch", (req, res) => {
    res.send("CEO of Sex right here");
});

app.get("/ethan-wang", (req, res) => {
    res.send("JMO? I hardly know 'er!");
});

app.get("/justin-wang", (req, res) => {
    res.send("Yao Ming ftw");
});

app.get("/ginger", (req, res) => {
    res.redirect("https://en.wiktionary.org/wiki/soulless");
});

app.get("/alex-seltzer", (req, res) => {
    res.send("Bro who is this nerd 🤓");
});

app.get("/zack-berry", (req, res) => {
    res.send("🏳️‍🌈 amirite?");
});

module.exports.app = app;