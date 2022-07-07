export function ApiYouTube() {

    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    async function onYouTubeIframeAPIReady(id, playerId) {
        player = await new YT.Player(playerId, {
            height: '720',
            width: '1080',
            videoId: id,
            playerVars: {
                'controls': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        event.target.setPlaybackQuality('hd1080');
        event.target.setVolume(60);
        event.target.playVideo();
    };

    var done = false;
    function onPlayerStateChange(event) {
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //     setTimeout(stopVideo, 6000);
        //     done = true;
        //     }
        event.target.setLoop(true);
    };

    const stopVideo = () => {
        player.destroy();
    };

    return{
        onPlayerReady,
        stopVideo,
        onPlayerStateChange,
        onYouTubeIframeAPIReady
    }
}

