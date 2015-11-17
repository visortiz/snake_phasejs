var Menu = {

    preload: function() {
        game.load.image('menu', './assets/images/menu.png');
    },

    create: function() {
        this.add.button(0, 0, 'menu', this.startGame, this);
        returnKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        returnKey.onDown.add(this.startGame, this);
    },

    startGame: function() {
        this.state.start('Game');
    }

}
