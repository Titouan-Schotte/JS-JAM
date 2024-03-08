const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 800 ;
canvas.height = 1025;
 c.fillRect(10,0,canvas.width,canvas.height)



class Sprite {
    constructor(position){
        this.position = position ;

    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect( this.position.x, this.position.y, 50,150)
    }
}
const Player = new Sprite({
    x:0,
    y:0
})
Player.draw()

console.log(Player)
function Animation(){
    window.requestAnimationFrame(move);
    console.log("moving")
}
Animation()