import Footer from "../components/footer";
import Header from "../components/header";

export default function Home({clientId}) {

    function connect() {
        window.location.href = "https://accounts.spotify.com/authorize" + "?response_type=code" + "&client_id=" + clientId + "&scope=user-library-read playlist-read-private user-modify-playback-state playlist-modify-private playlist-read-collaborative" + "&redirect_uri=" + window.location.href + "callback"
        "&state=0";
    }

    function _TimeLineElement({step, title, description}) {
        return (
            <li className="mb-10 ml-5">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400">{step}</time>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mb-4 text-base font-normal text-gray-500">{description}</p>
            </li>
        )
    }

    return (
        <div>
            <Header/>
            <div className="text-center pt-16 pb-16 mx-5">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to Advanced Shuffle!</h1>
                <p className="pt-4 pb-16">Transform your music experience with ease - create customized Shuffles, queues and playlists in just a few simple steps!</p>
                <button className="bg-green text-white py-2 px-6 rounded-full text-xl"
                    onClick={connect}>
                    Log in with Spotify
                </button>
            </div>
            <div className="bg-gray-50 pt-8 pb-8 px-5 lg:px-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">How does it work?</h2>
                <ol className="relative border-l border-gray-200 mx-auto max-w-6xl mt-5">
                    <_TimeLineElement step="First step" title="Connect with Spotify" description="To enjoy the seamless shuffle of your favorite songs, all you need to do is connect this app with your Spotify account. Simply click on the big button and you'll be redirected to Spotify's authorization page. There, grant the app access to your Spotify account."></_TimeLineElement>
                    <_TimeLineElement step="Second step" title="Select your favorite playlists" description="Once you've connected the app with your Spotify account, you can start selecting the playlists you want to be shuffled. You can choose as many playlists as you like."></_TimeLineElement>
                    <_TimeLineElement step="Third step" title="Adjust your Shuffle" description="To make your shuffle truly unique, after selecting your playlists, you have the option to adjust the weight of each playlist. The higher the percentage assigned to a playlist, the more frequently its songs will appear in your shuffle."></_TimeLineElement>
                    <_TimeLineElement step="Last step" title="Thats it!" description="You can choose the number of songs that should be included and determine how you want to save your shuffle. If you select the playlist mode, you'll need to provide a name for the playlist. Simply click the big button and the shuffle will be added to your Spotify account."></_TimeLineElement>
                </ol>
            </div>
            <Footer/>
        </div>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            clientId: process.env.CLIENT_ID
        }
    };
}
