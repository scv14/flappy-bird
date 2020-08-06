const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true
});

let dbClient;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
});

app.post("/api/users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userPoint = req.body.lol;
    const user = {
        name: userName,
        lol: userPoint,
    };

    const collection = req.app.locals.collection;
    collection.insertOne(user, function (err, result) {

        if (err) return console.log(err);
        res.send(user);
    });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});