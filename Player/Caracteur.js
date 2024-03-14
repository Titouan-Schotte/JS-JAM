class Item {
    constructor(name, damage, heal, lifesteal, lifeloose, energyCost) {
        this.name = name;
        this.damage = damage;
        this.heal = heal;
        this.lifesteal = lifesteal;
        this.lifeloose = lifeloose;
        this.energyCost = energyCost;
    }
}

class Spell {
    constructor(name, damage, manaCost) {
        this.name = name;
        this.damage = damage;
        this.manaCost = manaCost;
    }
}

class SpellInventory {
    constructor() {
        this.spells = [];
    }

    addSpell(spell) {
        this.spells.push(spell);
    }
}

class Inventory {
    constructor() {
        this.items = [];
    }

    addToInventory(item) {
        this.items.push(item);
    }
}

class Player {
    constructor(name, health, level, experience, souls, classe, pouvoir, position) {
        this.name = name;
        this.health = health;
        this.level = level;
        this.experience = experience;
        this.souls = souls;
        this.classe = classe;
        this.pouvoir = pouvoir;
        this.position = position;
        this.inventory = new Inventory();
        this.spellInventory = new SpellInventory();
        this.equippedItem = null;
    }

    addToInventory(item) {
        this.inventory.addToInventory(item);
    }

    addSpell(spell) {
        this.spellInventory.addSpell(spell);
    }

    equipItem(item) {
        this.equippedItem = item;
    }

    useObject(item) {
        this.health += item.heal;
        if (this.health > 100) {
            this.health = 100;
        }

        const index = this.inventory.items.findIndex(inventoryItem => inventoryItem === item);
        if (index !== -1) {
            this.inventory.items.splice(index, 1);
        }
    }
    levelUP() {
        // he need 25 souls to level up his level
        if  (this.souls >= 25) {
            this.level++;
            this.heal +=50 ;// evry level  add +50 health will change this after
            this.attackPower+=4;//evry level add +4 attack power this's also will change
            this.defensePower+=1;//every level add +1 defense power
            this.lifesteal +=5;//evry  level add +5 lifesteal, it means that when the player give damages to an enemy 
            //he will heal hoimsealf with  5 hp
            this.souls -=25 ;//
        } else {
            console.log("You don't have enough souls!");
        }
}

    // Méthode pour attaque normale
    normalAttack(enemy) {
        const damage = this.equippedItem.damage;
        enemy.health -= damage;
    }

    // Méthode pour attaque spéciale
    specialAttack(enemy) {
        const damage = 10;
        enemy.health -= damage;
    }

    // Méthode pour attaque ultime
    ultimateAttack(enemy) {
        const damage = 50;
        enemy.health -= damage;
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

        enemy.health -= damage;
        return message;
    }

    // Méthode pour attaque normale avec soin
    healAttack(enemy) {
        const damage = 35;
        enemy.health += damage;
    }
}





class Enemy {
    constructor(name, health, damage) {
        this.name = name;
        this.health = health;
        this.damage = damage;
    }
}

class boss {

}