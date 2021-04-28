import { Vector2 } from "../../../CGE/vector2.js";
import { Sprite } from "../../../CGE/sprite.js";
import { canvas } from "../../../CGE/canvas.js";
import {upgradeType} from "./upgrade.js";

export class Paddle extends Sprite
{
    speed = 2;
    #deafultSize;

    init(width, height, imageSrc, x = 0, y = 0, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        super.init(width, height, imageSrc, x, y, offsetX, offsetY, offsetWidth, offsetHeight);
        this.#deafultSize = new Vector2(width, height);
        window.onmousemove = (e)=>{this.mouse(e)};
    }

    mouse(e)
    {
        if(e.pageX-this.getSize().x/2  >= 45 && e.pageX + this.getSize().x/2 <= canvas.context.canvas.width - 45)this.setPosition(e.pageX-(this.getSize().x/2), this.getPosition().y);
    }



    upgrade(id){
        this.resetUpgrades();
        switch(id){
            case upgradeType.longer:
                this.setScale(new Vector2(1.3, 0.8));               
                break;
            case upgradeType.shorter:
                this.setScale(new Vector2(0.8, 1.2));
                break;
        }
    }

    resetUpgrades()
    {
        this.setSize(this.#deafultSize);
    }

}