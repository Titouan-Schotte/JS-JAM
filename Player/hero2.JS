const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 800 ;
canvas.height = 700;
 c.fillRect(10,0,canvas.width,canvas.height)


const gravity = 0.2 
class Sprite {
    constructor({position, velocity}){
        this.position = position 
        this.velocity = velocity 
        this.height = 150 

    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect( this.position.x, this.position.y, 50,this.height )
    }
    update() {
        this.draw( );

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height  >= canvas.height ){
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }
}
const Player = new Sprite({
    position: { 
    x:0,
    y:0
},
    velocity:{
        x : 0 ,
        y : 10
    }
})

const enemy = new Sprite ({
    position: { 
        x:400,
        y:100
    },
        velocity:{
            x : 0 ,
            y : 0
        }
})


console.log(Player)
const key ={
    a:{
        pressed :false
    },
    d: {
        pressed : false
    },
    w:{
        pressed : false
    }

}
let laskey 
function Animation(){
    window.requestAnimationFrame(Animation);
    c.fillStyle = "black"
   // c.fillStyle = "rgba(255,255,255,0.3)"
    c.fillRect(0,0,canvas.width, canvas.height) ;
    Player.update();
    enemy.update();
    Player.velocity.x = 0
    //player mouvement
    if(key.a.pressed  && laskey ==='a'){
     Player.velocity.x=-4
    }else if (key.d.pressed && laskey ==='d'){
        Player.velocity.x=4
    }
    //enemie mouvement
    if(key.a.pressed  && laskey ==='a'){
        Player.velocity.x=-4
       }else if (key.d.pressed && laskey ==='d'){
           Player.velocity.x=4
       }
}
Animation()
//ici ou le code va lire les key
//qu'on va taper pour avoir le mouvement et les attack
window.addEventListener('keydown', (event) =>{
    console.log(event.key);
    switch (event.key){
    case 'd':
        key.d.pressed = true;
        laskey ='d'
        break;
        case 'a':
        key.a.pressed=true;
        laskey='a';
        break;
        case 'w':
        Player.velocity.y = -10;
        //laskey='w';
        break;

        case 'ArrowRight':
            key.ArrowR.pressed = true;
            enemy.laskey = 'ArrowRight'
            
            break;
            case 'ArrowLeft':
            key.a.pressed=true;
            enemy.laskey='ArrowLeft';
            break;
            case 'ArrowUP':
            enemy.velocity.y = -10;
            //laskey='w';
            break;
    }
    
        console.log(event.key)
})
window.addEventListener('keyup', (event) =>{
    switch (event.key){
    case 'd':
        key.d.pressed = false;
        break;
        case 'a':
        key.a.pressed=false;
        break;
        case 'w':
        key.w.presse = false;
        
        break;

        //enemey key 
        switch(event.key){
        case 'ArrowRight':
        key.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
        key.ArrowRLeft.pressed=false;
        break;
        case 'ArrowUP':
        key.w.presse = false;
        
        break;
    }
    }
        console.log(event.key)
})