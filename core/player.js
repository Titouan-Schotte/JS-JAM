class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 1000; // Ajout de la variable health avec une valeur initiale de 100
        this.maxhealth = 1000; // Ajout de la variable health avec une valeur initiale de 100
        this.isDead = false;
        this.damage = 10
    }

    display() {
        if(!this.isDead) {
            fill(0, 0, 255);
            ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize, tileSize);
        }
    }

    move(dx, dy, movementType) {
        // Vérifie si le déplacement est valide
        let newX = this.x + dx;
        let newY = this.y + dy;

        // Limite les mouvements à l'intérieur de la zone de jeu
        newX = constrain(newX, 0, mapData.width - 1);
        newY = constrain(newY, 0, mapData.height - 1);
        if (this.isValidMove(newX, newY, movementType)) {
            this.x = newX;
            this.y = newY;
        }
    }

    isValidMove(x, y, movementType) {
        // Vérifie si la position (x, y) est valide sur la carte pour le monstre
        // Ici, vous devez vérifier si la position correspond à une case vide sur la couche de collision
        let index;
        switch (movementType){
            case "r":
                index = Math.round(x + 0.5) + Math.round(y) * mapData.width;
                break;
            case "l":
                index = Math.round(x - 0.5) + Math.round(y) * mapData.width;
                break;
            case "u":
                index = Math.round(x) + Math.round(y - 0.5) * mapData.width;
                break;
            case "d":
                index = Math.round(x) + Math.round(y + 0.5) * mapData.width;
                break;
        }
        let tile = mapData.layers[0].data[index];
        return tile === 0; // Renvoie true si la case est vide, sinon false
    }

    displayHealthBar() {
        if(!this.isDead) {
            // Dessiner la barre de vie
            let barWidth = this.maxhealth;
            let barHeight = 20;
            let x = 10 + (1100 - this.maxhealth)/2; // Position X de la barre de vie sur l'HUD
            let y = 772; // Position Y de la barre de vie sur l'HUD

            // Dessiner le contour de la barre de vie
            noFill();
            stroke(255);
            rect(x, y, barWidth, barHeight);

            // Dessiner la barre de vie remplie en fonction de la santé actuelle du joueur
            let healthWidth = map(this.health, 0,  this.maxhealth, 0, barWidth); // Mapping de la santé actuelle à la largeur de la barre
            fill(0, 255, 0);
            noStroke();
            rect(x, y, healthWidth, barHeight);
        }

    }



    death() {
        this.isDead = true;
        gameState = "gameOver"
    }
    takeDamage(damage) {
        // Enlever des points de vie
        this.health -= damage;
        if (this.health <= 0) {
            this.death()
        }
    }

    heal(amount) {
        // Soigner le joueur en ajoutant des points de vie
        this.health += amount;
        if (this.health > this.maxhealth) {
            this.health = this.maxhealth; // Limiter la santé maximale
        }
    }
}
