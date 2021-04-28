import { Sprite } from "../../../CGE/sprite.js";

export class Brick extends Sprite
{
    points = 0;
    lives = 0;
    init(width, height, imageSrc, points, lives, x = 0, y = 0, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        super.init(width, height, imageSrc, x, y, offsetX, offsetY, offsetWidth, offsetHeight);
        this.points = points;
        this.lives = lives;
    }
}