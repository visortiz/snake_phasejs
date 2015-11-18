var snake, apple, squareSize, score, speed, updateDelay, direction, new_direction, addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value, walls;

var Game = {

    preload: function() {
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
        game.load.image('wall', './assets/images/wall.png');
    },

    create: function() {
        snake = [];
        apple = {};
        squareSize = 15;
        score = 0;
        speed = 0;
        updateDelay = 0
        direction = 'right';
        new_direction = null;
        addNew = false;
        speedTextValue = 0;

        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        this.generateLevel();

        for(var i = 0; i < 5; i++) {
            snake[i] = game.add.sprite(180 + i * squareSize, 150, 'snake');
        }

        this.generateApple();

        textStyle_Key = { font: 'bold 14px sans-serif', fill: '#46c0f9', align: 'center' };
        textStyle_Value = { font: 'bold 18px sans-serif', fill: '#fff', align: 'center' };

        game.add.text(30, 20, 'SCORE', textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);

        game.add.text(500, 20, 'SPEED', textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    update: function() {
        if (cursors.right.isDown && direction != 'left') {
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction != 'right') {
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction != 'down') {
            new_direction = 'down';
        }
        else if (cursors.down.isDown && direction != 'up') {
            new_direction = 'up';
        }

        speed = Math.min(10, Math.floor(score));
        speedTextValue.text = '' + speed;

        updateDelay++;

        if (updateDelay % (10 - speed) == 0) {
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            if (new_direction) {
                direction = new_direction;
                new_direction = null;
            }

            if (direction == 'right') {
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'left') {
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'up') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }
            else if (direction == 'down') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }

            snake.push(lastCell);
            firstCell = lastCell;
        }

        if (addNew) {
            snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
            addNew = false;
        }

        firstCell = firstCell || 0;

        this.appleCollision();
        this.selfCollision(firstCell);
        this.wallCollision(firstCell);

    },

    generateLevel: function() {

        walls = game.add.group();

        var level_map = [
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xxxxxxxxxxxxxxxxxxxxoxxxxxxxxxxxxxxxxxxx',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooxooooooooooooooooooxooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xxxxxxxxxxxxxxxxxxxxoxxxxxxxxxxxxxxxxxxx',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xoooooooooooooooooooooooooooooooooooooox',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        ];

        for (var i = 0; i < 30; i++) {
            var linha = level_map[i].split('');
            for (var j = 0; j < 40; j++) {
                if(linha[j] == 'x') {
                    posX = j * 15;
                    posY = i * 15;
                    walls.create(posX, posY, 'wall');
                }
            }
        }
    },

    generateApple: function() {
        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        walls.forEach(function(item) {
            while (randomX == item.x && randomY == item.y) {
                randomX = Math.floor(Math.random() * 40) * squareSize;
                randomY = Math.floor(Math.random() * 30) * squareSize;
            }
        });

        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    appleCollision: function() {
        for (var i = 0; i < snake.length; i++) {
            if(snake[i].x == apple.x && snake[i].y == apple.y) {
                addNew = true;

                apple.destroy();
                this.generateApple();
                score++;
                scoreTextValue.text = '' + score.toString();
            }
        }
    },

    selfCollision: function(head) {
        for (var i = 0; i < snake.length - 1; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                game.state.start('Game_Over');
            }
        }
    },

    wallCollision: function(head) {
        walls.forEach(function(item) {
            if (head.x == item.x && head.y == item.y) {
                game.state.start('Game_Over');
            }
        });
    }

};
