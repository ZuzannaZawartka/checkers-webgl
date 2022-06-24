class Net {
    constructor(game) {
        this.users = []
        this.game = game
    }

    async log() {
        const data = JSON.stringify({
            login: document.getElementById("nick").value,
            board: this.game.pawnsPlace
        })
        const options = {
            method: "POST",
            body: data
        };
        let response = await fetch("/loggin", options)
        let json = await response.json()
        this.users = json.users
        //console.log(json)
        this.game.start(this.users, json.body)
        if (this.users.length < 2) {
            let isTwoPlayer = setInterval(async () => {
                let response = await fetch("/play", options)
                let json = await response.json()
                console.log(json.game)
                if (json.game) {
                    clearInterval(isTwoPlayer)
                    this.game.ui.addInfoAboutUser(json.users.find(user => user.white == false).login)
                    this.game.ui.deleteWaitingWindow()
                }
            }, 500);
        }
        return json
    }

    async reset() {
        const options2 = {
            method: "POST",
            body: null,
        };
        let response2 = await fetch("/reset", options2)
    }

    async waitForTurnFetch() {
        this.game.timeStart = Date.now()
        let turns = setInterval(async () => {
            this.game.ui.checkingIsBoardSameAsArray(this.game.pawnsPlace)

            const options3 = {
                method: "POST",
                body: null,
            };
            let response3 = await fetch("/waitTurn", options3)
            let json = await response3.json()

            this.game.whiteTurn = json.whiteTurn
            this.game.pawnsPlace = json.board

            this.game.ui.turnDone(json)
            if (json.time <= 0) {
                this.turn(this.game.pawnsPlace)
            }
            if (!json.game && json.users.length >= 2) {
                this.game.ui.endGame()
                clearInterval(turns)
            }

        }, 500);
    }

    async turn(board) {
        const data = JSON.stringify(
            board,
        )
        //zmienilam w body zamiasty daty
        const options3 = {
            method: "POST",
            body: JSON.stringify(board),
        };
        let response3 = await fetch("/turn", options3)
        let json = await response3.json()
        json.board = this.game.pawnsPlace
        // this.game.timeStart = Date.now()

    }

    async hasBoardchanged(board) {

        const data = JSON.stringify(
            board,
        )
        //zmienilam w body zamiasty daty
        const options3 = {
            method: "POST",
            body: JSON.stringify(board),
        };
        let response4 = await fetch("/hasBoardchanged", options3)
        let json = await response4.json()
        return json
    }

    async end() {
        const options3 = {
            method: "POST",
            body: null,
        };
        let response4 = await fetch("/end", options3)
        let json = await response4.json()
        console.log(json)
        return json
    }

    async endTime() {
        const options3 = {
            method: "POST",
            body: null,
        };
        let response4 = await fetch("/endTime", options3)
        let json = await response4.json()
        console.log(json)
        return json

    }
}

