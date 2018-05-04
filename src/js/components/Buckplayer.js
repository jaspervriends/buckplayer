'use strict';

import Browserdetection from "./Browserdetection.js";
import Player from "./Player.js";

class Buckplayer
{
    browser = 'unknown';
    playerAmount = 0;

    init()
    {
        this.browser = new Browserdetection().browser();

        console.log(this.browser);

    }

    // Create new player
    createPlayer(element, config)
    {
        let player = new Player();
        player.player = element;
        player.config = config;

        player.init();

        return player;
    }
}

export default Buckplayer;