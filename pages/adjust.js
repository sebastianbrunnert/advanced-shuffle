import Router from "next/router";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Skeleton from "../components/skeleton";
import { Fractional } from "../utils/fractional";

export default function AdjustPage() {

    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        if (!process.choosed) {
            Router.push("/create")
            return;
        }
        process.choosed = process.choosed.filter((playlist) => playlist.tracks.total > 0)
        process.choosed.forEach((playlist) => {
            playlist.fracPercentage = new Fractional(100).divide(new Fractional(process.choosed.length))
            playlist.percentage = Math.round(10 * playlist.fracPercentage.toDecimal()) / 10;
        })
        setPlaylists(process.choosed);
    }, [])

    const adjust = (playlistId, percentage) => {
        var adjustedPlaylists = [...playlists];
    
        percentage = new Fractional(percentage);

        const index = adjustedPlaylists.findIndex((playlist) => playlist.id == playlistId);
        const previousPercentage = adjustedPlaylists[index].fracPercentage;
        adjustedPlaylists[index].fracPercentage = percentage;

        if(percentage.isBiggerThan(previousPercentage)) {
            adjustedPlaylists.forEach((playlist) => {
                if (playlist.id == playlistId) return;

                const portion = previousPercentage.equals(new Fractional(100)) ? new Fractional(0) 
                    : playlist.fracPercentage.divide(new Fractional(100).subtract(previousPercentage))
                
                playlist.fracPercentage = portion.multiply(new Fractional(100).subtract(percentage));
            })
        } else {
            const portion = previousPercentage.subtract(percentage).divide(new Fractional(adjustedPlaylists.length - 1));
            adjustedPlaylists.forEach((playlist) => {
                if (playlist.id == playlistId) return;
                playlist.fracPercentage = playlist.fracPercentage.add(portion);
            })
        }

        adjustedPlaylists.forEach((playlist) => {
            playlist.percentage = Math.round(100 * playlist.fracPercentage.toDecimal()) / 100;
        })
    
        setPlaylists(adjustedPlaylists);
    };

    const ready = () => {
        playlists.forEach((playlist) => {
            delete playlist.fracPercentage;
        })
        process.choosed = playlists;
        Router.push("/ready")
    }

    return (
        <div>
            <Header />
            <div className="pt-16 mx-5">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Adjust your Shuffle</h1>
                {playlists ? (
                    <div className="mx-auto max-w-3xl mt-5">
                        <ul className="space-y-3">
                            {playlists.map((playlist) => (
                                <li key={playlist.id} className="flex items-center bg-gray-50 text-gray-800 rounded hover:shadow">
                                    <img src={playlist.images[0].url} alt="Cover" className="flex-none w-24 h-24 rounded" />
                                    <div className="flex-1 mx-3">
                                        <h1>
                                            <span className="text-lg font-semibold">{playlist.name}</span>
                                            <span className="text-sm text-gray-500"> ({playlist.tracks.total} tracks)</span>
                                        </h1>
                                        <p className="text-md">{playlist.percentage}%</p>
                                        <input disabled={playlists.length <= 1} type="range" min="0" max="100" value={playlist.percentage} onChange={(e) => adjust(playlist.id, e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" />
                                    </div>
                                </li>
                            ), this)}
                        </ul>

                        <div className="text-center">
                            <button className="bg-purple-700 hover:bg-purple-900 text-white py-2 mt-5 px-6 rounded-full text-xl" onClick={ready}>
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
    )
}