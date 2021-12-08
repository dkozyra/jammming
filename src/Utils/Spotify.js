let accessToken;
let expires;
let clientId = 'ff075deed9584b37bad2f720511c45de';
let redirectURI = 'http://uneven-geese.surge.sh';

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        const accessTokenURL = window.location.href.match(/access_token=([^&]*)/);
        const expiresURL = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenURL && expiresURL) {
            accessToken = accessTokenURL[1];
            // accessToken = accessToken.replace(`=`, ``);
            expires = Number(expiresURL[1]);
            window.setTimeout(() => accessToken = '', expires * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },

    search(term) {
        let accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => response.json()).then(jsonresponse => {
            if(!jsonresponse.tracks) {
                return [];
            }
            return jsonresponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) {
            return;
        }

        let accessToken = Spotify.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonresponse => {
            userId = jsonresponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonresponse => {
                const playlistId = jsonresponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }
};



export default Spotify;