import Router from "next/router";
import { useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Skeleton from "../components/skeleton";
import { HttpRequest } from "../utils/http";

export default function Callback({ token }) {
    
    useEffect(() => {
        localStorage.setItem("token", token);
        Router.push("/create");
    }, [token])

    return (
        <div>
            <Header />
            <div className="text-center pt-16 mx-5">
                <h1 className="text-3xl font-bold text-gray-800">Your Playlists</h1>
                <Skeleton rounds={3} />
            </div>
            <Footer />
        </div>
    );
}

export async function getServerSideProps(context) {
    if (!context.query.code) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const url = "https://accounts.spotify.com/api/token" +
        "?grant_type=authorization_code" +
        "&code=" + context.query.code +
        "&redirect_uri=" + context.req.headers.referer.split('://')[0] + "://" + context.req.headers.host + "/callback" +
        "&client_id=" + process.env.CLIENT_ID +
        "&client_secret=" + process.env.CLIENT_SECRET;

    const req = new HttpRequest();
    req.setUrl(url);
    req.setHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    const token = await req.post().then((response) => response.access_token);

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            token: token
        }
    }
}