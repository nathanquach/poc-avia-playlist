function createPlayer() {
  return avia.createVideoPlayer({
    container: '#videoPresentationContainer',
    plugins: [
      avia.fw.plugin({ debug: true }),
      avia.gam.plugin(),
      avia.hls.plugin(),
      avia.dash.plugin(),
      avia.playlist.plugin(),
      avia.ui.plugin()
    ],
    logLevel: avia.LogLevel.DEBUG,
    autoplay: avia.Autoplay.ATTEMPT_UNMUTED_THEN_MUTED
  })
}

// Provide a resource to the player
function playVideo(player) {
  const resource = {
    location: {
      mediaUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    }
  };

  player.attachResource(resource)
    .then(() => {
      // resource successfully attached to player
      // video presentation may be clicked to start play
    })
    .catch(e => {
      // a problem prevented attaching the resource
      console.log(e);
    })
}

// Provide a resource to the playlist plugin
function playPlaylist(player) {
  const myPlaylist = player.getPlugin(avia.playlist.PLAYLIST)

  const configs = [
    {
      location: {
        mediaUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      }
    },
    {
      location: {
        mediaUrl: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/redundant.m3u8',
      }
    }
  ];

  myPlaylist.addResources(configs)
  myPlaylist.start()
}

const handlePlaylistEvent = (e) => {
  if (e.detail.id === PLAYLIST) {

      switch(e.detail.type) {

          case PLAYLIST_ADVANCED:
              //
              break;
          // etc.

      }
  }
}

createPlayer()
  .then(player => {
    playPlaylist(player);
  })
  .catch(e => {
    // problem with player creation
    console.log(e);
  })