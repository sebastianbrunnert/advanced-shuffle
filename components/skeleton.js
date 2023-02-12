export default function Skeleton({
    rounds = 1
}) {
    const skeletons = [];

    for (let i = 0; i < rounds; i++) {
        skeletons.push (
            <div className="max-w-3xl animate-pulse mx-auto mt-5"
                key={i}>
                <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-xl mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-2xl mb-2.5"></div>
            </div>
        );
    }

    return (
        <div> {skeletons}
            <span className="sr-only text-center">Loading...</span>
        </div>
    )
}
