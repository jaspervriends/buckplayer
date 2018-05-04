// Make it possible to import buckplayer through object.buckplayer(config);
Element.prototype.buckplayer = function(config) {
    // console.log(this);
    return buckplayer.createPlayer(this, config);
};