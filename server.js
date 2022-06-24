const express = require('express');
const app = express();
const http = require('http');

const PORT = 3000;
app.use(express.static('static'))
let game = false;
let users = []
let pawnsPlace;
let whiteTurn = true
let isBoardSame = false
let time = Date.now();

app.post("/loggin", (req, res) => {

    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    })

    req.on("end", function (data) {

        let flag = false;
        users.forEach(user => {
            if (JSON.parse(body).login == user.login) {
                flag = true
            }
        })
        if (!flag) {
            let isUser;
            let white;
            if (users.length < 2) {
                isUser = true
                white = false
                if (users.length < 1) {
                    white = true
                }
            } else {
                white = null
                isUser = false
            }
            //albo w ifie albo usuwamy i zwracamy ze za duzo graczy

            users.push({ login: JSON.parse(body).login, status: isUser, white: white })

            pawnsPlace = JSON.parse(body).board

            res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
            console.log(users)
            body = JSON.parse(body)
            body.status = isUser
            body.white = white
            if (users.filter(user => user.status == true).length == 2) {
                game = true
                time = Date.now()
            } else {
                game = false
            }
            res.end(JSON.stringify({ body, users, game }, null, 5));
        }
    })

})


app.post("/reset", function (req, res) {
    users = []
    whiteTurn = true
    game = false;
    console.log("tablcia zresetowana")
    res.end(null)
})

app.post("/turn", function (req, res) {
    console.log("turn")
    whiteTurn = !whiteTurn
    time = Date.now()
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    })
    req.on("end", function (data) {
        pawnsPlace = JSON.parse(body)
    })
    res.end(JSON.stringify({ board: pawnsPlace }))
})

app.post("/waitTurn", function (req, res) {
    res.end(JSON.stringify({ whiteTurn: whiteTurn, board: pawnsPlace, game: game, users: users, time: Math.floor(30 - ((Date.now() - time) / 1000)) }, null, 5))
})

app.post("/hasBoardchanged", function (req, res) {
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    })
    req.on("end", function (data) {

        if (JSON.stringify(pawnsPlace) === JSON.stringify(JSON.parse(body))) {
            isBoardSame = true
        } else {
            isBoardSame = false
        }

    })

    res.end(JSON.stringify({ isChanged: isBoardSame, board: pawnsPlace }, null, 5))

})


app.post("/play", function (req, res) {
    res.end(JSON.stringify({ game: game, users: users }, null, 5));
})

app.post("/end", function (req, res) {
    game = false
    res.end(JSON.stringify({ game: game }, null, 5));
})


app.get("/", function (req, res) {
    console.log("/")
    res.send("dane html odesłane z serwera do przeglądarki")
})

app.listen(PORT, () => {
    console.log('listening on *:3000');
});