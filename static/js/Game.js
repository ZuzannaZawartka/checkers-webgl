class Game {
    constructor() {

        this.net = new Net(this);
        this.ui = new Ui(this.net, this);
        this.whiteTurn = true


        this.pawnsPlace = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        this.user = undefined
        this.status = false
        this.current = { pawn: undefined, place: undefined }
        this.toBeat = []

        this.timeStart = 0
        this.timeNow

        this.lightColor = 0x6bd3e8
        this.whiteColor = 0xffffff



        this.scene = new THREE.Scene();
        const axes = new THREE.AxesHelper(1000)
        this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
        this.camera.position.set(0, 150, 200)

        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x403c3c);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.onWindowResize()

        document.getElementById("root").append(this.renderer.domElement);

        this.scene.add(axes)

        this.board = new CheckersPlane(this.scene)
        this.pawns = new Pawns(this.scene, this.pawnsPlace)

        this.render() // wywołanie metody render


    }

    start = (users, user_body) => {
        this.status = true
        if (this.setUser(users, user_body).status == true) {
            this.pawns.generatePawns(this.pawnsPlace)
            this.net.waitForTurnFetch()
        }
        if (this.user.white == false) this.camera.position.set(0, 150, -200)
    }

    isItTurn() {
        if (!this.user.white && this.whiteTurn) {
            return false
        } else if (this.user.white && !this.whiteTurn) {
            return false
        }
        return true
    }

    getUser = (users, user_body) => {
        return users.find(el => el.login == user.login)
    }

    setUser = (users, user_body) => {
        this.user = users.find(el => el.login == user_body.login)
        return this.user
    }

    setCurrentPawn = (pawn) => {
        this.current.pawn = pawn
    }

    setCurrentPlace = (place) => {
        this.current.place = place

    }

    resetCurrent = () => {
        this.current = { pawn: undefined, place: undefined }
    }

    render = () => {
        window.addEventListener('resize', this.onWindowResize, false);
        requestAnimationFrame(this.render);
        this.camera.lookAt(this.scene.position)
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize = () => {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    raycast = (event) => {
        this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        let pawnOne = this.pawns.pawnsElements.find(ele => ele.mesh.uuid == intersects[0].object.uuid)
        let placeOne = this.board.checkersElements.find(ele => ele.mesh.uuid == intersects[0].object.uuid)
        if (this.status) {
            if (intersects.length > 0) {

                if (this.pawns.pawnsElements.length > 0) {
                    this.pawns.pawnsElements.forEach(pawn => {

                        if (pawn.blackOrWhite == 1) {
                            pawn.mesh.material.color.setHex(this.whiteColor);

                        } else if (pawn.blackOrWhite == 2) {

                            pawn.mesh.material.color.setHex(this.whiteColor);
                        }
                        else if (pawn.blackOrWhite == 3) {
                            pawn.mesh.material.color.setHex(0xffffff);
                        } else if (pawn.blackOrWhite == 4) {
                            pawn.mesh.material.color.setHex(0x000000);

                        }
                    })
                }

                if (this.user.white) {
                    if (pawnOne && (pawnOne.blackOrWhite == 1 || pawnOne.blackOrWhite == 3)) {

                        intersects[0].object.material.color.setHex(this.lightColor);
                        this.setCurrentPawn(pawnOne)

                    }
                } else {
                    if (pawnOne && (pawnOne.blackOrWhite == 2 || pawnOne.blackOrWhite == 4)) {
                        intersects[0].object.material.color.setHex(this.lightColor);
                        this.setCurrentPawn(pawnOne)

                    }
                }

                if (this.current.pawn != undefined) {
                    this.clearHighlighting()
                    this.placeHighlighting()
                    if (placeOne) {
                        this.setCurrentPlace(placeOne)
                        this.turn()
                    }
                }
            }
        }
    }

    arrayPawnsPlaceSync = () => {
        this.pawnsPlace[this.current.pawn.table_row][this.current.pawn.table_column] = 0
        this.pawnsPlace[this.current.place.table_row][this.current.place.table_column] = this.current.pawn.blackOrWhite
    }

    turn = () => {
        this.ui.refreshBoard()
        if (this.current.place.active) {
            this.arrayPawnsPlaceSync()
            let rowBefore = this.current.pawn.table_row
            this.current.pawn.table_column = this.current.place.table_column
            this.current.pawn.table_row = this.current.place.table_row

            this.beat(rowBefore)

            this.current.pawn.mesh.position.set(this.current.place.mesh.position.x, 5, this.current.place.mesh.position.z)

            this.queen()
            this.whiteTurn = !this.whiteTurn
            this.net.turn(this.pawnsPlace)
            this.resetCurrent()
            this.clearHighlighting()
            // this.ui.refreshBoard()
            this.isEnd()
        } else {
            this.clearHighlighting()
        }
        this.ui.refreshBoard()
    }

    placeHighlighting = () => {

        //odkomentowac jak nie odsiweza
        //  this.ui.refreshBoard()
        if (this.current.pawn.blackOrWhite == 3 || this.current.pawn.blackOrWhite == 4) {
            this.isItPossibleQueen()
        } else {
            this.board.checkersElements.forEach(place => {
                if (this.isItPossible(place, this.current.pawn) && place.blackOrWhite == 0) {
                    if (this.current.pawn.blackOrWhite == 1) {
                        if (place.table_row - this.current.pawn.table_row == -1) {
                            place.mesh.material.color.setHex(this.lightColor);
                            place.active = true
                        }
                    } else {
                        if (place.table_row - this.current.pawn.table_row == 1) {
                            place.mesh.material.color.setHex(this.lightColor);
                            place.active = true
                        }
                    }
                }
            })
        }
    }

    clearHighlighting = () => {
        this.board.checkersElements.forEach(place => {

            if (place.blackOrWhite == 0) {
                place.mesh.material.color.setHex(this.whiteColor);
                place.active = false
            } else {
                place.mesh.material.color.setHex(this.whiteColor);
                place.active = false
            }


        })
        this.toBeat = []
    }


    isItPossible = (place, pawn) => {
        try {
            if (Math.abs(place.table_row - pawn.table_row) < 2 && Math.abs(place.table_column - pawn.table_column) < 2 && place.blackOrWhite == 0) {
                if (pawn.blackOrWhite == 1) {
                    if (place.table_row - pawn.table_row == -1) {
                        if (this.pawnsPlace[place.table_row][place.table_column] == 0) {
                            place.active = true
                            return true
                        } else if (this.pawnsPlace[place.table_row][place.table_column] == 2 || this.pawnsPlace[place.table_row][place.table_column] == 4) {

                            if (this.isItBeating(place)) {
                                this.toBeat.push(place)
                            }
                            console.log(this.toBeat)
                        }
                    }
                } else {
                    if (place.table_row - pawn.table_row == 1) {
                        if (this.pawnsPlace[place.table_row][place.table_column] == 0) {
                            place.active = true
                            return true
                        } else if (this.pawnsPlace[place.table_row][place.table_column] == 1 || this.pawnsPlace[place.table_row][place.table_column] == 3) {
                            if (this.isItBeating(place)) {

                                this.toBeat.push(place)
                            }
                            console.log(this.toBeat)
                        }

                    }
                }
            }
            return false
        } catch (e) { }

    }

    isItPossibleQueen() {
        let y = this.current.pawn.table_row
        let x = this.current.pawn.table_column
        this.recurentionHighlighting(x + 1, y + 1, 1, 1)
        this.recurentionHighlighting(x - 1, y + 1, -1, 1)
        this.recurentionHighlighting(x - 1, y - 1, - 1, -1)
        this.recurentionHighlighting(x + 1, y - 1, 1, -1)

    }

    recurentionHighlighting(place1, place2, addRow, addColumn) {
        if (place1 <= 7 && place2 <= 7 && place1 >= 0 && place2 >= 0 && this.pawnsPlace[place2][place1] == 0) {
            let place = this.board.checkersElements.find(elem => elem.table_row == place2 && elem.table_column == place1)
            place.mesh.material.color.setHex(this.lightColor);
            place.active = true
            return this.recurentionHighlighting((place1 + addRow), (place2 + addColumn), addRow, addColumn)
        } else {
            //beating
            if ((place1 + addRow) <= 7 && (place2 + addColumn) <= 7 && (place1 + addRow) >= 0 && (place2 + addColumn) >= 0 && this.pawnsPlace[(place2 + addColumn)][(place1 + addRow)] == 0) {
                console.log(this.user.white)
                console.log(this.pawnsPlace[place2][place1])
                let place = this.board.checkersElements.find(elem => elem.table_row == (place2 + addColumn) && elem.table_column == (place1 + addRow))
                if (this.user.white && (this.pawnsPlace[place2][place1] == 4 || this.pawnsPlace[place2][place1] == 2)) {
                    this.toBeat.push(this.board.checkersElements.find(place => place.table_row == place2 && place.table_column == place1))
                    console.log(this.toBeat)
                    place.mesh.material.color.setHex(this.lightColor);
                    place.active = true
                } else if (!this.user.white && (this.pawnsPlace[place2][place1] == 3 || this.pawnsPlace[place2][place1] == 1)) {
                    this.toBeat.push(this.board.checkersElements.find(place => place.table_row == place2 && place.table_column == place1))
                    console.log(this.toBeat)
                    place.mesh.material.color.setHex(this.lightColor);
                    place.active = true
                }
            }
            return false
        }
    }

    isItBeating = (place) => {
        let beatingPlace1;
        let beatingPlace2;
        if (this.current.pawn.blackOrWhite == 1) {
            if (this.current.pawn.table_column > place.table_column) {
                beatingPlace1 = this.board.checkersElements.find(elem => elem.table_column == place.table_column - 1 && elem.table_row == place.table_row - 1)
                if (this.pawnsPlace[beatingPlace1.table_row][beatingPlace1.table_column] == 0) {
                    beatingPlace1.mesh.material.color.setHex(this.lightColor);
                    beatingPlace1.active = true
                    return true
                }
            } else {
                beatingPlace2 = this.board.checkersElements.find(elem => elem.table_column == place.table_column + 1 && elem.table_row == place.table_row - 1)
                if (this.pawnsPlace[beatingPlace2.table_row][beatingPlace2.table_column] == 0) {
                    beatingPlace2.mesh.material.color.setHex(this.lightColor);
                    beatingPlace2.active = true
                    return true
                }
            }
        } else {
            if (this.current.pawn.table_column > place.table_column) {
                beatingPlace1 = this.board.checkersElements.find(elem => elem.table_column == place.table_column - 1 && elem.table_row == place.table_row + 1)
                if (this.pawnsPlace[beatingPlace1.table_row][beatingPlace1.table_column] == 0) {
                    beatingPlace1.mesh.material.color.setHex(this.lightColor);
                    beatingPlace1.active = true
                    return true
                }
            } else {
                beatingPlace2 = this.board.checkersElements.find(elem => elem.table_column == place.table_column + 1 && elem.table_row == place.table_row + 1)
                if (this.pawnsPlace[beatingPlace2.table_row][beatingPlace2.table_column] == 0) {
                    beatingPlace2.mesh.material.color.setHex(this.lightColor);
                    beatingPlace2.active = true
                    return true
                }
            }
        }
        return false
    }

    beat(rowBefore) {
        if (this.toBeat.length > 0) {
            if (Math.abs(rowBefore - this.current.pawn.table_row) > 1) {
                let nearest = undefined;
                let pawn;
                this.toBeat.forEach(e => {
                    let pawn = this.pawns.pawnsElements.find(element => element.table_row == e.table_row && element.table_column == e.table_column)
                    if (!nearest) {
                        nearest = pawn;
                    } else {
                        if (Math.abs(this.current.pawn.table_row - pawn.table_row) < Math.abs(this.current.pawn.table_row - nearest.table_row) || Math.abs(this.current.pawn.table_column - pawn.table_column) < Math.abs(this.current.pawn.table_column - nearest.table_column)) {
                            nearest = pawn
                        }
                    }
                })
                this.pawns.pawnsElements = this.pawns.pawnsElements.filter(element => element == nearest)
                this.pawnsPlace[nearest.table_row][nearest.table_column] = 0

            }
            this.ui.refreshBoard()
        }
    }

    isEnd() {
        let blackPawn = this.pawns.pawnsElements.filter(element => element.blackOrWhite == 2 || element.blackOrWhite == 4)
        let whitePawn = this.pawns.pawnsElements.filter(element => element.blackOrWhite == 1 || element.blackOrWhite == 3)
        if (blackPawn.length < 1 || whitePawn.length < 1) {
            console.log("ENDGAME")
            this.status = false
            this.net.end()
            return true
        }
        return false
    }

    queen() {
        if (this.current.place.table_row == 0 && this.current.place.active && this.current.pawn.blackOrWhite == 1) {
            console.log("QUEEN")
            this.current.pawn.blackOrWhite = 3
            this.pawnsPlace[this.current.pawn.table_row][this.current.pawn.table_column] = 3
        } else if (this.current.place.table_row == 7 && this.current.place.active && this.current.pawn.blackOrWhite == 2) {
            console.log("QUEEN")
            this.current.pawn.blackOrWhite = 4
            this.pawnsPlace[this.current.pawn.table_row][this.current.pawn.table_column] = 4
        }

    }
}





