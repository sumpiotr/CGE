import { Vector2 } from "./vector2.js";
import { Texture } from "./texture.js"

export class Sprite extends Texture {

    #internalTransparentMap;

    async init(width, height, imageSrc, x = 0, y = 0, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        super.init(width, height, imageSrc, x, y, offsetX, offsetY, offsetWidth, offsetHeight);
    }

    async setTextureFromFile(textureSrc, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        super.setTextureFromFile(textureSrc, offsetX, offsetY, offsetWidth, offsetHeight);
        this.#calculateInternalBoundary();
    }

    move() {
        if(arguments.length == 1)
        {
            if (!arguments[0] instanceof Vector2) throw "Invalid type of argument in sprite.move()";
            let newPosition = Vector2.addVectors(this.getPosition(), arguments[0]);
            this.setPosition(newPosition);
        }
        else if(arguments.length == 2)
        {
            let newPosition = new Vector2(this.getPosition().x + arguments[0], this.getPosition().y + arguments[1]);
            this.setPosition(newPosition);
        }
    }


    moveLocal()
    {
        if(arguments.length == 1)
        {
            if (!arguments[0] instanceof Vector2) throw "Invalid type of argument in sprite.move()";
            let vector = arguments[0];
            vector.rotate(this.getRotation());
            vector.add(this.getPosition());
            this.setPosition(vector);
        }
        else if(arguments.length == 2)
        {
            let vector = new Vector2(arguments[0], arguments[1]);
            vector.rotate(this.getRotation());
            vector.add(this.getPosition());
            this.setPosition(vector);
        }
    

    }

    getBoundingBox(otherSprite) {
        if(!otherSprite instanceof Sprite)throw `In sprite.collides(sprite) - wrong type of sprite`;
        let isCollision = false;
        if (this.getSize().x > otherSprite.getSize().x) {
            isCollision = (this.getPosition().x <= otherSprite.getPosition().x && this.getPosition().x + this.getSize().x >= otherSprite.getPosition().x) || (this.getPosition().x <= otherSprite.getPosition().x + otherSprite.getSize().x && this.getPosition().x + this.getSize().x >= otherSprite.getPosition().x + otherSprite.getSize().x);
        } else {
            isCollision = (otherSprite.getPosition().x <= this.getPosition().x && otherSprite.getPosition().x + otherSprite.getSize().x >= this.getPosition().x) || (otherSprite.getPosition().x <= this.getPosition().x + this.getSize().x && otherSprite.getPosition().x + otherSprite.getSize().x >= this.getPosition().x + this.getSize().x);
        }

        if (!isCollision) return;
        if (this.getSize().y > otherSprite.getSize().y) {
            return (this.getPosition().y <= otherSprite.getPosition().y && this.getPosition().y + this.getSize().y >= otherSprite.getPosition().y) || (this.getPosition().y <= otherSprite.getPosition().y + otherSprite.getSize().y && this.getPosition().y + this.getSize().y >= otherSprite.getPosition().y + otherSprite.getSize().y);
        } else {
            return (otherSprite.getPosition().y <= this.getPosition().y && otherSprite.getPosition().y + otherSprite.getSize().y >= this.getPosition().y) || (otherSprite.getPosition().y <= this.getPosition().y + this.getSize().y && otherSprite.getPosition().y + otherSprite.getSize().y >= this.getPosition().y + this.getSize().y);
        }
    }

    getBoundingCircle(otherSprite) {
        if(!otherSprite instanceof Sprite)throw `In sprite.collides(sprite) - wrong type of sprite`;
        let distance = Vector2.getDistance(this.getCenterPosition(), otherSprite.getCenterPosition());
        return distance < (this.getSize().y / 2) + (otherSprite.getSize().y / 2);
    }

    getBoundingBoxCircle(boxSprite)
    {
        if(!boxSprite instanceof Sprite)throw `In sprite.collides(sprite) - wrong type of sprite`;
        
        let circleCenter = this.getCenterPosition();
        let tmpX = circleCenter.x;
        let tmpY = circleCenter.y;
        if(circleCenter.x < boxSprite.getPosition().x) 
        {
            tmpX = boxSprite.getPosition().x;
        } 
        else if(circleCenter.x > boxSprite.getPosition().x + boxSprite.getSize().x){ 
            tmpX = boxSprite.getPosition().x + boxSprite.getSize().x;
        }
        if(circleCenter.y < boxSprite.getPosition().y) 
        {
            tmpY = boxSprite.getPosition().y;
        } 
        else if(circleCenter.y > boxSprite.getPosition().y + boxSprite.getSize().y){ 
            tmpY = boxSprite.getPosition().y + boxSprite.getSize().y;
        }
        let dist = new Vector2(circleCenter.x - tmpX, circleCenter.y - tmpY);
        let distance = Math.sqrt((dist.x * dist.x) + (dist.y * dist.y)); 
        return distance <= this.getSize().x/2;

    }

    collides(sprite){
        if(!this.getBoundingBox(sprite)) return false;
        if(!sprite instanceof Sprite)throw `In sprite.collides(sprite) - wrong type of sprite`;
        let smallerX = sprite.getSize().x > this.getSize().x ? this : sprite;
        let biggerX = smallerX == this ? sprite : this;
    
        for(let y = 0; y < biggerX.getSize().y; y++){
            let realY = y + biggerX.getPosition().y;
            if(realY >= smallerX.getPosition().y && realY <= smallerX.getPosition().y + smallerX.getSize().y){
                let currentBiggerRow = biggerX.#internalTransparentMap[y];
                if(currentBiggerRow == -1 || currentBiggerRow == undefined) continue;
                if(smallerX.getPosition().x >= (currentBiggerRow[0]+biggerX.getPosition().x) && smallerX.getPosition().x <= (currentBiggerRow[1]+biggerX.getPosition().x)) return true;
                if(smallerX.getSize().x + this.getPosition().x >= (currentBiggerRow[0]+biggerX.getPosition().x) && smallerX.getSize().x + this.getPosition().x <= (currentBiggerRow[1]+biggerX.getPosition().x)) return true;
            }
        }
        return false;
    }

    #calculateInternalBoundary(){
        let canvas = document.createElement("canvas");
        canvas.width = this.getImage().width;
        canvas.height = this.getImage().height;
        let context = canvas.getContext('2d');
        context.drawImage(this.getImage(), 0, 0);
        let data = context.getImageData(0, 0, canvas.width, canvas.height);

        function isTransparent(x, y){
            let red = y * (context.width * 4) + x * 4;
            return data[red+3] == 0;
        }

        let array = [];
        /*
            [
                [x1, x2] (to check if collides, x >= x1 && x <= x2)
            ]
        */
        for(let y = 0; y<canvas.height; y++){
            let x1 = 0;
            for(; x1<canvas.width; x1++){
                if(!isTransparent(x1, y)) break;
            }
            if(x1 == canvas.width -1){
                array.push(-1);
                continue;
            }
            let x2 = canvas.width-1;
            for(; x2 >= 0; x2--){
                if(!isTransparent(x2, y)) break;
            }
            array.push([x1, x2]);
        }
        this.#internalTransparentMap = array;
    }

}

//constructor(x, y | position)
//arguments.length == 2#
