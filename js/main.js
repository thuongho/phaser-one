(function() {
  'use strict';
  // freesound.org
  // look at license
  // mp3 and ogg for android and ios
  // use audacity to transform wav to above
  // project rate - pick smallest but still sound good 22050

  // give game dimensions 640 x 360
  // phaser use WebGL or default to canvas if WebGL is not avail
  // Pixi.js does the rendering of the WebGL
  var game = new Phaser.Game(640, 360, Phaser.AUTO); 

  // game state
  var GameState = {
    // all image loaded
    preload: function() {
      this.load.image('background', 'assets/images/earth_640x360.jpg');
      this.load.image('arrow', 'assets/images/arrow.png');
      this.load.image('star', 'assets/images/star-small.png');
      this.load.image('blackhole-color', 'assets/images/blackhole-color.png');
      this.load.image('comet', 'assets/images/komet_lexell.png');
      this.load.image('meteor', 'assets/images/meteor.png');
      this.load.image('blackhole', 'assets/images/blackhole_trans.png');
    },
    create: function() {
      var self = this;
      var cosmic;
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
      // this.star.tint = 0xFF0000;

      // enable user input on star
      this.star.inputEnabled = true;
      // this.star.input.pixelPerfectClick = true;
      this.star.events.onInputDown.add(this.animateSpaceObject, this);

      // group of space objects
      var spaceTypes = [
        {key: 'blackhole-color', text: 'WORMHOLE'},
        {key: 'comet', text: 'COMET'},
        {key: 'meteor', text: 'METEOR'},
        {key: 'blackhole', text: 'BLACKHOLE'}
      ];

      // create a new group
      this.spaceObjectsGroup = this.game.add.group();

      spaceTypes.forEach(function(spaceType) {
        // -1000 to make the objects be out of screen
        cosmic = self.spaceObjectsGroup.create(-1000, self.game.world.centerY, spaceType.key);
        // sprites, add frame at the end
        // cosmic = self.spaceObjectsGroup.create(-1000, self.game.world.centerY, spaceType.key), 0;

        cosmic.customParams = {text: spaceType.text};
        cosmic.anchor.setTo(0.5);

        // create animation 'name', frame, fps, loop
        // cosmic.animations.add('animate', [0,1,2,1,0,1], 3, false) 

        cosmic.inputEnabled = true; 
        // cosmic.input.pixelPerfectClick = true; 
        cosmic.events.onInputDown.add(self.animateSpaceObject, self);
      });

      this.currentSpaceObject = this.spaceObjectsGroup.next();
      // make the current object centered
      this.currentSpaceObject.position.set(this.game.world.centerX, this.game.world.centerY);

      // show text after current
      this.showText(this.currentSpaceObject);

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
      // this.star.tint = 0xFF0000;
    },
    changeSpaceObject: function(sprite, event) {
      var newObject, endX;

      if (this.isMoving) {
        return false;
      }

      this.isMoving = true;

      // hide text
      this.spaceText.visible = false;

      if (sprite.customParams.direction > 0) {
        newObject = this.spaceObjectsGroup.next();
        // make the object come back in the screen from the correct position
        newObject.x = -newObject.width/2; 
        endX = 640 + this.currentSpaceObject.width/2; // put the obj completely out of the pix
      } else {
        newObject = this.spaceObjectsGroup.previous();
        newObject.x = 640 + newObject.width/2;
        endX = -this.currentSpaceObject.width/2;
      }

      // tween is adding transition over time
      // alpha for opacity
      var newObjectMovement = game.add.tween(newObject);
      // default is 1000 1 sec
      newObjectMovement.to({x: this.game.world.centerX}, 1000);
      // callback to execute when complete
      newObjectMovement.onComplete.add(function() {
        this.isMoving = false;
        // show new text when animation is completed
        this.showText(newObject);
      }, this);
      newObjectMovement.start();

      var currentSpaceMovement = game.add.tween(this.currentSpaceObject);
      currentSpaceMovement.to({x: endX}, 1000);
      currentSpaceMovement.start();

      this.currentSpaceObject.x = endX;  // current object at final destination
      newObject.x = this.game.world.centerX;
      this.currentSpaceObject = newObject;
    },
    animateSpaceObject: function(sprite, event) {
      // console.log('animate space object');
      // sprite.play('animate');
    },
    showText: function(spacey) {
      // if spaceText doesn't exist
      if (!this.spaceText) {
        var style = {
          font: 'bold 30pt Arial',
          fill: '#ffffff',
          align: 'center'
        }
        // text object
        // position x is middle y is 85%
        this.spaceText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
        this.spaceText.anchor.setTo(0.5);
      }

      this.spaceText.setText(spacey.customParams.text);
      this.spaceText.visible = true;
    }
  };

  // assign state to game
  game.state.add('GameState', GameState);

  // launch game
  game.state.start('GameState');
}());