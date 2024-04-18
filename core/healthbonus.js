let healthbonusarray = []
let healthbonusimage;
let healthMobCountBeforeSpawning = 30
let healthMobCountBeforeSpawningRef = 30
class HealthBonus {
    constructor(x, y)  {
        this.isUsed = false
        this.x = x;
        this.y = y;
        this.grabRange = 1
    }

    useBonus(i){
        player.health = player.maxhealth
        this.isUsed = true
        healthbonusarray.splice(i, 1);
    }

    chechIfPlayerIsOn(){
        if(this.heuristic(player.x, player.y, this.x, this.y) < this.grabRange){
            return true
        }
        return false
    }
    display() {
        if (!this.isUsed){
            fill(255, 0, 0);
            image(healthbonusimage, this.x*32, this.y*32);
        }
    }

    heuristic(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}