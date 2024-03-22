
let player;
let monsters = [];
let projectilesIn = []; // Liste des projectiles en cours
let tileSize = 32;
let playerSpeed = 0.1; // Vitesse de déplacement du joueur
let waveNumber = 0;
let monstersPerWave = 1;
let monstersSpawned = 0;
let monstersAlive = 0;

let layer = [];
let layerImages = [];
var tiledmap;

function preload() {
  tiledmap = loadTiledMap("map1", "core");
}

function generateRandomMonsterPosition() {
  let x, y;
  do {
    x = Math.floor(Math.random() * mapData.width);
    y = Math.floor(Math.random() * mapData.height);
  } while (mapData.layers[0].data[x + y * mapData.width] !== 0); // Vérifier que la position est libre (pas un obstacle)
  return { x: x, y: y };
}

function createNewMonsterWave(numMonsters) {
  for (let i = 0; i < numMonsters; i++) {
    let position = generateRandomMonsterPosition();
    monsters.push(new RangedMonster(position.x, position.y));
  }
  monstersSpawned += numMonsters;
  monstersAlive = numMonsters;
  waveNumber++;
}

function setup() {
  createCanvas(mapData.width * tileSize, mapData.height * tileSize);
  player = new Player(3, 3); // Position initiale du joueur (0, 0) à modifier selon votre carte0
  createNewMonsterWave(monstersPerWave);
  frameRate(60); // Définit le nombre de frames par seconde (FPS)

  layer = getTilemapLayers(tiledmap);
  layerImages = getTilemapImages(tiledmap);
}



function draw() {
  player.draw();
  document.addEventListener("mousedown", function (event) {
    mouseClick();
  });
  window.addEventListener("keydown", (event) => {
    // what the problem ?
    const key = event.key;

    switch (key) {
      case "a":
        
        console.log("wowowwowowow");
        // Player.normalAttack(Monster);
        
        let projectile = new Projectile(
          
          player.x,
          player.y,
          player.getClosestMonster().x,
          player.getClosestMonster().y,
          player.getClosestMonster(),
          50,
          50,
          50
          
        );
        projectilesIn.push(projectile); // Ajouter le projectile à la liste globale des projectiles
        break;
      case "z":
        Player.specialAttack(monster);
        break;
      case "e":
        Player.ultimateAttack(monster);
        break;
      // ...
    }
  });

  // bullet atack
  function mouseClick() {
    console.log("mouseClick");
    player.shoot();
  }
  background(255);
  image(layerImages[0], 0, 0);
  image(layerImages[1], 0, 0);
  // Dessiner le joueur
  player.display();

  // Déplacer le joueur en fonction des touches enfoncées
  if (keyIsDown(LEFT_ARROW)) {
    player.move(-playerSpeed, 0, "l");
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.move(playerSpeed, 0, "r");
  }
  if (keyIsDown(UP_ARROW)) {
    player.move(0, -playerSpeed, "u");
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, playerSpeed, "d");
  }

  // Vérifier si tous les monstres sont morts
  if (monstersAlive === 0) {
    if (monstersPerWave < 20) {
      monstersPerWave += 1;
    }
    createNewMonsterWave(monstersPerWave);
  }
  for (let i = projectilesIn.length - 1; i >= 0; i--) {
    let projectile = projectilesIn[i];
    projectile.display();
  }
  if (frameCount % 20 === 0) {
    // Déplacer les monstres à intervalles réguliers
    let monstersBuff = [];
    for (let monster of monsters) {
      // trouver le monstre le plus
      // check if this monster is closest
      player.setClosestMonster(monster);
      // Calculer le nouveau chemin du monstre
      monster.findShortestPath();
      monster.move();
      //monster.takeDamage(10)
      // Dessiner le monstre
      monster.display();
      // Vérifier si le monstre est mort
      if (monster.isDead) {
        monstersAlive--;
      } else {
        monstersBuff.push(monster);
      }
    }
    monsters = monstersBuff;

    // Rafraîchir les projectiles
    for (let i = projectilesIn.length - 1; i >= 0; i--) {
      console.log(projectilesIn.length);
      let projectile = projectilesIn[i];
      if (projectile.advance()) {
        // Si le projectile atteint sa cible, le retirer de la liste
        projectilesIn.splice(i, 1);
      }
      projectile.display();
    }
  } else {
    // Dessiner les monstres
    for (let monster of monsters) {
      // Dessiner le monstre
      monster.display();
    }
    for (let i = projectilesIn.length - 1; i >= 0; i--) {
      let projectile = projectilesIn[i];
      projectile.display();
    }
  }

  // Afficher le numéro de la vague
  textSize(20);
  fill(0);
  text("Vague : " + waveNumber, 10, 30);

  // Afficher la barre de santé du joueur
  player.displayHealthBar();
}
