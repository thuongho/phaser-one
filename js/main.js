(function() {
  'use strict';

  // give game dimensions 640 x 360
  // phaser use WebGL or default to canvas if WebGL is not avail
  // Pixi.js does the rendering of the WebGL
  var game = new Phaser.Game(640, 360, Phaser.AUTO); 

  // game state
  var GameState = {
    // all image loaded
    preload: function() {
      this.load.image('background', 'assets/images/earth_640x360.jpg');
      this.load.image('star', 'assets/images/star-small.png');
      this.load.image('arrow', 'assets/images/arrow.png');
    },
    create: function() {
      // this.scale is a scale manager
      // Phaser.ScaleManager.SHOW_ALL - this allows scaling while keeping aspect ratio
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;

      // create sprite for background
      // game.add is called game factory, used to create game objects
      this.background = this.game.add.sprite(0, 0, 'background'); // coords top left, key

      // anchor point is top left of sprite by default
      // world gives the center coords
      // this.star = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'star');
      this.star = this.game.add.sprite(this.game.world.centerX - 100, 40, 'star');
      // change the anchor point
      // number proportion to width
      // 1 is left, 0 is right, first number is x
      // 0 is down, 1 is up, second number is y
      // (0.8,0.8) can be replaced with just one number (0.8)
      // use scale.setTo(-1, 1) to flip on x
      // can reduce the size by half if using .scale.setTo(0.5)
      // rotation starts from top left, to rotate from center anchor.setTo(0.5)
      // .angle = -45 45 degree counter
      this.star.anchor.setTo(0.5);

      // enable user input on star
      this.star.inputEnabled = true;
      // this.star.input.pixelPerfectClick = true;
      this.star.events.onInputDown.add(this.animateSpaceObject, this);

      // right arrow
      this.rightArrow = this.game.add.sprite(560, this.game.world.centerY, 'arrow');
      this.rightArrow.scale.setTo(0.4);
      this.rightArrow.anchor.setTo(0.5);
      // params to set the direction 
      this.rightArrow.customParams = { direction: 1 };

      // right arrow allow user input
      this.rightArrow.inputEnabled = true;
      // this.rightArrow.input.pixelPerfectClick = true;
      this.rightArrow.events.onInputDown.add(this.changeSpaceObject, this);

      // left arrow
      this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
      this.leftArrow.scale.setTo(-0.4);
      this.leftArrow.anchor.setTo(0.5);
      // this.leftArrow.scale.x = -1;  // reverse the image
      this.leftArrow.customParams = { direction: -1 };

      // left arrow allow user input
      this.leftArrow.inputEnabled = true;
      // input is now enabled after enabling it
      // this.leftArrow.input.pixelPerfectClick = true;
      this.leftArrow.input.useHandCursor = true;
      this.leftArrow.events.onInputDown.add(this.changeSpaceObject, this);  // click or touch event

    },
    update: function() {  // running multple time per sec to get input
      // can make star constantly rotate
      // this.star.angle += 0.5;
    },
    changeSpaceObject: function(sprite, event) {
      console.log('change space object');
    },
    animateSpaceObject: function(sprite, event) {
      console.log('animate space object');
    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());