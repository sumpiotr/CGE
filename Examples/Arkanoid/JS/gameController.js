import { Vector2 } from "../../../CGE/vector2.js";
import { Paddle } from "./paddle.js";
import {Ball} from "./ball.js";
import { canvas } from "../../../CGE/canvas.js";
import { keyboard } from "../../../CGE/keyboard.js";
import {Brick} from "./brick.js";
import {Upgrade} from "./upgrade.js";
import { Texture } from "../../../CGE/texture.js";

class GameController {

    bricks = [];
    upgrade = 0;
    offsetX = 45;
    lives = 3;
    actualPoints = 0;
    livesCounter;
    pointsCounter;

    constructor(){
        this.init();
    }

    async init() {
        //Initialize paddle, ball and bg
        this.background = new Texture();
        this.background.init(canvas.context.canvas.width, canvas.context.canvas.height, "../Arkanoid/Assets/PNG/background.png", 0, 0, 0, 0, 0, 429);
        this.paddle = new Paddle();
        await this.paddle.init(100, 20, "../Arkanoid/Assets/PNG/paddleRed.png");
        this.ball = new Ball();
        await this.ball.init(10, 10, "../Arkanoid/Assets/PNG/ballBlue.png");
        this.setStartBallPosition();
        this.paddle.speed = 8;

        //Initialize bricks
        let brickIndex = 0;
        for(let k = 0; k < 5; k++)
        {
            let color;
            switch(k)
            {
                case 0:
                    color = "grey";
                    break;
                case 1:
                    color = "red";
                    break;
                case 2:
                    color = "blue";
                    break;
                case 3:
                    color = "purple";
                    break;
                default:
                    color = "yellow";
                    break;
            }
            for(let i = 0; i < 11; i++)
            {
                this.bricks[brickIndex] = new Brick();
                await this.bricks[brickIndex].init((canvas.context.canvas.width - (2*this.offsetX))/11, 20, `../Arkanoid/Assets/PNG/element_${color}_rectangle.png`, 90 - 10*k, 1);
                this.bricks[brickIndex].setPosition(new Vector2(i*this.bricks[i].getSize().x + this.offsetX,this.bricks[i].getSize().y*(4+k)))
                if(k == 0)this.bricks[brickIndex].lives++;
                brickIndex++;
            }
        }

        //Set HTML counters
        this.livesCounter = document.getElementById("livesCounter");
        this.pointsCounter = document.getElementById("pointsCounter");
        this.pointsCounter.textContent = 0;
        this.livesCounter.textContent = this.lives;

        this.main();
    }

    setStartBallPosition()
    {
        this.paddle.setPosition(new Vector2(canvas.context.canvas.width /2 - this.paddle.getSize().x/2, 550));
        this.ball.setPosition(new Vector2(canvas.context.canvas.width/2 - this.ball.getSize().x/2, this.paddle.getPosition().y - this.ball.getSize().y))
        this.ball.speed.x = 0;
        this.ball.speed.y = 0;
        this.ball.sticky = true;
        setTimeout(() => {
            this.ball.speed.x = this.ball.deafultSpeed.x;
            this.ball.speed.y = -this.ball.deafultSpeed.y;
            this.ball.sticky = false;
        }, 1500);
    }


    main() {
        this.update();
        this.logic();
        this.display();
        window.requestAnimationFrame(() => this.main());
    }



    update()
    {
        this.ball.move(new Vector2(this.ball.speed.x, this.ball.speed.y));
        if(this.ball.sticky)this.ball.setPosition(this.paddle.getCenterPosition().x, this.ball.getPosition().y);

        if(this.upgrade)this.upgrade.move(0, 3);

        if(keyboard.getKeyDown(keyboard.key.Escape))this.ball.setPosition(new Vector2(200, 500));
    }

    logic()
    {
        let ballPosition = this.ball.getPosition();
        let centerBallPosition = this.ball.getCenterPosition();

        //Check if ball is out of screen
        if(ballPosition.x <= this.offsetX || ballPosition.x + this.ball.getSize().x >= canvas.context.canvas.width - this.offsetX)
        {
            this.ball.setPosition(ballPosition.x <= this.offsetX  ? this.offsetX + this.ball.getSize().x : canvas.context.canvas.width - this.offsetX - this.ball.getSize().x , this.ball.getPosition().y);
            this.ball.speed.x = this.ball.speed.x > 0 ? this.ball.deafultSpeed.x * -1 : this.ball.deafultSpeed.x ;
            this.ball.speed.y = this.ball.speed.y > 0 ? this.ball.deafultSpeed.y : this.ball.deafultSpeed.y * -1;
        }

        if(ballPosition.y <= 0)this.ball.speed.y *= -1;

        if(ballPosition.y  >= canvas.context.canvas.height)
        {
            this.livesCounter.textContent = --this.lives;
            this.setStartBallPosition();
        }


        //Ball paddle Colision
        if(this.ball.collides(this.paddle) && centerBallPosition.y < this.paddle.getCenterPosition().y && !this.ball.sticky)
        {
            let ballDistanceFromCenter = this.paddle.getSize().x  - Math.abs(this.paddle.getCenterPosition().x -  centerBallPosition.x);
            let percent =  (ballDistanceFromCenter/(this.paddle.getSize().x));
            let degrees = 90 * percent;
            let radius = degrees * (Math.PI/180);
            this.ball.speed = new Vector2(Math.cos(radius) * 8, Math.sin(radius) * 8);
            this.ball.speed.y *= -1;
            if((centerBallPosition.x < this.paddle.getCenterPosition().x && this.ball.speed.x > 0) || (centerBallPosition.x > this.paddle.getCenterPosition().x && this.ball.speed.x < 0))this.ball.speed.x *= -1;

        }

        //ball bricks collision
        for(let brickIndex in this.bricks)
        {
            if(this.ball.getBoundingBoxCircle(this.bricks[brickIndex]))
            {
                let brickPosition = this.bricks[brickIndex].getPosition();
                if(ballPosition.x == brickPosition.x + this.bricks[brickIndex].getSize().x && ballPosition.y == brickPosition.y + this.bricks[brickIndex].getSize().y )break;
                if(ballPosition.x >= brickPosition.x + this.bricks[brickIndex].getSize().x || ballPosition.x <= brickPosition.x )this.ball.speed.x *= -1;
                this.ball.speed.y *= -1;
                if(--this.bricks[brickIndex].lives <= 0)
                {
                    if(Math.floor(Math.random() * 10) + 1 >= 5 && !this.upgrade){
                        this.createNewUpgrade(brickPosition);
                    }
                    this.actualPoints += this.bricks[brickIndex].points;
                    this.pointsCounter.textContent = this.actualPoints;
                    this.bricks.splice(brickIndex, 1);
                }
                break;
            }
        }

        //paddle upgrade collision
        if(this.upgrade)
        {
            if(this.upgrade.getBoundingBox(this.paddle))
            {
                this.paddle.upgrade(this.upgrade.id);
                this.upgrade = 0;
            }
            else if(this.upgrade.getPosition().y > canvas.context.canvas.height)this.upgrade = 0;
        }
    }

    display()
    {
        canvas.clearView();
        canvas.drawSprite(this.background);
        canvas.drawSprite(this.paddle);
        canvas.drawSprite(this.ball);
        for(let brick of this.bricks)
        {
            canvas.drawSprite(brick);
        }
       if(this.upgrade)canvas.drawSprite(this.upgrade);
    }

    createNewUpgrade(upgradePosition)
    {
        this.upgrade = new Upgrade();
        let id = Math.floor(Math.random()*Upgrade.getNumberOfUpgrades() + 1);
        this.upgrade.init(50, 20, '../Arkanoid/Assets/PNG/46-Breakout-Tiles.png', id, upgradePosition.x,upgradePosition.y);
    }
}


let gameController = new GameController();
