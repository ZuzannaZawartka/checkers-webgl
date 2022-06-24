
class CheckersBox {
    constructor(width, height, depth, blackOrWhite, row, column, table_row, table_column) {
        this.table_row = table_row
        this.table_column = table_column
        this.row = row
        this.column = column
        this.blackOrWhite = blackOrWhite
        this.active = false
        this.darkerMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load("/black_box2.jpg"), // plik tekstury
            transparent: true, // przezroczysty / nie
            opacity: 1, // stopień przezroczystości
        })

        this.darkMaterial = new THREE.MeshBasicMaterial({

            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load("/black_box.jpg"), // plik tekstury
            transparent: true, // przezroczysty / nie
            opacity: 1, // stopień przezroczystości

        })

        this.geometry = new THREE.BoxGeometry(width, height, depth);

        if (this.blackOrWhite == 1) {
            this.material = new THREE.MeshBasicMaterial({

                side: THREE.DoubleSide, // dwustronny
                map: new THREE.TextureLoader().load("/white_box.jpg"), // plik tekstury
                transparent: true, // przezroczysty / nie
                opacity: 1, // stopień przezroczystości

            })
        } else {
            this.material = this.darkMaterial
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    generate() {
        this.mesh.name = this.blackOrWhite
        this.mesh.rotation.x = Math.PI / 2
        this.setPosition()
        return this.mesh
    }

    setPosition() {
        this.mesh.position.set(this.row, 0, this.column)
    }


}

