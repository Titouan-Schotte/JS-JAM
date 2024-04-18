let player;
let monsters = [];
let projectilesIn = []; // Liste des projectiles en cours
let tileSize = 32;
let playerSpeed = 0.1; // Vitesse de déplacement du joueur
let waveNumber = 0;
let monstersPerWave = 3;
let monstersSpawned = 0;
let monstersAlive = 0;
let frameCount = 0;
let currentFrame = 0;
let newFrameCount = 0;
let numFrameImages = 8;


let layer = [];
let layerImages = [];
let tiledmap;

let gameState = "start"; // États possibles: "start", "playing", "gameOver"

function preload() {
    tiledmap = loadTiledMap("map1", "core");
    //Load Images Monster
    for (let i = 0; i < numFrameImages; i++) {
        monsterRangeImages[i]  = loadImage("assets/monster/slime" + (i+1) + ".png");
        reverseMonsterImages[i] = loadImage("assets/monster/reverseslime"+(i+1) + ".png");
        playerImages[i] = loadImage("assets/player/player"+(i+1) + ".png");
        reversePlayerImages[i] = loadImage("assets/player/reverseplayer"+(i+1) + ".png");
    }

    //Load image Blood
    bloodImage = loadImage('assets/black-blood.png');

    //Load image Instant Kill
    instantkillimage = loadImage('assets/instant-kill.png');

    //Load image Nuclear Bomb
    nuclearbombimage = loadImage('assets/nuclear-bomb.png');

    //Load image Health Bonus
    healthbonusimage = loadImage('assets/health.png');
}

function setup() {
    createCanvas(mapData.width * tileSize, mapData.height * tileSize);
    frameRate(60); // Définit le nombre de frames par seconde (FPS)


    //launch bonus instant kill cooldown
    setInterval(function (){
        for (let i = instantkillbonus.length - 1; i >= 0; i--) {
            b = instantkillbonus[i]
            if(b.isUsed){
                b.cool(i)
            }
        }
    }, 1000)
}

function draw() {
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        runGame();
    } else if (gameState === "gameOver") {
        drawGameOverScreen();
    }
}

function drawGameOverScreen() {
    background(0); // Fond noir
    fill(255); // Texte blanc
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(16);
    text("Press ENTER to Restart", width / 2, height / 2 + 20);
}

function drawStartScreen() {
    background(0); // Fond noir
    fill(255); // Texte blanc
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press ENTER to Start", width / 2, height / 2);
}

function keyPressed() {
    if (keyCode === ENTER && gameState === "start") {
        gameState = "playing";
        initializeGame();
    } else if (keyCode === ENTER && gameState === "gameOver") {
        location.reload()
    }
}

function initializeGame() {
    // Initialisation du jeu
    layer = getTilemapLayers(tiledmap);
    layerImages = getTilemapImages(tiledmap);
    player = new Player(3, 3); // Initialisez le joueur
    monsters = [];
    nuclearbombbonus = [];
    instantkillbonus = [];
    bloodbonus = [];
    waveNumber = 0;
    monstersPerWave = 1;
    monstersSpawned = 0;
    monstersAlive = 0;

    createNewMonsterWave(monstersPerWave);
}

function runGame() {

    if(frameCount%7 == 0){
        currentFrame = frameCount % numFrameImages;
    }

    //Player Attack
    if(isMousePressed){
        let currentTime = millis(); // Obtenir le temps actuel en millisecondes

        // Vérifier si le cooldown est écoulé
        if (currentTime - lastAttackTime > attackCooldown) {
            // Réinitialiser le temps du dernier coup
            lastAttackTime = currentTime;

            // Effectuer l'attaque du joueur
            if (mouseButton === LEFT) {
                console.log(mouseX / tileSize, mouseY / tileSize);
                player.attack(mouseX / tileSize, mouseY / tileSize);
            }
        }
    }

    if (monsters.length == 0) {
        if (monstersPerWave < 20) {
            monstersPerWave += 1;
        }
        createNewMonsterWave(monstersPerWave);
    }
    frameCount++;
    background(255); // Définit un fond blanc pour le jeu
    image(layerImages[0], 0, 0); // Dessine la première couche de la carte
    image(layerImages[1], 0, 0); // Dessine la seconde couche de la carte

    // Dessiner le joueur
    player.display();

    // Déplacer le joueur en fonction des touches enfoncées
    if (keyIsDown(LEFT_ARROW)) {
        player.move(-playerSpeed, 0, "l");
        lookLeft();
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.move(playerSpeed, 0, "r");
        lookRight();
    }
    if (keyIsDown(UP_ARROW)) {
        player.move(0, -playerSpeed, "u");
    } else if (keyIsDown(DOWN_ARROW)) {
        player.move(0, playerSpeed, "d");
    }
    // Vérifier si tous les monstres sont morts


    // Déplacer les monstres à intervalles réguliers
    let monstersBuff = [];
    for (let monster of monsters) {
        if(frameCount%monster.refreshFrame == 0){
            // Calculer le nouveau chemin du monstre
            monster.findShortestPath();
            monster.move();

            // Dessiner le monstre
            monster.display();
            // Vérifier si le monstre est mort
            if (monster.isDead) {
                monstersAlive--;
            } else {
                monstersBuff.push(monster);
            }
        } else {
            monster.display();
            monstersBuff.push(monster);

        }

    }
    monsters = monstersBuff;

    // Rafraîchir les projectiles
    if(frameCount%monstersBuff.length*40 == 0){
        for (let i = projectilesIn.length - 1; i >= 0; i--) {
            let projectile = projectilesIn[i];
            projectile.speed = 0.2 / monstersBuff.length
            if (projectile.advance() || isValidMoveForProjectiles(projectile.x, projectile.y)) {
                // Si le projectile atteint sa cible, le retirer de la liste
                projectilesIn.splice(i, 1);
            }
            projectile.display()
        }
    } else {
        for (let i = projectilesIn.length - 1; i >= 0; i--) {

            let projectile = projectilesIn[i];
            projectile.display()
        }
    }

    //Afficher les bonus blood
    for (let i = bloodbonus.length - 1; i >= 0; i--) {
        let b = bloodbonus[i];
        if(b.chechIfPlayerIsOn()){
            b.useBonus(i)
            return
        }
        b.display()
    }

    //Afficher Instant kill

    for (let i = instantkillbonus.length - 1; i >= 0; i--) {
        let b = instantkillbonus[i];
        if(b.chechIfPlayerIsOn()){
            b.useBonus(i)
        }

        b.display()
    }
    //Afficher Nuclear Bomb

    for (let i = nuclearbombbonus.length - 1; i >= 0; i--) {
        let b = nuclearbombbonus[i];
        if(b.chechIfPlayerIsOn()){
            b.useBonus(i)
        }

        b.display()
    }

    //Afficher Health Bonus

    for (let i = healthbonusarray.length - 1; i >= 0; i--) {
        let b = healthbonusarray[i];
        if(b.chechIfPlayerIsOn()){
            b.useBonus(i)
        }

        b.display()
    }

    // Afficher des informations comme le numéro de la vague et la barre de santé du joueur
    displayGameInfo();
}



function displayGameInfo() {
    // Afficher le numéro de la vague
    textSize(20);
    fill(255); // Couleur du texte en noir pour une meilleure visibilité
    text("Vague " + waveNumber, 25, 18);

    if(isInstantKill){
        image(instantkillimage, 500, 1);
        text(": "+instantKillCoolCurrent, 540, 18);
    }


    image(bloodImage, 1002, -2)
    text(": "+ bloodcount, 1040, 18);


    // Afficher la barre de santé du joueur
    player.displayHealthBar();
}


function generateRandomMonsterPosition() {
    let x, y;
    do {
        x = Math.floor(Math.random() * mapData.width);
        y = Math.floor(Math.random() * mapData.height);
    } while (mapData.layers[0].data[x + y * mapData.width] !== 0);
    return { x: x, y: y };
}

function createNewMonsterWave(numMonsters) {
    for (let i = 0; i < numMonsters+1; i++) {
        let position = generateRandomMonsterPosition();
        monsters.push(new RangedMonster(position.x, position.y));
    }
    if(waveNumber%5==0){
        for (let i = 0; i < Math.round(waveNumber/5); i++) {
            let position = generateRandomMonsterPosition();
            monsters.push(new MonsterBossCAC(position.x, position.y));
        }
    }
    if(waveNumber%2==0){
        for (let i = 0; i < Math.round(waveNumber/2); i++) {
            let position = generateRandomMonsterPosition();
            monsters.push(new RangedBossMonster(position.x, position.y));
        }
    }


    if(attackCooldownRangedMob >= 1 && waveNumber%2==0){
        attackCooldownRangedMob--
    }
    console.log(monsters)
    monstersSpawned += numMonsters;
    monstersAlive = numMonsters;
    waveNumber++;
}

function isValidMove(x, y) {
    let index = Math.round(x) + Math.round(y) * mapData.width;
    let tile = mapData.layers[0].data[index];
    return tile === 0;
}

function isValidMoveForProjectiles(x, y) {
    let index = Math.round(x) + Math.round(y) * mapData.width;
    let tile = mapData.layers[0].data[index];
    return tile === 0 || tile === 1;
}
