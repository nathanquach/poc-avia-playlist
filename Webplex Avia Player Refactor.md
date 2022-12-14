## DLS Player Component
### Hooks

Single `videoDetail` input needs to change to videos array
- `useAviaPlayer`
- `useAviaWithAviaUI`

Use `RESOURCE_END` to trigger Up Next redirection must change to `PLAYLIST_COMPLETE`
- `useRelatedVideosForUpNext`

### Components

Single `videoDetail` input needs to change to video array
- `Player`: immersive player
- `Avia`: player with standard ui

### Proposal

- New components: `PlaylistPlayer`, `PlaylistAvia`
- New hooks: `useAviaPlaylist`, `useAviaPlaylistWithAviaUI`


## Webplex Avia Plugins

### Playlist Service

Current logic fetches all video manifest before playback. For a playlist with 10 one-minute clips, the timeline will be as below:

**Clip 1 starts**
- Clip 1: Manifest TTL 5'
- Clip 2: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 3: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 4: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 5: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 6: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 7: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 8: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 9: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'
- Clip 10: Manifest TTL 5' - REQUEST hook in background fetching new token every 4'

**Clip 2 starts**
- Clip 1: Manifest TTL 4'
- Clip 2: Manifest TTL 4'
- Clip 3: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 4: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 5: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 6: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 7: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 8: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 9: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'
- Clip 10: Manifest TTL 4' - REQUEST hook in background fetching new token every 4'

...

**Clip 5 starts**
- Clip 1: Manifest TTL 0
- Clip 2: Manifest TTL 0
- Clip 3: Manifest TTL 0
- Clip 4: Manifest TTL 0
- Clip 5: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 6: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 7: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 8: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 9: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 10: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'

...

**Clip 8 starts**
- Clip 1: Manifest TTL 0
- Clip 2: Manifest TTL 0
- Clip 3: Manifest TTL 0
- Clip 4: Manifest TTL 0
- Clip 5: Manifest TTL 2
- Clip 6: Manifest TTL 2
- Clip 7: Manifest TTL 2
- Clip 8: Manifest TTL 2 - REQUEST hook in background fetching new token every 4'
- Clip 9: Manifest TTL 2 - REQUEST hook in background fetching new token every 4'
- Clip 10: Manifest TTL 2 - REQUEST hook in background fetching new token every 4'


...

**Clip 9 starts**
- Clip 1: Manifest TTL 0
- Clip 2: Manifest TTL 0
- Clip 3: Manifest TTL 0
- Clip 4: Manifest TTL 0
- Clip 5: Manifest TTL 0
- Clip 6: Manifest TTL 0
- Clip 7: Manifest TTL 0
- Clip 8: Manifest TTL 0
- Clip 9: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'
- Clip 10: Manifest TTL 5 - TTL refreshed. REQUEST hook in background fetching new token every 4'

...

**Clip 10 starts**
- Clip 1: Manifest TTL 0
- Clip 2: Manifest TTL 0
- Clip 3: Manifest TTL 0
- Clip 4: Manifest TTL 0
- Clip 5: Manifest TTL 0
- Clip 6: Manifest TTL 0
- Clip 7: Manifest TTL 0
- Clip 8: Manifest TTL 0
- Clip 9: Manifest TTL 4
- Clip 10: Manifest TTL 4


So in playlist life time of 10', we send 10 (at 0) + 6 (at 4') + 2 (at 8')= 18 requests to Topaz mica.
If at the end of clip 10, we replay the playlist from 1, the cycle will repeat.

I have experiemented with using Player Event to update clip manifest just in time instead of at the player creation.

There are 2 options to update `playlist.list[index].location.mediaUrl`
- `PLAYLIST_ADVANCED`: when playlist prev/next 
- `RESOURCE_END`: when current content end

Both have drawbacks of their own.

