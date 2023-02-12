import { useEffect } from 'react';
import '../styles/globals.css'

function MyApp({Component, pageProps}) {
    useEffect(() => {
        document.title = "Advanced Shuffle";
    }, []);
    return <Component {...pageProps}/>
}

export default MyApp
