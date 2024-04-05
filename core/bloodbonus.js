let bloodbonus = []
let bloodImage;
let bloodcount = 0;
class BloodBonus {
    constructor(x, y)  {
        this.isUsed = false
        this.x = x;
        this.y = y;
        this.grabRange = 1
        bloodcount++
    }

    useBonus(i){
        player.maxhealth *= 0.99
        if(player.health > player.maxhealth){
            player.health = player.maxhealth
        }
        player.damage += 1
        player.heal(player.health*0.01)
        this.isUsed = true
        bloodbonus.splice(i, 1);
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
            image(bloodImage, this.x*32, this.y*32);
        }
    }

    heuristic(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}