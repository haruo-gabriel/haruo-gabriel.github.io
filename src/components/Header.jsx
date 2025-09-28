// Header Component
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";
import { Link } from "react-router-dom";

function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const { language, changeLanguage, LANGUAGES } = useLanguage();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Effect to handle scroll event
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 4) {
				setIsScrolled(true); // Shrink header when scrolled down
			} else {
				setIsScrolled(false); // Reset header when at the top
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	return (
		<header
			className={`${
				isScrolled ? "min-h-16" : "min-h-24"
			} bg-moso-black p-4 md:px-8 fixed top-0 left-0 w-full transition-all duration-500`}
		>
			<div className="flex items-center space-x-4 h-full">
				{/* Clickable profile picture */}
				<div>
					<Link to="/" className="hover:opacity-80 transition-opacity">
						<img
							src="/pfp.png"
							alt="Profile Picture"
							className={`${
								isScrolled ? "h-12" : "h-27"
							} w-auto object-cover transition-all duration-300`}
						/>
					</Link>
				</div>
				<div className="flex flex-col space-y-2">
					{/* Clickable name */}
					<Link to="/" className="hover:opacity-80 transition-opacity">
						<div
							className={`${
								isScrolled ? "text-3xl" : "text-5xl"
							} text-moso-blue font-normal transition-all duration-300`}
						>
							g. haruo
						</div>
					</Link>
					{/* Quote */}
					<p
						className={`${
							isScrolled ? "hidden" : "visible"
						} italic text-moso-blue text-sm`}
					>
						{translations[language]?.header?.quote ||
							'"tudo que vejo são formas e cores"'}
					</p>
					{/* Social media icons */}
					<div
						className={`${
							isScrolled ? "hidden" : "visible"
						} flex flex-row gap-3`}
					>
						{/* Instagram */}
						<a
							href="https://www.instagram.com/_haru.o/"
							aria-label="Instagram"
							className="hover:opacity-70 transition-opacity"
						>
							<img
								src="/icons8-instagram-50.png"
								alt="Instagram"
								className="w-5 h-5 object-contain filter-moso-blue"
							/>
						</a>
						{/* SoundCloud */}
						<a
							href="https://soundcloud.com/haruooo"
							aria-label="SoundCloud"
							className="hover:opacity-70 transition-opacity"
						>
							<img
								src="/icons8-soundcloud-50.png"
								alt="SoundCloud"
								className="w-5 h-5 object-contain filter-moso-blue"
							/>
						</a>
						{/* Spotify */}
						<a
							href="https://open.spotify.com/artist/17GgEguj01TBALcXJjBwXB?si=HF4KLif5ThaydHJ8MosdsA"
							aria-label="Spotify"
							className="hover:opacity-70 transition-opacity"
						>
							<img
								src="/icons8-spotify-50.png"
								alt="Spotify"
								className="w-5 h-5 object-contain filter-moso-blue"
							/>
						</a>
						{/* YouTube */}
						<a
							href="https://www.youtube.com/@haruo_h"
							aria-label="YouTube"
							className="hover:opacity-70 transition-opacity"
						>
							<img
								src="/icons8-youtube-50.png"
								alt="YouTube"
								className="w-5 h-5 object-contain filter-moso-blue"
							/>
						</a>
						{/* GitHub */}
						<a
							href="https://github.com/haruo-gabriel"
							aria-label="GitHub"
							className="hover:opacity-70 transition-opacity"
						>
							<img
								src="/icons8-github-50.png"
								alt="GitHub"
								className="w-5 h-5 object-contain filter-moso-blue"
							/>
						</a>
					</div>
				</div>
				{/* Toggleable Menu Icon */}
				<div onClick={toggleMenu} className="cursor-pointer ml-auto">
					{isMenuOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24"
							className="fill-current text-moso-blue"
							aria-label="Close Menu"
						>
							<path
								d="M6 18L18 6M6 6l12 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24"
							className="fill-current text-moso-blue"
							aria-label="Menu icon"
						>
							<path d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z" />
						</svg>
					)}
				</div>
			</div>
			{/* Menu Selection */}
			{isMenuOpen && (
				<div className="text-moso-blue pt-4">
					<ul className="flex flex-col items-end">
						<li className="cursor-pointer">
							<div className="flex items-center space-x-2">
								<span>[</span>
								<button
									onClick={() => changeLanguage(LANGUAGES.PT_BR)}
									className={`hover:opacity-80 transition-opacity ${
										language === LANGUAGES.PT_BR ? "font-bold" : ""
									}`}
								>
									pt-BR
								</button>
								<span>|</span>
								<button
									onClick={() => changeLanguage(LANGUAGES.EN)}
									className={`hover:opacity-80 transition-opacity ${
										language === LANGUAGES.EN ? "font-bold" : ""
									}`}
								>
									en
								</button>
								<span>]</span>
							</div>
						</li>
					</ul>
				</div>
			)}
		</header>
	);
}

export default Header;
