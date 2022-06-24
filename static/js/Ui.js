
class Ui {
    constructor(net, game) {
        this.net = net
        this.game = game
        this.informationWindow = document.getElementById("line")
        this.addEvent()
    }

    addEvent() {

        document.onclick = (event) => {
            if (this.game.status && this.game.isItTurn()) {
                this.game.raycast(event)
            }
        }

        document.getElementById("reset").addEventListener("click", () => {
            this.net.reset()
        })

        document.getElementById("log").addEventListener("click", async () => {
            let promise = (await this.net.log())
            let logWindow = document.getElementById("window")

            if (promise.body.status) {
                logWindow.style.display = "none"
                this.informationWindow.innerHTML = `USER_ADDED <br/> Witaj ${promise.body.login}`
                if (promise.body.white) {
                    this.informationWindow.innerHTML += ", grasz białymi"
                } else {
                    this.informationWindow.innerHTML += ", grasz czarnymi"
                }

                if (!promise.game) {
                    this.waitForOponentWindow()
                }

            } else {
                this.informationWindow.innerText = "ZA DUZO GRACZY"
            }
        })
    }

    deleteLogUI() {
        document.getElementById("window").style.display = "none"
    }

    waitForOponentWindow() {
        let windowWait = document.createElement("div")
        windowWait.classList.add("wait")
        windowWait.innerText = "Waiting for oponent"
        document.getElementById("body").appendChild(windowWait)
    }

    deleteWaitingWindow() {
        if (document.getElementsByClassName("wait").length > 0) {
            document.getElementsByClassName("wait")[0].style.display = "none"
        }
    }

    deleteTurnWindow() {
        if (document.getElementById("turnWindow")) {
            document.getElementById("turnWindow").style.display = "none"
        }
    }

    addInfoAboutUser(user) {
        this.informationWindow.innerHTML += `</br> Dołączył gracz o nicku ${user}`
    }

    waitForTurn() {
        let windowWait = document.createElement("div")
        windowWait.id = "turnWindow"
        windowWait.classList.add("wait")
        document.getElementById("body").appendChild(windowWait)
    }

    waitForTurnCheck(json) {
        if (document.getElementById("turnWindow") == null) {
            this.waitForTurn()
        } else {
            document.getElementById("turnWindow").style.display = "flex"
            document.getElementById("turnWindow").innerText = json.time
        }
    }

    turnDone(json) {
        if (json.whiteTurn == true && this.game.user.white == true) {
            this.deleteTurnWindow()
        } else if (json.whiteTurn == false && this.game.user.white == false) {
            this.deleteTurnWindow()
        } else {
            console.log(json.game + "GRA")
            if (json.game) {
                this.waitForTurnCheck(json)
            }
        }
        this.checkingIsBoardSameAsArray(this.game.pawnsPlace)
    }

    async checkingIsBoardSameAsArray() {
        let k = await this.game.net.hasBoardchanged(this.game.pawnsPlace)
        if (!k.isChanged) {
            this.refreshBoard()
        }
    }

    refreshBoard() {
        this.game.pawns.deletePawns()
        this.game.pawns.generatePawns(this.game.pawnsPlace)
    }

    endGame() {
        this.deleteTurnWindow()
        let windowWait = document.createElement("div")
        windowWait.id = "turnWindow"
        windowWait.classList.add("wait")
        windowWait.innerText = "End Game"
        document.getElementById("body").appendChild(windowWait)
    }

}

