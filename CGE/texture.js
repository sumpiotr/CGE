import { Vector2 } from "./vector2.js";
import { Utils } from "./utils.js";

export class Texture 
{
    #image;
    #position;
    #width;
    #height;
    #rotation = 0;

    async init(width, height, imageSrc, x = 0, y = 0, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        this.#width = width;
        this.#height = height;
        this.#image = new Image(width, height);
        this.#position = new Vector2(x, y);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        await this.setTextureFromFile(imageSrc, offsetX, offsetY, offsetWidth, offsetHeight);
    }

    async setTextureFromFile(textureSrc, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        await Utils.loadImage(this.#image, textureSrc);
        this.offsetWidth = offsetWidth == 0 ? this.#image.naturalWidth : offsetWidth;
        this.offsetHeight = offsetHeight == 0 ? this.#image.naturalHeight : offsetHeight;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }


    getPosition() {
        return this.#position;
    }

    setPosition() {
        if(arguments.length == 1)
        {
            if (!arguments[0] instanceof Vector2) return;
            this.#position = arguments[0];
        }
        else if(arguments.length == 2)
        {
            this.#position = new Vector2(arguments[0], arguments[1]);
        }
    }

    getSize() {
        return new Vector2(this.#width, this.#height);
    }

    setSize()
    {
        if(arguments.length == 1)
        {          
            if(!arguments[0] instanceof Vector2)return;
            this.#width = arguments[0].x;
            this.#height = arguments[0].y;
        }
        else if(arguments.length == 2)
        {
            this.#width = arguments[0];
            this.#height = arguments[1];
        }
    }

    setScale(scale) {
        if(scale instanceof Vector2)
        {
            this.#width *= scale.x;
            this.#height *= scale.y;
        }
        else
        {
            this.#width *= scale;
            this.#height *= scale;
        }
    }

  

    getImage() {
        return this.#image;
    }

    getCenterPosition()
    {
        let centerPosition = new Vector2(0 ,0);
        centerPosition.x = this.#position.x + this.#width/2;
        centerPosition.y = this.#position.y + this.#height/2;
        return centerPosition;
    }

    getRotation()
    {
        return this.#rotation;
    }

    setRotation(degrees)
    {
        this.#rotation = degrees;
    }

    rotate(degrees)
    {
        this.#rotation += degrees;
        if(this.#rotation > 360 || this.#rotation < -360)this.#rotation = 0;
    }
}