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
    constructor(name,  health, level, experience,  souls, classe, pouvoir, position) {
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
    }//encas plus 

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
}
   //  attaque normale
   normalAttack(enemy) {
    const damage = this.equippedItem.damage;
    enemy.health -= damage;
    
    
};

// attaque spéciale
specialAttack(enemy) {
    const damage = 10;
    enemy.health -= damage;
   
};

//  attaque ultime
ultimateAttack(enemy) {
    const damage = 50;
    enemy.health -= damage;
    const chance = Math.random(); // Génère un nombre aléatoire entre 0 et 1
        let damage;
        let message;

        if (chance < 0.3) { // 30% de chance d'utiliser une attaque normale
            damage = this.equippedItem.damage;
            message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}.`;
        } else if (chance < 0.7) { // 40% de chance d'utiliser une attaque spéciale avec moins de dégâts
            damage = 10;
            enemy.health -= 5; // -5 HP pour utiliser l'attaque spéciale
            message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}. You took 5 points of damage due to the strain of the attack.`;
        } else { // 30% de chance d'utiliser une attaque spéciale avec plus de dégâts
            damage = 20;
            enemy.health -= 10; // -10 HP pour utiliser l'attaque spéciale
            message = `Ultimate Attack: You inflicted ${damage} points of damage to ${enemy.name}. You took 10 points of damage due to the strain of the attack.`;
        }

        enemy.health -= damage; // Applique les dégâts à l'ennemi
        return message;
    
};

//  attaque normale avec soin
healAttack(enemy) {
    const damage = 35;
    enemy.health += damage;
    
};




class Enemy {
    constructor(name, health, damage) {
        this.name = name;
        this.health = health;
        this.damage = damage;
    }
}

