export default function Loading() {
    return (
        <div className="preloader z-30 fixed top-0 left-0 visible opacity-100 bg-black w-full h-full text-center transition-all ease-out duration-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-4 font-outfit font-normal uppercase text-white">
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader">L</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-100">O</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-200">A</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-300">D</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-400">I</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-500">N</span>
                <span className="opacity-100 inline-block transition ease-linear duration-100 animate-loader animation-delay-600">G</span>
            </div>
        </div>
    )
}