let projectileSize = 10
let lastAttackTime = 0; // Variable pour stocker le temps du dernier coup
let attackCooldown = 800; // Cooldown entre chaque attaque en millisecondes

let reversePlayerImages = [];
let playerImages = [];

let isLookingLeft = false;
let isLookingRight = true;

function lookRight() {
    isLookingRight = true;
    isLookingLeft = false;
}

function lookLeft() {
    isLookingLeft = true;
    isLookingRight = false;
}

let isMousePressed = false;
function mousePressed() {
    isMousePressed = true;
}

function mouseReleased() {
    isMousePressed = false;
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 1000; // Ajout de la variable health avec une valeur initiale de 100
        this.maxhealth = 1000; // Ajout de la variable health avec une valeur initiale de 100
        this.isDead = false;
        this.damage = 10

        this.projectileSpeed = 0.1; // Vitesse du projectile
        this.projectileDamage = 50; // Dégâts infligés par le projectile
        this.projectileMinDistance = 0.7*projectileSize/10; // Distance minimale pour infliger des dégâts
        this.attackCooldown = 2; // Cooldown entre chaque attaque (en frames)
        this.currentCooldown = 0; // Cooldown actuel
    }

    display() {
        if(!this.isDead) {
            fill(0, 0, 255);
            // ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize, tileSize);
             if (isLookingRight) {
                image(playerImages[currentFrame], this.x*32, this.y*32, 36, 44);
            } else if (isLookingLeft) {
                image(reversePlayerImages[currentFrame], this.x*32, this.y*32, 36, 44);
            }

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

    attack(mouseX, mouseY){
        let projectile = new ProjectilePlayer(this.x, this.y, mouseX, mouseY, this.projectileMinDistance, this.projectileSpeed, this.projectileDamage);
        projectilesIn.push(projectile); // Ajouter le projectile à la liste globale des projectiles
    }

}



class ProjectilePlayer {
    constructor(originX, originY, targetX, targetY, minDistance, speed, damage) {
        this.baseOriginX = originX;
        this.baseOriginY = originY;
        this.originY = originY;
        this.originX = originX;
        this.originY = originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.minDistance = minDistance;
        this.speed = speed;
        this.damage = damage;
        this.reachedTarget = false; // Indique si le projectile a atteint sa cible

    }

// Méthode pour faire avancer le projectile vers sa cible
    advance() {
        let dx = this.targetX - this.baseOriginX;
        let dy = this.targetY - this.baseOriginY;
        let distance = Math.sqrt(dx * dx + dy * dy);


        for (let monster of monsters) {

            let dxWithPlayer = this.originX - monster.x;
            let dyWithPlayer = this.originY - monster.y;

            let distanceWithPlayer  = Math.sqrt(dxWithPlayer * dxWithPlayer + dyWithPlayer * dyWithPlayer);


            // Si la distance est inférieure à la distance minimale, infliger des dégâts au joueur
            if (distanceWithPlayer < this.minDistance ) {
                monster.takeDamage(this.damage);
                this.reachedTarget = true; // Indique que le projectile a atteint sa cible
                return true; // Indique que le projectile a atteint sa cible
            }
        }



        // Avancer le projectile selon sa vitesse
        let ratio = this.speed / distance;
        this.originX += dx * ratio;
        this.originY += dy * ratio;
        if (!isValidMoveForProjectiles(this.originX, this.originY)) {
            this.reachedTarget = true; // Indique que le projectile a atteint sa cible
            return true; // Indique que le projectile a atteint sa cible
        }

        return false; // Indique que le projectile n'a pas encore atteint sa cible
    }



    display() {
        // Convertir les coordonnées du projectile en coordonnées du canevas
        let displayX = this.originX * tileSize + tileSize / 2;
        let displayY = this.originY * tileSize + tileSize / 2;

        // Dessiner le projectile
        fill(255, 255, 0);
        ellipse(displayX, displayY, projectileSize, projectileSize);

    }
}