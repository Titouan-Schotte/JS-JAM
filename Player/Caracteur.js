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
    constructor(name, petName, health, level, experience, mana, energy, money, classe, pouvoir, position) {
        this.name = name;
        this.petName = petName;
        this.health = health;
        this.level = level;
        this.experience = experience;
        this.mana = mana;
        this.energy = energy;
        this.money = money;
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
}

class Enemy {
    constructor(name, health, damage) {
        this.name = name;
        this.health = health;
        this.damage = damage;
    }
}
