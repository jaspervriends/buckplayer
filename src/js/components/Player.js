'use strict';

class Player
{
    // Player element
    player = null;

    // Config element
    config = null;

    // Player ID
    playerId = -1;

    // Initialized
    initialized = false;

    playerData = {
        started: false,
        playing: false,
        paused: false,
        stopped: false,
        inFullscreen: false,
        hideBarTimeout: setTimeout(() => {}),
        settingsOpened: false,
        loop: true,
        canHideControlBar: false
    };

    // availableSources = null;

    constructor()
    {
        this.started = false;

        window.buckplayer.playerAmount++;
        this.playerId = window.buckplayer.playerAmount;
    }

    icons = {
        play: '<i class="far fa-play"></i>',
        pause: '<i class="far fa-pause"></i>',
        settings: '<i class="far fa-cog"></i>',
        volume: '<i class="far fa-volume-up"></i>',
        volumeMuted: '<i class="far fa-volume-mute"></i>',
        fullscreen: '<i class="far fa-expand"></i>',
        compress: '<i class="far fa-compress"></i>',
        subtitles: '<i class="far fa-closed-captioning"></i>',
        popout: '<i class="far fa-"></i>',
        information: '<i class="far fa-"></i>'
    };

    init()
    {
        this.playerHTML();

        if(this.config.autoplay)
        {
            this.playerData.started = true;
            this.playerData.playing = true;
            this.playerData.paused = false;
        }
    }

    // Play video
    play()
    {
        this.video.play();

        // Update player info
        this.playerData.started = true;
        this.playerData.playing = true;
        this.playerData.paused = false;

        this.player.querySelector(".controls button.play").innerHTML = this.icons.pause;
    }

    // Pause video
    pause()
    {
        // Pause video
        this.video.pause();

        // Update player info
        this.playerData.playing = false;
        this.playerData.paused = true;

        this.player.querySelector(".controls button.play").innerHTML = this.icons.play;
    }

    // Play and pause the player
    playPause()
    {
        // Player is not playing
        if(!this.playerData.playing) {
            this.play();
        }else{
            this.pause();
        }
    }

    // Player HTML
    playerHTML()
    {
        if(this.initialized) {
            console.log("Blocked: The player is already initialized");
            return;
        }

        this.player.id = `buckplayer_${this.playerId}`;

        // Clear old content
        this.player.innerHTML = "";

        // Set player width
        this.setPlayerSize();

        // Set video sources
        this.player.appendChild(this.setSources());

        // Add invisible overlay
        this.player.appendChild(this.invisibleVideoOverlay());

        // Get video object and start registering video events
        this.video = this.player.querySelector("video");
        this.registerVideoEvents();

        // Add player controls to the player
        this.player.appendChild(this.addPlayerControls());

        this.showControlBar();

        // Player initialized
        this.initialized = true;
    }

    invisibleVideoOverlay()
    {
        if(this.initialized) {
            console.log("Blocked: The player is already initialized");
            return;
        }

        let overlay = document.createElement("div");
        overlay.className = "videoplayer-overlay";

        overlay.addEventListener("dblclick", () => {
            this.goFullscreen();
        });

        overlay.addEventListener("click", () => {
            this.playPause();
        });

        return overlay;
    }

    registerVideoEvents()
    {
        if(this.initialized) {
            console.log("Blocked: The player is already initialized");
            return;
        }

        // Video started playing
        this.video.addEventListener("play", () => {
            // Execute if there's a onStart config function
            if (typeof this.config.onPlay === "function") {
                this.config.onPlay();
            }
        });

        // Video paused
        this.video.addEventListener("pause", () => {
            // Execute if there's a onPause config function
            if (typeof this.config.onPause === "function") {
                this.config.onPause();
            }
        });

        // Video ended
        this.video.addEventListener("ended", () => {
            // Execute if there's a onEnd config function
            if (typeof this.config.onEnd === "function") {
                this.config.onEnd();
            }

            // Player in loop?
            if(this.playerData.loop) {
                // Replay
                this.play();
            }else{
                // Update visual player
                this.playerData.playing = false;
                this.playerData.paused = false;
                this.playerData.stopped = true;

                this.player.querySelector(".controls button.play").innerHTML = this.icons.play;
            }

        });

        // Buffering
        setInterval(() => {
            // Ready state
            // 0 = HAVE_NOTHING
            // 1 = HAVE_METADATA
            // 2 = HAVE_CURRENT_DATA
            // 3 = HAVE_FUTURE_DATA
            // 4 = HAVE_ENOUGH_DATA

            if(this.video.readyState < 1)
            {
                return;
            }

            let buffered = 100 * (this.video.buffered.end(0)) / this.video.duration;
            let played = (100 / this.video.duration) * this.video.currentTime;

            this.player.querySelector(".controls .progress-container .progress-buffer").style.width = buffered + "%";

            this.player.querySelector(".controls .progress-container .progress-bar").style.width = played + "%";

        }, 150);
    }

    // Get and set sources
    setSources()
    {
        if(this.initialized) {
            console.log("Blocked: The player is already initialized");
            return;
        }

        let video = document.createElement("video");
        video.className = "videoplayer";
        video.controls = false;

        // Preload the video?
        if (this.config.preload) {
            video.preload = "true";
        }

        // Start the video?
        if (this.config.autoplay) {
            video.autoplay = true;
        }

        // Add sources
        for (let key of Object.keys(this.config.src)) {
            let sourceUrl = this.config.src[key];

            // Source does not exists or is empty
            if(!sourceUrl || sourceUrl === "")
            {
                continue;
            }

            // Create new source
            let source = document.createElement("source");
            source.id = "source_" + key;
            source.src = sourceUrl;

            // Get type of source
            let sourceUrlLowerCased = sourceUrl.toLowerCase();
            if(sourceUrlLowerCased.indexOf(".mp4"))
            {
                source.type = 'video/mp4';
            }
            else if(sourceUrlLowerCased.indexOf(".webm"))
            {
                source.type = 'video/webm';
            }
            else if(sourceUrlLowerCased.indexOf(".ogv") || sourceUrlLowerCased.indexOf(".ogg"))
            {
                source.type = 'video/ogg';
            }
            else{
                console.log("Invalid video source.");
            }

            video.appendChild(source);
        }

        return video;
    }

    addPlayerControls()
    {
        if(this.initialized) {
            console.log("Blocked: The player is already initialized");
            return;
        }

        let playerControls = document.createElement("div");
        playerControls.className = "controls";

        playerControls.appendChild(this.addProgressBar());

        // Play/Pause
        playerControls.appendChild(this.controlPlayBtn());

        // Volume
        playerControls.appendChild(this.controlVolumeControl());
        // Current time

        // Settings
        playerControls.appendChild(this.controlSettingsBtn());

        // Fullscreen
        playerControls.appendChild(this.controlFullscreenBtn());

        return playerControls;
    }

    controlPlayBtn()
    {
        // Player controls
        let playButton = document.createElement("button");
        playButton.className = "play";

        // Start the video?
        if (this.config.autoplay) {
            playButton.innerHTML = this.icons.pause;
        }else{
            playButton.innerHTML = this.icons.play;
        }

        // Go fullscreen
        playButton.addEventListener("click", () => {
            this.playPause();
        });

        return playButton;
    }

    controlSettingsBtn()
    {
        // Settings
        let settingsButton = document.createElement("button");
        settingsButton.className = "settings";
        settingsButton.innerHTML = this.icons.settings;

        // Click event
        settingsButton.addEventListener("click", () => {
            if(this.playerData.settingsOpened) {
                this.playerData.settingsOpened = false;

                this.removeClass(settingsButton, "opened");
            }else{
                this.playerData.settingsOpened = true;

                this.addClass(settingsButton, "opened");
            }
        });

        return settingsButton;
    }

    // Fullscreen
    controlFullscreenBtn()
    {
        // Player controls
        let fullscreenButton = document.createElement("button");
        fullscreenButton.className = "fullscreen";
        fullscreenButton.innerHTML = this.icons.fullscreen;

        if(this.config.fullscreen)
        {
            // Go full screen
            fullscreenButton.addEventListener("click", () => {
                this.goFullscreen();
            });
        }else{
            fullscreenButton.disabled = true;
        }

        return fullscreenButton;
    }

    // Player progress bar
    addProgressBar()
    {
        // Progress container
        let progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";
        progressContainer.draggable = true;

        // Seeking timer
        let progressSeekingTimer = document.createElement("div");
        progressSeekingTimer.className = "progress-timer";
        progressSeekingTimer.style.display = "none";

            let videoPreviewCanvas = document.createElement("canvas");
            videoPreviewCanvas.className = "progress-timer-canvas";
            videoPreviewCanvas.width = 120;
            videoPreviewCanvas.height = 80;

            let videoPreviewTimer = document.createElement("div");
            videoPreviewTimer.className = "progress-timer-time";
            videoPreviewTimer.innerHTML = "0:00";

            progressSeekingTimer.appendChild(videoPreviewCanvas);
            progressSeekingTimer.appendChild(videoPreviewTimer);

        progressContainer.appendChild(progressSeekingTimer);

        // Buffer bar
        let progressBuffer = document.createElement("div");
        progressBuffer.className = "progress-buffer";

        progressContainer.appendChild(progressBuffer);

        // Progress bar
        let progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        // Progress bar add bubble
        let progressBarBuble = document.createElement("div");
        progressBarBuble.className = "progress-bar-pointer";

        progressBar.appendChild(progressBarBuble);

        progressContainer.appendChild(progressBar);

        // Seek player
        progressContainer.addEventListener("click", (e) => {
            this.seekPlayer(progressContainer, progressSeekingTimer, videoPreviewTimer, e);
        });

        // Drag to a time
        progressContainer.addEventListener("drag", (e) => {
            e.preventDefault();

            if(this.playerData.playing) {
                this.video.pause();
            }

            let ctx = videoPreviewCanvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, videoPreviewCanvas.width, videoPreviewCanvas.height);

            this.addClass(this.player, "dragging-progress-started");


            if(e.screenX > 0)
            {
                this.seekPlayer(progressContainer, progressSeekingTimer, videoPreviewTimer, {
                    offsetX: e.screenX
                });
            }
        });

        // When the drag is ended, play from there
        progressContainer.addEventListener("dragend", () => {
            if(this.playerData.playing) {
                this.play();
            }
            this.removeClass(this.player, "dragging-progress-started");
        });

        // Show timer
        progressContainer.addEventListener("mouseenter", () => {
            progressSeekingTimer.style.display = "block";
        });

        progressContainer.addEventListener("mousemove", (e) => {
            let offsetX = e.offsetX === undefined ? e.layerX : e.offsetX;
            let progressBarWidth = progressContainer.offsetWidth;
            let videoDuration = (this.video.duration || 1);

            progressSeekingTimer.style.left = offsetX + "px";
            videoPreviewTimer.innerHTML = this.secondsToTime((offsetX / progressBarWidth) * videoDuration);
        });

        progressContainer.addEventListener("mouseleave", () => {

            progressSeekingTimer.style.display = "none";
        });

        return progressContainer;
    }

    seekPlayer(progressContainer, progressSeekingTimer, videoPreviewTimer, e)
    {
        let offsetX = e.offsetX === undefined ? e.layerX : e.offsetX;
        let progressBarWidth = progressContainer.offsetWidth;
        let videoDuration = (this.video.duration || 1);

        this.video.currentTime = ((offsetX / progressBarWidth) * videoDuration);

        progressSeekingTimer.style.left = offsetX + "px";
        videoPreviewTimer.innerHTML = this.secondsToTime((offsetX / progressBarWidth) * videoDuration);
    }

    // Set player size
    setPlayerSize()
    {
        // Set player height
        if (this.config.width) {
            this.player.style.width = this.config.width + "px";
        }

        // Set player height
        if (this.config.height) {
            this.player.style.height = this.config.height + "px";
        }
    }

    // Control bar
    showControlBar()
    {
        if(!this.config.hideControls) {
            return;
        }

        this.player.addEventListener("mouseenter", () => {
            this.playerData.canHideControlBar = true;
            this.removeClass(this.player, "controls-hidden");
        });

        // Mouse move video
        this.player.addEventListener("mousemove", () => {
            this.removeClass(this.player, "controls-hidden");

            clearTimeout(this.playerData.hideBarTimeout);
            this.playerData.hideBarTimeout = setTimeout(() => {
                if(this.playerData.canHideControlBar && !this.playerData.paused) {
                    this.addClass(this.player, "controls-hidden");
                }
            }, this.config.hideControls);
        });

        // Control bar
        this.player.querySelector(".controls").addEventListener("mouseenter", () => {
            this.playerData.canHideControlBar = false;
        });

        // Control bar
        this.player.querySelector(".controls").addEventListener("mouseleave", () => {
            this.playerData.canHideControlBar = true;
        });
    }

    // Go in fullscreen
    goFullscreen()
    {
        if(this.config.fullscreen)
        {
            if (!this.playerData.inFullscreen)
            {
                this.playerData.inFullscreen = true;
                this.addClass(this.player, 'fullscreen');

                this.player.querySelector(".controls button.fullscreen").innerHTML = this.icons.compress;


                if (this.player.mozRequestFullScreen)
                {
                    this.player.mozRequestFullScreen();
                }
                else if (this.player.webkitRequestFullScreen)
                {
                    this.player.webkitRequestFullScreen();
                }else{
                    alert("Couldn't get in fullscreen.");
                }
            }
            else {
                this.playerData.inFullscreen = false;
                this.removeClass(this.player, 'fullscreen');

                this.player.querySelector(".controls button.fullscreen").innerHTML = this.icons.fullscreen;

                if(document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
                else if(document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                }
                else if(document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }else{
                    alert("Couldn't get out of fullscreen. Press escape.");
                }
            }
        }
    }

    controlVolumeControl()
    {
        // Player controls
        let volumeControl = document.createElement("div");
        volumeControl.className = "volume-control";

        let volumeIcon = document.createElement("button");
        volumeIcon.className = "volume";
        volumeIcon.innerHTML = this.icons.volume;

        volumeControl.appendChild(volumeIcon);

        // Go fullscreen
        // fullscreenButton.addEventListener("click", () => {
        //     this.goFullscreen();
        // });

        return volumeControl;
    }

    // Make from 75 seconds 1:15
    secondsToTime(sec) {
        let hr = Math.floor(sec / 3600);
        let hr2 = hr;
        let min = Math.floor((sec - (hr * 3600))/60);
        sec -= ((hr * 3600) + (min * 60));
        sec += ''; min += '';
        while (min.length < 2) {min = '0' + min;}
        while (sec.length < 2) {sec = '0' + sec;}
        hr = (hr)?':'+hr:'';

        if(hr2 < 1) {
            hr = "";
        }

        if(min < 1) {
            min = "0";
        }

        sec = Math.floor(Number(sec));

        if(sec < 10) {
            sec = '0' + sec.toString();
        }

        return hr + min + ':' + sec;
    }

    // Add class to object
    addClass(object, className)
    {
        if (this.hasClass(object, className))
        {
            return this;
        }

        object.className = object.className + " " + className;
    }

    // Check if object has class
    hasClass(object, className)
    {
        if(!object.hasAttribute('class'))
        {
            return false;
        }

        return(object.getAttribute('class').indexOf(className) !== -1 ? !0 : !1);
    }

    // Remove class from object
    removeClass(object, className)
    {
        object.className = object.className.replace(new RegExp(' \\b'+className+'\\b', 'g'), '');
        return this;
    }
}

export default Player;