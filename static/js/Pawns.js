

class Pawns {
    constructor(scene) {
        this.elementWidth = 20;
        this.elementHeigth = 5;
        this.radiusElement = 20
        this.scene = scene
        this.pawnsElements = []
        this.pawnsBox = new THREE.Object3D();
    }

    generatePawns(pawns) {
        // this.pawnsBox = new THREE.Object3D()
        let row = -(this.elementWidth * 3.5)
        let column = -(this.elementWidth * 3.5)
        let table_row = 0
        let table_column = 0
        pawns.forEach(rowPawns => {
            rowPawns.forEach(pawn => {
                if (pawn != 0) {
                    let pawnElement = new Pawn(pawn, row, column, table_row, table_column)
                    let element = pawnElement.generate()
                    this.pawnsBox.add(element);
                    this.pawnsElements.push(pawnElement)
                }
                row += this.elementWidth;
                table_column++
            })
            table_row++
            table_column = 0;
            column += this.elementWidth;
            row = -(this.elementWidth * 3.5);
        })
        this.scene.add(this.pawnsBox)
    }

    deletePawns() {
        this.pawnsElements = []
        this.scene.remove(this.pawnsBox)
        this.pawnsBox = new THREE.Object3D()
    }
}

