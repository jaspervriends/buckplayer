// Allow the use of jQuery
if(window.jQuery)
{
    jQuery.fn.buckplayer = function(config)
    {
        this.each(function() {
            buckplayer.createPlayer(this, config);
        });

        return this;
    };
}