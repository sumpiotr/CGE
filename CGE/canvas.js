import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector2.js";

class Canvas {
    #canvas;
    #viewPosition = new Vector2(0, 0);

    constructor() {
        this.#canvas = document.querySelector("canvas");
        this.context = this.#canvas.getContext("2d");

        this.context.canvas.width = 550;
        this.context.canvas.height = 600;

    }

    clearView() {
        this.context.clearRect(this.#viewPosition.x, this.#viewPosition.y, this.context.canvas.width, this.context.canvas.height);
    }

    drawSprite(sprite) {
        if (!sprite instanceof Sprite) return;
        if(sprite.getRotation() != 0)
        {
            this.#drawRotadedSprite(sprite);
        }
        else
        {
            this.context.drawImage(sprite.getImage(), sprite.offsetX, sprite.offsetY, sprite.offsetWidth, sprite.offsetHeight, sprite.getPosition().x + this.#viewPosition.x, sprite.getPosition().y + this.#viewPosition.y, sprite.getSize().x, sprite.getSize().y);
        }
       
    }

    #drawRotadedSprite(sprite)
    {
        // save the current co-ordinate system 
        // before we screw with it
        this.context.save(); 

        // move to the middle of where we want to draw our image
        this.context.translate(sprite.getCenterPosition().x + this.#viewPosition.x, sprite.getCenterPosition().y + this.#viewPosition.y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        this.context.rotate(sprite.getRotation() * Math.PI/180);

        // draw it up and to the left by half the width
        // and height of the image 
        this.context.drawImage(sprite.getImage(), -(sprite.getImage().width/2), -(sprite.getImage().height/2), sprite.getSize().x, sprite.getSize().y);

        // and restore the co-ords to how they were when we began
        this.context.restore(); 
    }

    setViewPosition()
    {
        if(arguments.length == 1)
        {
            if(!arguments[0] instanceof Vector2)throw "Wrong type of argument in canvas.setViewPosition()";
            this.#viewPosition = arguments[0];
        }
        else if(arguments.length == 2)
        {
            this.#viewPosition = new Vector2(arguments[0], arguments[1]);
        }
    }

    moveView()
    {
        if(arguments.length == 1)
        {
            if(!arguments[0] instanceof Vector2)throw "Wrong type of argument in canvas.setViewPosition()";
            this.#viewPosition.add(arguments[0]);
        }
        else if(arguments.length == 2)
        {
            this.#viewPosition.add(new Vector2(arguments[0], arguments[1]));
        }
    }

    changeResponsiveness(isResponsive)
    {
        isResponsive ?  this.#canvas.style = "width: 100%; height: 100%" : this.#canvas.style = "";      
    }
}

export let canvas = new Canvas();
