# Buckplayer
Buckplayer is a modern HTML5 video player.

### **Buckplayer is in development and still unstable**

##**Features:**
* HTML5, Javascript (ES6 written) and CSS (as LESS written)
* _**No**_ flash
* Fully customizable
* Multiple sources possible: 420p, 720p, 1080p etc (autodetect)
* Possible sources:
    * _.webm_, _.mp4_, _.ogv_ or _.ogg_
* Custom logo
* Many options
* API to use (.play(), .pause()) and callback functions as onPlay, onPause, onEnd, onPlaying

## Example
````javascript 1.8
let playerConfig = {
    title: "Geat video",
    description: "Description",
    
    autoplay: true,
    volume: 100,
    width: '720',
    height: '350',
    
    fullscreen: true, // Enable full screen
    preload: true, // Preload the full video
    
    hideControls: 2500, // milliseconds or false
    
    src: {
        720: "/video.mp4"
    },
    
    url: 'https://www.buckplayer.com/',
    logo: 'https://www.buckplayer.com/images/logo.png',
    videoUrl: 'https://www.buckplayer.com/demovideo'
};

let player = document.querySelector(".video").buckplayer(playerConfig);
````

## Initialize player

*Default:*
````javascript 1.8
let player = document.querySelector(".buckplayer").buckplayer(playerConfig);
````

*jQuery:*
````javascript 1.8
$(".buckplayer").buckplayer(playerConfig);
````

## API callbacks
````javascript 1.8
let playerConfig = {
    onPlay: function() {
        console.log("Started!");
    },

    onPause: function() {
        console.log("Paused!");
    },

    onEnd: function() {
        console.log("Ended!"); // Show download popup
    }
};
````
