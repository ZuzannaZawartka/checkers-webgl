class CheckersPlane {
    constructor(scene) {
        this.elementWidth = 20;
        this.elementHeigth = 20;
        this.scene = scene
        this.checkersElements = []
        this.szachownica = [

            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],

        ];
        this.generateBoard()
    }

    generateBoard() {
        let CheckersPlaneBox = new THREE.Object3D()
        let row = -(this.elementWidth * 3.5);
        let column = -(this.elementHeigth * 3.5);
        let rowBoardCount = 0;
        let columnBoardCount = 0;
        this.szachownica.forEach(rowBoard => {
            rowBoard.forEach(place => {
                let checkersBoxElement = new CheckersBox(this.elementWidth, this.elementHeigth, 5, place, row, column, rowBoardCount, columnBoardCount);
                let element = checkersBoxElement.generate()
                CheckersPlaneBox.add(element);
                this.checkersElements.push(checkersBoxElement)
                row += 20;
                columnBoardCount++;

            })
            columnBoardCount = 0;
            column += this.elementWidth;
            row = -(this.elementHeigth * 3.5)
            rowBoardCount++;
        })
        this.scene.add(CheckersPlaneBox)
        console.log(this.checkersElements)
    }
}


