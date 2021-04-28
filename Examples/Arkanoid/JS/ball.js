import { Sprite } from "../../../CGE/sprite.js";
import { Vector2 } from "../../../CGE/vector2.js";
export class Ball extends Sprite
{

    speed = new Vector2(1, -2);
    sticky = true;
    deafultSpeed = new Vector2(3, 7);
}