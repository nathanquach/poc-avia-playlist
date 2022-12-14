const VIDEOS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/redundant.m3u8'
]

// create Avia instance
function createPlayer() {
  return avia.createVideoPlayer({
    container: '#videoPresentationContainer',
    plugins: [
      avia.fw.plugin({ debug: true }),
      avia.gam.plugin(),
      avia.hls.plugin(),
      avia.dash.plugin(),
      avia.playlist.plugin({ debug: true }),
      avia.ui.plugin()
    ],
    logLevel: avia.LogLevel.DEBUG,
    autoplay: avia.Autoplay.ATTEMPT_UNMUTED_THEN_MUTED
  })
}

// Provide a resource to the playlist plugin & start player
function playPlaylist(player) {
  const configs = [
    {
      location: {
        mediaUrl: VIDEOS[0], // First video uses actual url to play
      }
    }
  ];

  // subsequent item will have place holder url
  for(let i = VIDEOS.length - 1; i > 0; i--) {
    configs.push({ location: { mediaUrl: 'place holder' }})
  }

  const myPlaylist = player.getPlugin(avia.playlist.PLAYLIST)
  myPlaylist.addResources(configs)

  myPlaylist.start()

  window.playlist = myPlaylist
}

// Handle playlist event
function handlePlaylistEvent(e) {
  if (e.detail.id === avia.playlist.PLAYLIST) {
    switch (e.detail.type) {
      case avia.playlist.PlaylistEvent.PLAYLIST_ADVANCED:
        // NOTE: The problem here is the extremly short timeframe to update next resource url. Performing reading e.detail.data.index could delay the operation.
        playlist.list[1].location.mediaUrl = VIDEOS[1]
        break;
    }
  }
}


createPlayer()
  .then(player => {
    window.player = player
    playPlaylist(player);

    Object.values(avia.PlayerEvent).forEach(event => {
      player.on(event, handlePlaylistEvent)
    })
  })
  .catch(e => {
    // problem with player creation
    console.log(e);
  })