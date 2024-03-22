// import "Bullet.js";
class Player {
  constructor(x, y,pos,angle,bullets, name, level, souls, classe, pouvoir, position) {
    this.x = x;
    this.y = y;
    this.health = 100; // Ajout de la variable health avec une valeur initiale de 100
    this.isDead = false;
    this.name = name;

    this.level = level;

    this.souls = souls;
    this.classe = classe;
    this.pouvoir = pouvoir;
    this.position = position;
    this.ClosestMonster = null;

    this.equippedItem = null;
    //for the bullet 
    this.pos = createVector(width/2 , height /2)
    this.angle =0 ;
    this.bullets = [];


    //RANGED
    this.projectileSpeed = 0.1; // Vitesse du projectile
    this.projectileDamage = 5; // Dégâts infligés par le projectile
    this.projectileMinDistance = 0.5; // Distance minimale pour infliger des dégâts
    this.attackCooldown = 5; // Cooldown entre chaque attaque (en frames)
    this.currentCooldown = 0; // Cooldown actuel
  }
  setClosestMonster(monster) {
    this.ClosestMonster = monster;
  }
  getClosestMonster()
  {
    return this.ClosestMonster;
  }
  equipItem(item) {
    this.equippedItem = item;
  }

  useObject(item) {
    this.health += item.heal;
    if (this.health > 100) {
      this.health = 100;
    }

    const index = this.inventory.items.findIndex(
      (inventoryItem) => inventoryItem === item
    );
    if (index !== -1) {
      this.inventory.items.splice(index, 1);
    }
  }
  levelUP() {
    let soulsRequired = 0;

    if (this.level >= 1 && this.level <= 10) {
      //  Level 1-10: +25
      soulsRequired = 25 + (this.level - 1) * 2;
    } else if (this.level > 10 && this.level <= 15) {
      soulsRequired = 45 + (this.level - 11) * 5;
    } else if (this.level > 15 && this.level <= 25) {
      soulsRequired = 95 + (this.level - 16) * 10;
    }

    if (this.souls >= soulsRequired) {
      this.level++;
      this.heal += 50; // evry level  add +50 health will change this after
      this.attackPower += 4; //evry level add +4 attack power this's also will change
      this.defensePower += 1; //every level add +1 defense power
      this.lifesteal += 5; //evry  level add +5 lifesteal, it means that when the player give damages to an enemy
      //he will heal hoimsealf with  5 hp
      this.souls -= soulsRequired; // after levelUP souls = 0
    } else {
      console.log("You don't have enough souls!");
    }
  }
  // Projectile(originX, originY, targetX, targetY, targetObj, minDistance, speed, damage){
  //   let projectile = new Projectile(this.x, this.y, player.x, player.y, player, this.projectileMinDistance, this.projectileSpeed, this.projectileDamage);
  //   projectilesIn.push(projectile); // Ajouter le projectile à la liste globale des projectiles
  // }
  //         des attack bullet blue 
  createBlueProjectile(monster) {
    const projectile = {
      x: this.x,
      y: this.y,
      vx: (monster.x - this.x) * this.projectileSpeed,
      vy: (monster.y - this.y) * this.projectileSpeed,
      radius: 10,
      duration: 1000, // Adjust duration as needed
      draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      }
    };
    return projectile;
  }

  // Méthode pour attaque normale
  normalAttack(Monster) {
    if (this.currentCooldown <= 0) {
      let projectile = new Projectile(this.x, this.y, Monster.x, Monster.y, Monster, this.projectileMinDistance, this.projectileSpeed, this.projectileDamage);
      projectilesIn.push(projectile);
      this.currentCooldown = this.attackCooldown;
    } else {
        this.currentCooldown--;
    }
}

  // Méthode pour attaque spéciale
  specialAttack(_monster) {
    const damage = 500;
    monster.health -= damage;
  }

  // Méthode pour attaque ultime
  ultimateAttack(_monster) {
    const damage = 1000;
    monster.health -= damage;
    const chance = Math.random(); // Génère un nombre aléatoire entre 0 et 1
    let message;

    if (chance < 0.3) {
      damage = this.equippedItem.damage;
      message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}.`;
    } else if (chance < 0.7) {
      damage = 10;
      enemy.health -= 5;
      message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}. You took 5 points of damage due to the strain of the attack.`;
    } else {
      damage = 20;
      enemy.health -= 10;
      message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}. You took 10 points of damage due to the strain of the attack.`;
    }

    monster.health -= damage;
    return message;
  }

  // Méthode pour attaque normale avec soin
  healAttack(_monster) {
    const damage = 35;
    enemy.health += damage;
  }

  draw () {
    // push();
    // translate(this.x, this.y);
    // SpeechRecognitionAlternative(this.angle);
    // rect(0,0,20,20);
    // pop();
//   update() 
console.log("player draw");
    for (let bullet of this.bullets) {
        console.log("draw bullet in player");
        bullet.update();
        bullet.drawBullet();
    }
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.update();
      bullet.draw();
      
      // Remove bullets that are out of bounds
      if (bullet.isOutOfBounds()) {
          this.bullets.splice(i, 1);
          i--; // Adjust index after removing the bullet
      }
  }
}
  update() {
    // let xSpeed = 0;
    // let ySpeed = 0;
    // if (keyIsDown(65)) {
    //   xSpeed = -2;
    // }

    // if (keyIsDown(68)) {
    //   xSpeed = 2;
    // }

    // if (keyIsDown(87)) {
    //   ySpeed = -2;
    // }

    // if (keyIsDown(83)) {
    //   ySpeed = 2;
    // }
    // this.pos.add(xSpeed, ySpeed);
    this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x); // add this
  }
  shoot(){
    let shotBullet = new Bullet(this.pos.x, this.pos.y, this.angle);
    this.bullets.push(shotBullet);
}




// à remettre au cas d'erreur   }
  display() {
    if (!this.isDead) {
      fill(0, 0, 255);
      ellipse(
        this.x * tileSize + tileSize / 2,
        this.y * tileSize + tileSize / 2,
        tileSize,
        tileSize
      );
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
    switch (movementType) {
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
    if (!this.isDead) {
      // Dessiner la barre de vie
      let barWidth = 100;
      let barHeight = 10;
      let x = 10; // Position X de la barre de vie sur l'HUD
      let y = 10; // Position Y de la barre de vie sur l'HUD

      // Dessiner le contour de la barre de vie
      noFill();
      stroke(255);
      rect(x, y, barWidth, barHeight);

      // Dessiner la barre de vie remplie en fonction de la santé actuelle du joueur
      let healthWidth = map(this.health, 0, 100, 0, barWidth); // Mapping de la santé actuelle à la largeur de la barre
      fill(0, 255, 0);
      noStroke();
      rect(x, y, healthWidth, barHeight);
    }
  }

  death() {
    this.isDead = true;
  }
  takeDamage(damage) {
    // Enlever des points de vie
    this.health -= damage;
    if (this.health <= 0) {
      this.death();
    }
  }

  heal(amount) {
    // Soigner le joueur en ajoutant des points de vie
    this.health += amount;
    if (this.health > 100) {
      this.health = 100; // Limiter la santé maximale à 100
    }
  }
}
window.addEventListener("keydown", (event) => {
  // what the problem ?
  const key = event.key;

  switch (key) {
    case "a":
      console.log("wowowwowowow");
      Player.normalAttack(Monster);
      //   let projectile = new Projectile(
      //     this.x,
      //     this.y,
      //     monster.x,
      //     monster.y,
      //     monster,
      //     50,
      //     50,
      //     50
      //   );
      //   projectilesIn.push(projectile); // Ajouter le projectile à la liste globale des projectiles
      break;
    case "z":
      Player.specialAttack(monster);
      break;
    case "e":
      Player.ultimateAttack(monster);
      break;
    // ...
  }
}); // Add semicolon here
