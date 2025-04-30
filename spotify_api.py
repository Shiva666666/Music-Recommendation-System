import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
#from dotenv import load_dotenv

# Hardcoded Spotify credentials
SPOTIFY_CLIENT_ID = '403b996be5874a149712d8d43bdc7541'
SPOTIFY_CLIENT_SECRET = '88ee436bdebc41969e53369d73c6736c'

# Spotify authentication
auth_manager = SpotifyClientCredentials(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET
)
sp = spotipy.Spotify(auth_manager=auth_manager)

def search_song(song_name, artist_name=None):
    query = f"{song_name} {artist_name}" if artist_name else song_name
    results = sp.search(q=query, limit=1, type='track')
    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        return {
            'track_name': track['name'],
            'artist': track['artists'][0]['name'],
            'album': track['album']['name'],
            'album_cover': track['album']['images'][0]['url'],  # Big image
            'spotify_link': track['external_urls']['spotify']
        }
    else:
        return None 