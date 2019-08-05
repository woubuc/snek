!function(){"use strict";var t,e=120;function n(t){var e=document.getElementById(t);if(!e)throw new Error("Element #"+t+" does not exist");return e}function i(e){switch(e){case t.Up:return t.Down;case t.Down:return t.Up;case t.Left:return t.Right;case t.Right:return t.Left}}!function(t){t.Up="up",t.Down="down",t.Left="left",t.Right="right"}(t||(t={}));var r=function(){function e(t,e){this.x=t,this.y=e}return e.random=function(){return new e(Math.floor(24*Math.random()),Math.floor(16*Math.random()))},e.prototype.equals=function(t){return this.x===t.x&&this.y===t.y},e.prototype.translate=function(n){var i=this.x,r=this.y;return n===t.Up?r--:n===t.Down?r++:n===t.Left?i--:n===t.Right&&i++,i<0&&(i=23),i>=24&&(i=0),r<0&&(r=15),r>=16&&(r=0),new e(i,r)},e.prototype.add=function(t){return new e(this.x+t.x,this.y+t.y)},e.prototype.toScreen=function(){return{x:16*this.x,y:16*this.y}},e}(),o=function(){function t(t,e,n){this.position=t,this.direction=e,this.updateSprite(n)}return t.prototype.updateSprite=function(t){this.sheetTile=t?s(this.direction,t.direction):s(this.direction)},t.prototype.render=function(t,e){e.drawTile(t,this.sheetTile,this.position)},t}();function a(t,e,n,r){return r===t&&n===e||r===i(e)&&n===i(t)}function s(e,n){if(!n)return"tail_"+e.toString();if(e===n)return e===t.Up||e===t.Down?"body_vertical":"body_horizontal";if(a(t.Up,t.Right,e,n))return"body_corner_up_right";if(a(t.Up,t.Left,e,n))return"body_corner_up_left";if(a(t.Down,t.Right,e,n))return"body_corner_down_right";if(a(t.Down,t.Left,e,n))return"body_corner_down_left";throw new Error("Invalid directions: "+e+", "+n)}var h,u,c,f,d,p,l=function(){function t(){this.time=e,this.resetValue=e}return t.prototype.isTick=function(t){return this.time-=t,this.time<0&&(this.time+=Math.round(this.resetValue),!0)},t.prototype.reset=function(){this.time=Math.round(this.resetValue)},t.prototype.increaseGameSpeed=function(){this.resetValue*=.99},t}(),w=function(){function t(t,e){this.tiles=new Map,this.sheet=t,e&&e(this.identify.bind(this))}return t.prototype.identify=function(t,e,n){this.tiles.set(t,{x:e,y:n})},t.prototype.drawTile=function(t,e,n){var i={x:0,y:0};if("string"==typeof e){var r=this.tiles.get(e);if(!r)throw new Error("Could not find sprite "+e+" on sheet");i=r}else i.x=e;t.layer.drawImage(this.sheet,16*i.x,16*i.y,16,16,16*n.x,16*n.y,16,16)},t.snek=function(e){return new t(e.images.snek,function(t){t("head_up",0,0),t("head_right",0,1),t("head_down",0,2),t("head_left",0,3),t("head_open_up",1,0),t("head_open_right",1,1),t("head_open_down",1,2),t("head_open_left",1,3),t("body_vertical",2,0),t("body_horizontal",2,1),t("body_corner_up_right",3,0),t("body_corner_up_left",4,0),t("body_corner_down_right",3,1),t("body_corner_down_left",4,1),t("tail_down",2,2),t("tail_up",2,3),t("tail_right",3,2),t("tail_left",4,2)})},t}(),_=0,y=0,g="",m=[],v=new l,b=!1,x=0;function k(t){return!!u.equals(t)||m.some(function(e){return e.position.equals(t)})}function R(){p=u.translate(c),b=p.equals(h)||k(p);var t=m[m.length-1].direction;g="head"+(b?"_open":"")+"_"+t.toString()}function D(){for(;;){var t=r.random();if(!k(t)){h=t,_=0;break}}}function L(t){c=t,R()}function U(){if(!k(p)){var t;p.equals(h)?(void 0===t&&(t=1),x+=t,n("score").innerText=x.toFixed(0),D(),v.increaseGameSpeed()):m.shift(),m.push(new o(u,c)),u=p,L(c);for(var e=void 0,i=0,r=m;i<r.length;i++){var a=r[i];a.updateSprite(e),e=a}R()}}var S={enter:function(){v.reset(),f=w.snek(this.app),d=new w(this.app.images.food);var e=Math.floor(8),n=Math.floor(8);u=new r(e,n),c=t.Right,m.unshift(new o(new r(e-1,n),t.Right)),m.unshift(new o(new r(e-2,n),t.Right)),p=new r(e+1,n),D(),R()},step:function(t){t*=1e3,_<3&&(y-=t)<0&&(_++,y+=150),v.isTick(t)&&U()},render:function(t){this.app.layer.clear("#ffffb5");for(var e=0,n=m;e<n.length;e++){n[e].render(this.app,f)}f.drawTile(this.app,g,u),d.drawTile(this.app,_,h)},keydown:function(e){switch(e.key){case"up":case"z":case"w":L(t.Up);break;case"down":case"s":L(t.Down);break;case"left":case"a":case"q":L(t.Left);break;case"right":case"d":L(t.Right)}}};PLAYGROUND.LoadingScreen=!1,PLAYGROUND.Transitions=!1,new PLAYGROUND.Application({width:384,height:256,scale:1,smoothing:!1,container:n("canvas-container"),preload:function(){this.loadImage("logo")},create:function(){this.loadImage("snek"),this.loadImage("food")},ready:function(){n("loading").remove(),n("frame").style.display="block",this.setState(S)}})}();
//# sourceMappingURL=app.js.map
