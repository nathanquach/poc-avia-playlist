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
        console.debug('>d: PLAYLIST_ADVANCED')
        // NOTE: Updating mediaUrl here is too late, player already loads the resource with place holder url.
        if (playlist.currentIndex > -1) {
          playlist.list[1].location.mediaUrl = VIDEOS[1]
        }
        break;
    }
  }

  if (e.type === avia.PlayerEvent.RESOURCE_END) {
    console.debug('>d: RESOURCE_END')
    // updating mediaUrl here works, however we don't know if the action is next or prev. So cannot detect target index.
    const index = playlist.currentIndex + 1
    if (index <= VIDEOS.length) {
      playlist.list[index].location.mediaUrl = VIDEOS[index]
      playlist.list.forEach((item, index) => console.debug('>d: playlist item manifest: ', index, item.location.mediaUrl))
    }
  }
}


createPlayer()
  .then(player => {
    window.player = player
    playPlaylist(player);

    playlist.list.forEach((item, index) => console.debug('>d: playlist item manifest: ', index, item.location.mediaUrl))

    Object.values(avia.PlayerEvent).forEach(event => {
      player.on(event, handlePlaylistEvent)
    })
  })
  .catch(e => {
    // problem with player creation
    console.log(e);
  })