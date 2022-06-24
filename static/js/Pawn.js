class Pawn {

    constructor(blackOrWhite, row, column, table_row, table_column) {
        this.table_row = table_row
        this.table_column = table_column
        this.row = row
        this.column = column
        this.elementWidth = 10
        this.elementHeigth = 5
        this.radiusElement = 20
        this.blackOrWhite = blackOrWhite

        this.geometry = new THREE.CylinderGeometry(this.elementWidth, this.elementWidth, this.elementHeigth, this.radiusElement);
        if (this.blackOrWhite == 1) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide, // dwustronny
                map: new THREE.TextureLoader().load("/white_pawn.jpg"), // plik tekstury
                transparent: false, // przezroczysty / nie
                opacity: 0, // stopień przezroczystości
            })
        } else if (this.blackOrWhite == 2) {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide, // dwustronny
                map: new THREE.TextureLoader().load("/black_pawn.jpg"), // plik tekstury
                transparent: false, // przezroczysty / nie
                opacity: 0, // stopień przezroczystości
            })
        } else if (this.blackOrWhite == 3) {
            this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        } else {
            this.material = new THREE.MeshBasicMaterial({ color: 0x1c1c1c });
        }
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    generate = () => {
        this.mesh.name = this.blackOrWhite
        this.setPosition()
        return this.mesh
    }

    setPosition() {
        this.mesh.position.set(this.row, 5, this.column)
    }

}

