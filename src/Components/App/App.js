import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../Utils/Spotify';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
// import { trackPromise } from 'react-promise-tracker';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New playlist'
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    let search = this.state.searchResults;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
    search = search.filter(current => current.id !== track.id);
    this.setState({searchResults: search});
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let search = this.state.searchResults;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({playlistTracks: tracks});
    if (search.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    search.push(track);
    this.setState({searchResults: search});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    // trackPromise(
      this.setState({loading: true});
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          loading: false,
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      })
    // )
  }

  search(search) {
    // trackPromise(
      this.setState({loading: true});
      Spotify.search(search).then(searchResults => {
        this.setState({loading: false, searchResults: searchResults})
      })
    // )
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {this.state.loading ? <LoadingIndicator /> : <SearchBar onSearch={this.search}/>}
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
