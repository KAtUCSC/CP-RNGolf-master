class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 200
        this.SHOT_VELOCITY_X_MAX = 600
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.WALL_SPEED = 250

        this.SHOT_COUNT = 0
        this.SHOT_COUNT_CURRENT = 0
        this.GOALS = 0
        this.SHOT_PERCENT = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
        

        // add walls
        this.wallA = this.physics.add.sprite(0, height/4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width/2, width - this.wallA.width/2))
        this.wallA.setImmovable(true)
        this.wallA.direction = Math.random() < 0.5 ? 1 : -1
        this.wallA.body.setCollideWorldBounds(true)
        this.wallA.body.setBounce(1)
        this.wallA.setVelocityX(this.WALL_SPEED)
        
        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.setImmovable(true)

        this.walls = this.add.group([this.wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0+this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            let shotX = pointer.x < this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX) * shotX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            this.SHOT_COUNT += 1
            this.shots.text = this.SHOT_COUNT
            this.SHOT_COUNT_CURRENT += 1
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //ball.destroy(true)
            ball.setPosition(width/2, height - height/10)
            ball.setVelocity(0)
            this.GOALS += 1
            this.score.text = `hole in ${this.SHOT_COUNT_CURRENT}`
            this.SHOT_COUNT_CURRENT = 0
            this.SHOT_PERCENT = 100 * this.GOALS / this.SHOT_COUNT
            //console.log(this.SHOT_PERCENT)
            this.percent.text = this.SHOT_PERCENT
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        //text config
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }

        //add percentage
        this.percent = this.add.text(width - 100, 0, this.SHOT_PERCENT, scoreConfig)

        //add shots
        scoreConfig.align = 'left'
        this.shots = this.add.text(0, 0, this.SHOT_COUNT, scoreConfig)

        //add score
        scoreConfig.align = 'center'
        scoreConfig.fixedWidth = 0
        this.score = this.add.text(width/2 - 50, 0, this.GOALS, scoreConfig)
    }

    update() {
        /*
        this.wallA.x += this.WALL_SPEED * this.wallA.direction
        if(this.wallA.x - this.wallA.width/2 < 0 || width < this.wallA.x + this.wallA.width/2) {
            this.wallA.direction *= -1
        }
        */
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/