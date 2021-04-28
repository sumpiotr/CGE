import { Sprite } from "../../../CGE/sprite.js";

const numberOfUpgrades = 2;

export const upgradeType = {
    longer: 1,
    shorter: 2,
};

export class Upgrade extends Sprite
{
    static getNumberOfUpgrades(){return numberOfUpgrades};
    id = 0;
    init(width, height, imageSrc, id, x, y) {
        super.init(width, height, imageSrc, x, y);
        this.id = id;
        switch(this.id){
            case upgradeType.longer:
                this.setTextureFromFile("../Arkanoid/Assets/PNG/47-Breakout-Tiles.png")
                break;
            case upgradeType.shorter:
                this.setTextureFromFile("../Arkanoid/Assets/PNG/46-Breakout-Tiles.png")
                break;
        }
    }
}