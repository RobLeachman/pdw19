webpackJsonp([0],{1455:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}();t.SimpleScene=function(e){function t(){return r(this,t),console.log("constructed simple"),s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"SimpleScene"))}return a(t,e),n(t,[{key:"preload",value:function(){}},{key:"create",value:function(){this.cameras.main.setZoom(1.55),this.cameras.main.setScroll(-200,-95),this.add.image(0,0,"road").setOrigin(0,0)}}]),t}(Phaser.Scene)},1456:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}();t.BootGame=function(e){function t(){return r(this,t),s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"BootGame"))}return a(t,e),n(t,[{key:"preload",value:function(){this.load.image("road","assets/graphics/road3.png"),this.load.spritesheet("man","assets/graphics/aMan.png",{frameWidth:40,frameHeight:40}),this.load.spritesheet("generated","assets/graphics/newGenerating.png",{frameWidth:80,frameHeight:50}),this.load.spritesheet("gauges","assets/graphics/newGas.png",{frameWidth:60,frameHeight:5}),this.load.spritesheet("market","assets/graphics/market.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("shields","assets/graphics/shields.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("laser","assets/graphics/laser.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("manWithThing","assets/graphics/manWithThing.png",{frameWidth:40,frameHeight:40}),this.load.spritesheet("base","assets/graphics/base.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("fuelStore","assets/graphics/fuelStore1C.png",{frameWidth:25,frameHeight:25}),this.load.spritesheet("botFactoryPad","assets/graphics/botFactoryPad.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("botFactory","assets/graphics/botFactory.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("gasFactoryPad","assets/graphics/gasFactoryPad.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("gasFactory","assets/graphics/gasFactory.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("generator","assets/graphics/generator0.png",{frameWidth:90,frameHeight:90}),this.load.spritesheet("pad","assets/graphics/pad1.png",{frameWidth:90,frameHeight:90})}},{key:"create",value:function(){this.scene.start("PlayGame")}}]),t}(Phaser.Scene)},1457:function(e,t,i){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.PlayGame=void 0;var o=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),h=i(1458),c=r(h),u=i(1459),f=r(u),l=i(1460),p=r(l),g=i(1461),m=r(g),d=i(1462),y=r(d),b=i(1463),v=r(b),w=i(1464),S=r(w),O=i(70),k={difficulty:0,testing:1,swipeMaxTime:1e3,swipeMinDistance:20,swipeMinNormal:.85},P=[[[35,100,0],[100,100],[165,100,1],[230,100],[295,100,2],[360,100]],[[35,230,3],[100,230],[165,230,4],[230,230],[295,230,5],[360,230]],[[35,360,6],[100,360],[165,360,7],[230,360],[295,360,8],[360,360]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[360,540],[425,540,9],[545,540,10],[665,540,11]]],x=[],_=!1,F=!0;t.PlayGame=function(e){function t(){return s(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"PlayGame"))}return n(t,e),o(t,[{key:"create",value:function(){this.cameras.main.setZoom(1.55),this.cameras.main.setScroll(-200,-95),this.add.image(0,0,"road").setOrigin(0,0);for(var e=0;e<9;e++)if(0==e){var t=new m.default(this,"botFactoryPad",e);x.push(t)}else if(4==e){var i=new c.default(this,"base",e,"fuelStore");x.push(i)}else if(8==e){var r=new p.default(this,"gasFactoryPad",e);x.push(r)}else{var s=new f.default(this,"pad",e);x.push(s)}var a=new y.default(this,"market",9);x.push(a);var n=new v.default(this,"shields",10);x.push(n);var o=new S.default(this,"laser",11);x.push(o),n.paint(),this.man={location:new Phaser.Geom.Point(2,1),spot:4,moving:!1,moveBuffer:-1,carrying:0};var h=(0,O.getMapCoords)(this.man.location);this.man.sprite=this.add.sprite(h.x,h.y,"man",0).setOrigin(0,0),this.bots=[],this.input.keyboard.on("keyup",this.handleKey,this),this.input.on("pointerup",this.handleSwipe,this)}},{key:"update",value:function(){try{if(!this.man.moving&&this.man.moveBuffer>-1){if(4==this.man.moveBuffer){var e=P[this.man.location.y][this.man.location.x][2];void 0!==e&&x[e].interact(this.man,this.bots)}else this.makeMove(this.man.moveBuffer);this.man.moveBuffer=-1}}catch(e){if(_)throw"the wheels, they have come off the wagon again";console.log("ERROR "+e),console.log("STACK "+e.stack),_=!0;var t=this.add.graphics();t.fillStyle(255,1);var i=new Phaser.Geom.Rectangle(0,0,800,600);t.fillRectShape(i),this.add.text(0,40,e,{font:"18px Courier"}),this.add.text(0,70,"RATFARTS",{font:"18px Courier"}),this.add.text(0,100,e.stack,{font:"18px Courier"})}}},{key:"handleKey",value:function(e){switch(e.code){case"KeyA":case"ArrowLeft":this.man.moveBuffer=0;break;case"KeyD":case"ArrowRight":this.man.moveBuffer=1;break;case"KeyW":case"ArrowUp":this.man.moveBuffer=2;break;case"KeyS":case"ArrowDown":this.man.moveBuffer=3;break;case"Space":this.man.moveBuffer=4;break;case"Digit0":this.man.sprite.setFrame(0),this.man.carrying=0;break;case"Digit1":this.man.sprite.setFrame(1),this.man.carrying=1;break;case"Digit2":this.man.sprite.setFrame(2),this.man.carrying=2}}},{key:"handleSwipe",value:function(e){var t=e.upTime-e.downTime,i=t<k.swipeMaxTime,r=new Phaser.Geom.Point(e.upX-e.downX,e.upY-e.downY);Phaser.Geom.Point.GetMagnitude(r)>k.swipeMinDistance&&i?(Phaser.Geom.Point.SetMagnitude(r,1),r.x>k.swipeMinNormal&&(this.man.moveBuffer=1),r.x<-k.swipeMinNormal&&(this.man.moveBuffer=0),r.y>k.swipeMinNormal&&(this.man.moveBuffer=3),r.y<-k.swipeMinNormal&&(this.man.moveBuffer=2)):this.man.moveBuffer=4}},{key:"makeMove",value:function(e){var t=this.man.location.x,i=this.man.location.y,r=P[this.man.location.y][this.man.location.x][2];switch(e){case 0:this.man.location.x--;break;case 1:this.man.location.x++;break;case 2:this.man.location.y--,r>-1&&(this.man.location.y=-1);break;case 3:if(this.man.location.y++,F&&this.man.location.y>2){F=!1;var s=this.cameras.main;s.pan(400,300,400,"Linear"),s.zoomTo(1,400)}r>-1&&(this.man.location.y=-1)}if((0,O.getMapCoords)(this.man.location)){var a=(0,O.getMapCoords)(this.man.location);this.man.moving=!0,this.tweens.add({targets:[this.man.sprite],duration:300,x:a.x,y:a.y,callbackScope:this,onComplete:function(){this.man.moving=!1}})}else this.man.location.x=t,this.man.location.y=i}}]),t}(Phaser.Scene)},1458:function(e,t,i){"use strict";function r(e,t,i,r){this.spot=i,this.sprite=e.add.sprite((0,s.getLocationX)(i),(0,s.getLocationY)(i),t,0).setOrigin(0,0),this.fuelStoreSprite=r,this.fuelBay=[10,10,10],this.fuelSprite=[],this.fuelSprite[1]=e.add.sprite(this.sprite.x+6,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0),this.fuelSprite[0]=e.add.sprite(this.sprite.x+33,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0),this.fuelSprite[2]=e.add.sprite(this.sprite.x+60,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0),this.interact=function(e){e.carrying==a?this.takeStuff()&&(e.sprite.setFrame(1),e.carrying=n):e.carrying==n&&this.stashStuff()&&(e.sprite.setFrame(0),e.carrying=a)},this.takeStuff=function(){for(var e=0;e<3;e++)if(this.fuelBay[e]>0)return this.fuelBay[e]=0,this.repaint(),!0;return!1},this.stashStuff=function(){for(var e=0;e<3;e++)if(0==this.fuelBay[e])return this.fuelBay[e]=10,this.repaint(),!0;return!1},this.repaint=function(){this.fuelSprite[0].setFrame(this.fuelBay[0]),this.fuelSprite[1].setFrame(this.fuelBay[1]),this.fuelSprite[2].setFrame(this.fuelBay[2])}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var s=i(70),a=0,n=1},1459:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=0,o=function(){function e(t,i,s){r(this,e),this.game=t,this.spriteName=i,this.spot=s,this.sprite=t.add.sprite((0,a.getLocationX)(s),(0,a.getLocationY)(s),i,0).setOrigin(0,0),this.state=n,this.fuel=0,this.fakeForAnim=this.game.add.sprite(-1e3,-1e3,"fakeForAnim",0).setOrigin(0,0),this.game.anims.create({key:"fakeStuff",frames:this.game.anims.generateFrameNames("fakeForAnim",{start:0,end:10}),frameRate:12,repeat:0})}return s(e,[{key:"interact",value:function(e){this.state==n?1==e.carrying&&(this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"generator",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.state=1,this.regenerate(!0)):2==this.state&&0==e.carrying&&(e.carrying=1,e.sprite.setFrame(1),this.genSprite.alpha=0,this.regenerate(!1)),2==e.carrying&&this.fuel>0&&(this.fuel=0,this.gauge=this.game.add.sprite((0,a.getLocationX)(this.spot)+15,(0,a.getLocationY)(this.spot)+10,"gauges",this.fuel).setOrigin(0,0),3==this.state&&this.regenerate(!1),e.sprite.setFrame(0),e.carrying=0)}},{key:"regenerate",value:function(e){e?(this.genSprite=this.game.add.sprite((0,a.getLocationX)(this.spot)+5,(0,a.getLocationY)(this.spot)+15,"generated",0).setOrigin(0,0),this.game.anims.create({key:"generateStuff",frames:this.game.anims.generateFrameNames("generated",{start:0,end:10}),frameRate:12,repeat:0}),this.makeStuff(),this.gauge=this.game.add.sprite((0,a.getLocationX)(this.spot)+15,(0,a.getLocationY)(this.spot)+10,"gauges",this.fuel).setOrigin(0,0),this.fuel=0):this.fuel<3&&(this.fuel++,this.gauge=this.game.add.sprite((0,a.getLocationX)(this.spot)+15,(0,a.getLocationY)(this.spot)+10,"gauges",this.fuel).setOrigin(0,0),this.fuel<3?this.makeStuff():this.state=3)}},{key:"makeStuff",value:function(){this.genSprite.alpha=1,this.genSprite.play("generateStuff"),this.genSprite.on("animationcomplete",function(){this.state=2},this)}}]),e}();t.default=o},1460:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=function(){function e(t,i,s){r(this,e),this.game=t,this.spot=s,this.spriteName=i,this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),i,0).setOrigin(0,0)}return s(e,[{key:"interact",value:function(e){this.built?1==e.carrying&&(e.sprite.setFrame(2),e.carrying=2):1==e.carrying&&(this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"gasFactory",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.built=!0)}}]),e}();t.default=n},1461:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=function(){function e(t,i,s){r(this,e),this.game=t,this.spriteName=i,this.spot=s,this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),i,0).setOrigin(0,0),this.built=!1,this.botsAvailable=10}return s(e,[{key:"interact",value:function(e,t){if(1==e.carrying)if(this.built){this.botsAvailable--,t.push(1);var i=new Phaser.Geom.Rectangle(this.sprite.x+5+7*t.length,this.sprite.y+20,5,2),r=this.game.add.graphics({fillStyle:{color:16777215}});r.fillRectShape(i)}else{this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"botFactory",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.built=!0;for(var s=0;s<this.botsAvailable;s++){var n=new Phaser.Geom.Rectangle(this.sprite.x+5+7*(s+1),this.sprite.y+20,5,2),o=this.game.add.graphics({fillStyle:{color:16711680}});o.fillRectShape(n)}}}}]),e}();t.default=n},1462:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=function(){function e(t,i,s){r(this,e),this.game=t,this.spot=s,this.spriteName=i,this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),i,0).setOrigin(0,0),this.built=!0}return s(e,[{key:"interact",value:function(e){this.built?1==e.carrying&&(e.sprite.setFrame(0),e.carrying=0,console.log("MONEY")):1==e.carrying&&(this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"gasFactory",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.built=!0)}}]),e}();t.default=n},1463:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=function(){function e(t,i,s,n){r(this,e),this.game=t,this.spot=s,this.spriteName=i,this.graphics=n,this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),i,0).setOrigin(0,0),this.built=!0,this.upgrades=1,this.fuelStoreSprite="fuelStore",this.fuelBay=[0,10,10],this.fuelSprite=[],this.fuelSprite[1]=t.add.sprite(this.sprite.x+6,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0),this.fuelSprite[0]=t.add.sprite(this.sprite.x+33,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0),this.fuelSprite[2]=t.add.sprite(this.sprite.x+60,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0),this.drawUpgrades()}return s(e,[{key:"interact",value:function(e){if(this.built)if(1==e.carrying){var t=this.fuelBay.findIndex(function(e){return console.log(e),0==e});console.log(t),0<=t&&(this.fuelBay[t]=10,this.fuelSprite[t].setFrame(10),e.sprite.setFrame(0),e.carrying=0)}else 2==e.carrying&&this.upgrades<11&&(this.upgrades++,this.drawUpgrades(),e.sprite.setFrame(0),e.carrying=0);else 1==e.carrying&&(this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"gasFactory",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.built=!0)}},{key:"paint",value:function(){var e=new Phaser.Geom.Rectangle(400,400,330,15);this.game.add.graphics({fillStyle:{color:255}}).fillRectShape(e)}},{key:"drawUpgrades",value:function(){var e=new Phaser.Geom.Rectangle(this.sprite.x+4,this.sprite.y+71,80,9),t=this.game.add.graphics({fillStyle:{color:255}});t.fillRectShape(e);for(var i=0;i<this.upgrades;i++)e=new Phaser.Geom.Rectangle(this.sprite.x+6+7*i,this.sprite.y+73,5,5),t=this.game.add.graphics({fillStyle:{color:8571645}}),t.fillRectShape(e)}}]),e}();t.default=n},1464:function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),a=i(70),n=function(){function e(t,i,s){r(this,e),this.game=t,this.spot=s,this.spriteName=i,this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),i,0).setOrigin(0,0),this.built=!0,this.upgrades=1,this.fuelStoreSprite="fuelStore",this.fuelBay=[0,10,10],this.fuelSprite=[],this.fuelSprite[1]=t.add.sprite(this.sprite.x+6,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0),this.fuelSprite[0]=t.add.sprite(this.sprite.x+33,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0),this.fuelSprite[2]=t.add.sprite(this.sprite.x+60,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0),this.drawUpgrades()}return s(e,[{key:"interact",value:function(e){if(this.built)if(1==e.carrying){var t=this.fuelBay.findIndex(function(e){return console.log(e),0==e});0<=t&&(this.fuelBay[t]=10,this.fuelSprite[t].setFrame(10),e.sprite.setFrame(0),e.carrying=0)}else 2==e.carrying&&this.upgrades<11&&(this.upgrades++,this.drawUpgrades(),e.sprite.setFrame(0),e.carrying=0);else 1==e.carrying&&(this.sprite=this.game.add.sprite((0,a.getLocationX)(this.spot),(0,a.getLocationY)(this.spot),"laser",0).setOrigin(0,0),e.sprite.setFrame(0),e.carrying=0,this.built=!0)}},{key:"drawUpgrades",value:function(){var e=new Phaser.Geom.Rectangle(this.sprite.x+4,this.sprite.y+71,80,9),t=this.game.add.graphics({fillStyle:{color:255}});t.fillRectShape(e);for(var i=0;i<this.upgrades;i++)e=new Phaser.Geom.Rectangle(this.sprite.x+6+7*i,this.sprite.y+73,5,5),t=this.game.add.graphics({fillStyle:{color:8571645}}),t.fillRectShape(e)}}]),e}();t.default=n},534:function(e,t,i){"use strict";function r(){var e=document.querySelector("canvas"),t=window.innerWidth,i=window.innerHeight,r=t/i,s=o.config.width/o.config.height;r<s?(e.style.width=t+"px",e.style.height=t/s+"px"):(e.style.width=i*s+"px",e.style.height=i+"px")}i(258);var s=(i(1455),i(1456)),a=i(1457),n={width:800,height:600,backgroundColor:0,pixelArt:!0,scene:[s.BootGame,a.PlayGame]},o=new Phaser.Game(n);window.onload=function(){window.focus(),r(),window.addEventListener("resize",r)}},70:function(e,t,i){"use strict";function r(e){var t=0;return 0!=e&&3!=e&&6!=e||(t=10),1!=e&&4!=e&&7!=e||(t=140),2!=e&&5!=e&&8!=e||(t=270),9==e&&(t=400),10==e&&(t=520),11==e&&(t=640),t}function s(e){var t=0;return 0!=e&&1!=e&&2!=e||(t=10),3!=e&&4!=e&&5!=e||(t=140),6!=e&&7!=e&&8!=e||(t=270),9!=e&&10!=e&&11!=e||(t=450),t}function a(e){try{return e.x<0||e.y<0?null:n[e.y][e.x][0]<0?null:n[e.y][e.x][1]<0?null:new Phaser.Geom.Point(n[e.y][e.x][0],n[e.y][e.x][1])}catch(e){return null}}Object.defineProperty(t,"__esModule",{value:!0});var n=[[[35,100,0],[100,100],[165,100,1],[230,100],[295,100,2],[360,100]],[[35,230,3],[100,230],[165,230,4],[230,230],[295,230,5],[360,230]],[[35,360,6],[100,360],[165,360,7],[230,360],[295,360,8],[360,360]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[360,540],[425,540,9],[545,540,10],[665,540,11]]];t.getLocationX=r,t.getLocationY=s,t.getMapCoords=a}},[534]);