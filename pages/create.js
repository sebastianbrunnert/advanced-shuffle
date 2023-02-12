import Router from "next/router";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Skeleton from "../components/skeleton";
import { HttpRequest } from "../utils/http";

export default function CreatePage() {

    const [playlistData, setPlaylistData] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [choosed, setChoosed] = useState([]);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        async function loadLikedCount() {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
    
            const req = new HttpRequest();
            req.setUrl("https://api.spotify.com/v1/me/tracks?total");
            return await req.get().then((response) => response.total);
        }
    
        async function loadPlaylists(playlists, offset) {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
    
            const req = new HttpRequest();
            req.setUrl("https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset);
            return await req.get().then((response) => {
                if (response.total > offset) {
                    return loadPlaylists(playlists.concat(response.items), offset + 50);
                }
                return playlists.concat(response.items);
            });
        }

        loadPlaylists([], 0).then((playlists) => {
            loadLikedCount().then((likedCount) => {
                if (!playlists || likedCount == undefined) {
                    Router.push("/");
                    return;
                }
                playlists.unshift({
                    id: "liked",
                    name: "Liked Songs",
                    images: [{
                        url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                    }],
                    tracks: {
                        total: likedCount
                    }
                })

                setPlaylistData(playlists)
                setPlaylists(playlists);
            })
        });
    }, [])

    const search = event => {
        const query = event.target.value.toLowerCase();
        const results = playlistData.filter((playlist) => playlist.name.toLowerCase().includes(query));
        setPlaylists(results);
    }

    const choose = (playlist) => {
        if (choosed.includes(playlist)) {
            setChoosed(choosed.filter((item) => item !== playlist));
        } else {
            setChoosed(choosed.concat(playlist));
        }
    }

    const adjust = () => {
        process.choosed = choosed
        Router.push("/adjust")
    }

    return (
        <div>
            <Header />
            <div className="pt-16 mx-5">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Your Playlists</h1>
                {playlists ? (
                    <div className="mx-auto max-w-3xl mt-5">
                        <input type="text" className="w-full border rounded px-3 py-2 mb-5" placeholder="Search for a playlist" onChange={search} />
                        <ul className="space-y-3">
                            {playlists.slice(0, limit).map((playlist) => (
                                <li key={playlist.id} className="flex items-center bg-gray-50 text-gray-800 rounded hover:shadow">
                                    {playlist.images.length === 0 ? (
                                        <div className="w-16 h-16 rounded bg-gray-200"></div>
                                    ) : (<img src={playlist.images[0].url} alt="Cover" className="w-16 h-16 rounded" />)}
                                    <div className="ml-3">
                                        <h2 className="text-lg font-semibold">{playlist.name}</h2>
                                        <p className="text-sm text-gray-500">{playlist.tracks.total} tracks</p>
                                    </div>
                                    <input type="checkbox" className="ml-auto cursor-pointer mr-3" defaultChecked={choosed.includes(playlist.id)} onChange={() => choose(playlist)} />
                                </li>
                            ), this)}
                        </ul>
                        {playlists.length > limit && (
                            <p className="text-center cursor-pointer mt-5 hover:underline" onClick={() => setLimit(limit + 10)}>
                                Load more
                            </p>
                        )}
                        {playlists.length === 0 && (
                            <p className="text-center">No playlists found.</p>
                        )}

                        <div className="text-center">
                            <button disabled={choosed.length < 1 || choosed.reduce((total, playlist) => total + playlist.tracks.total, 0) <= 1} className="bg-purple-700 hover:bg-purple-900 disabled:bg-purple-300 text-white py-2 mt-5 px-6 rounded-full text-xl" onClick={adjust}>
                                Next step
                            </button>
                        </div>
                    </div>
                ) : (
                    <Skeleton rounds={3} />
                )}
            </div>
            <Footer />
        </div>
    );
}