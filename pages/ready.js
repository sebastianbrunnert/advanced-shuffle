import Router from "next/router";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { HttpRequest } from "../utils/http";

const ProcessStatus = {
    NOT_STARTED: 0,
    LOADING: 1,
    DONE: 2,
}

export default function ReadyPage() {

    const [possibleSongs, setPossibleSongs] = useState(0);
    const [maxSongs, setMaxSongs] = useState(0);
    const [processStatus, setProcessStatus] = useState(ProcessStatus.NOT_STARTED);
    const [saveInPlaylist, setSaveInPlaylist] = useState(true);
    const [playlistName, setPlaylistName] = useState("Shuffle");

    useEffect(() => {
        if (!process.choosed || process.choosed.some((playlist) => !playlist.tracks)) {
            Router.push("/create")
            return;
        }    

        const total = process.choosed.reduce((acc, playlist) => acc + playlist.tracks?.total ?? 0, 0);

        setPossibleSongs(total);
        setMaxSongs(total);
    }, []);

    async function loadTracks(playlist, offset) {
        const req = new HttpRequest();
        req.setUrl(playlist.id == "liked" ? "https://api.spotify.com/v1/me/tracks?limit=50&offset=" + offset : "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks?limit=100&offset=" + offset);
        return await req.get().then((response) => {
            if (response.total > offset) {
                return loadTracks(playlist, offset + (playlist.id == "liked" ? 50 : 100)).then((tracks) => {
                    return response.items.concat(tracks);
                });
            } else {
                return response.items;
            }
        });
    }

    async function getUserId() {
        const req = new HttpRequest();
        req.setUrl("https://api.spotify.com/v1/me");
        return await req.get().then((response) => response.id);
    }

    async function addToQueue(tracks) {
        tracks = tracks.map((track) => track.track.uri.replace("spotify:track:", ""));

        for (let i = 0; i < tracks.length; i++) {
            const req = new HttpRequest();
            req.setUrl("https://api.spotify.com/v1/me/player/queue?uri=spotify:track:" + tracks[i]);
            await req.post();
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setProcessStatus(ProcessStatus.DONE);
    }
    
    async function createPlaylist(tracks) {
        tracks = tracks.map((track) => track.track.uri);

        const chunks = [];
        for (let i = 0; i < tracks.length; i += 100) {
            chunks.push(tracks.slice(i, i + 100));
        }

        const req = new HttpRequest();
        req.setUrl("https://api.spotify.com/v1/users/" + await getUserId() + "/playlists");
        req.setBody({
            name: playlistName,
            public: false
        });

        const playlistId = await req.post().then((response) => response.id);

        for (let i = 0; i < chunks.length; i++) {
            const req = new HttpRequest();
            req.setUrl("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks");
            req.setBody({
                uris: chunks[i]
            });
            await req.post();
        }

        setProcessStatus(ProcessStatus.DONE);
    }

    const shuffle = () => {
        setProcessStatus(ProcessStatus.LOADING);

        const playlists = process.choosed.filter((playlist) => playlist.tracks.total > 0);

        Promise.all(playlists.map(playlist => loadTracks(playlist, 0).then((tracks) => playlist.tracks = tracks))).then(() => {
            var shuffled = [];
            
            playlists.forEach((playlist) => {
                for(var i = 0; i < playlist.percentage/100 * maxSongs; i++) {
                    if(playlist.tracks.length == 0) break;

                    const randomTrack = playlist.tracks[Math.floor(Math.random() * playlist.tracks.length)];

                    shuffled.push(randomTrack);

                    playlists.forEach((p) => p.tracks = p.tracks.filter((t) => t.track.id != randomTrack.track.id));
                }
            });

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            if(shuffled.length < maxSongs) {
                const randomTracks = playlists.reduce((acc, playlist) => acc.concat(playlist.tracks), []);
                for(var i = 0; i < maxSongs - shuffled.length; i++) {
                    if(randomTracks.length == 0) break;
                    shuffled.push(randomTracks[Math.floor(Math.random() * randomTracks.length)]);
                }
            }

            if(saveInPlaylist) {
                createPlaylist(shuffled);
            } else {
                addToQueue(shuffled);
            }
        });

    }

    return (
        <div>
            <Header />

            {processStatus == ProcessStatus.LOADING ? <Spinner /> : processStatus == ProcessStatus.NOT_STARTED ? <div>
                <div className="pt-16 mx-5">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Create your Shuffle</h1>
                    <div className="mx-auto max-w-3xl mt-5">
                        <span className="text-lg font-semibold">Maximum shuffled songs</span>
                        <span className="text-sm text-gray-500"> ({maxSongs} tracks, may vary)</span>
                        <input type="range" min="1" value={maxSongs} max={possibleSongs} onChange={(e) => setMaxSongs(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" />
                        
                        <div className="mt-5">
                            <span className="text-lg font-semibold">Shuffle mode</span>
                            <select className="form-select w-full bg-gray-200 rounded-lg cursor-pointer mt-3 p-2.5 block" value={saveInPlaylist} onChange={(e) => setSaveInPlaylist(e.target.value == "true")}>
                                <option default disabled>How do you want to listen to the Shuffle?</option>
                                <option value={true}>Save shuffle to new playlist</option>
                                <option value={false}>Add shuffle to queue</option>
                            </select>
                        </div>

                        {saveInPlaylist && (
                            <div className="mt-5">
                                <span className="text-lg font-semibold">Playlist name</span>
                                <input type="text" onChange={(e) => setPlaylistName(e.target.value)} value={playlistName} className="form-input w-full bg-gray-200 rounded-lg cursor-pointer mt-3 p-2.5 block" placeholder="My shuffle" />
                            </div>
                        )}

                        <button disabled={playlistName.length == 0} className="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 disabled:bg-purple-300 rounded mt-10" onClick={shuffle}>Save Shuffle</button>
                    </div>
                </div>
            </div> : <div className="pt-16 mx-5">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Your Shuffle is ready!</h1>
                <div className="mx-auto max-w-3xl mt-10">
                    <button className="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded mt-5" onClick={() => Router.push("/create")}>Create new Shuffle</button>
                </div>
            </div>}
            <Footer />
        </div>
    )
}