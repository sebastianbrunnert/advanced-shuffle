import Link from "next/link";

export default function Header() {
    return (
        <header className="shadow-sm">
            <nav className="px-5 lg:px-6 py-3">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-2xl">
                    <a href="/" className="flex items-center">
                        <span className="self-center text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-red-400">Advanced Shuffle</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        <a target="_blank" rel="noreferrer" href="https://github.com/sebastianbrunnert/advanced-shuffle" className="text-white bg-purple-700 hover:bg-purple-900 font-medium rounded text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-3 focus:outline-none">View on GitHub</a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
