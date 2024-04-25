let instantkillbonus = []
let instantkillimage;
let isInstantKill = false;
let instantKillCoolCurrent = 0
let instantKillCoolObjective = 20
let instantkillMobCountBeforeSpawning = 60
let instantkillMobCountBeforeSpawningRef = 60
class InstantKillBonus {
    constructor(x, y)  {
        this.isUsed = false
        this.x = x;
        this.y = y;
        this.grabRange = 1
    }

    useBonus(){
        this.isUsed = true

        isInstantKill = true
        instantKillCoolCurrent = instantKillCoolObjective
    }

    cool(i){
        instantKillCoolCurrent--
        console.log(instantKillCoolCurrent)
        if(0 >= instantKillCoolCurrent){
            isInstantKill = false
            instantkillbonus.splice(i, 1)
            console.log("Finish !")
        }
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
            image(instantkillimage, this.x*32, this.y*32);
        }
    }

    heuristic(x1, y1, x2, y2) {
        // Heuristique de distance de Manhattan
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}