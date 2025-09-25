// Header Component
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";

function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const { language, changeLanguage, LANGUAGES } = useLanguage();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Effect to handle scroll event
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
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
			} bg-moso-black p-4 fixed top-0 left-0 w-full transition-all duration-300`}
		>
			<div className="flex items-center space-x-4 h-full">
				<img
					src="/pfp.png"
					alt="Profile Picture"
					className={`${
						isScrolled ? "h-12" : "h-20"
					} w-auto object-cover transition-all duration-300`}
				/>
				<div className="flex flex-col">
					<h1
						className={`${
							isScrolled ? "text-3xl" : "text-5xl"
						} text-moso-blue font-normal transition-all duration-300`}
					>
						g. haruo
					</h1>
					<p
						className={`${
							isScrolled ? "hidden" : "visible"
						} italic text-moso-blue`}
					>
						{translations[language]?.header?.quote ||
							'"tudo que vejo são formas e cores"'}
					</p>
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
					<ul className="flex flex-col">
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
