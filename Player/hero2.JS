const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 700 ;
canvas.height = 895;
 c.fillRect(30,10,canvas.width,canvas.height)



class Sprite {
    constructor(position){
        this.position = position ;

    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect( this.position.x, this.position.y, 50 ,150)
    }
}
const Player = new Sprite({
    x:0,
    y:0
})