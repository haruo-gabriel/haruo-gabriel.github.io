// js/sidebar.js
// Function to randomly select and set a profile picture
function setRandomProfilePicture() {
	const pfpImages = [
		'assets/images/pfp/00-mousou.png',
		'assets/images/pfp/01-stippling.png',
		'assets/images/pfp/02-dots.png',
		'assets/images/pfp/03-patterns.png',
		'assets/images/pfp/04-bevel.png',
		'assets/images/pfp/dithering_animation-full.gif'
	];
	
	const randomIndex = Math.floor(Math.random() * pfpImages.length);
	const selectedImage = pfpImages[randomIndex];
	
	const profilePic = document.querySelector('.profile-pic');
	if (profilePic) {
		profilePic.src = selectedImage;
		profilePic.alt = 'profile picture';
	}
}

export function renderSidebar(
	container,
	activeSection = "sobre-mim",
	onNavClick
) {
	const sections = [
		{ id: "sobre-mim", label: "sobre mim" },
		{ id: "musicas", label: "músicas" },
		{ id: "textos", label: "textos" },
		{ id: "eletronicos", label: "eletrônicos" },
		{ id: "softwares", label: "softwares" },
		{ id: "pesquisas", label: "pesquisas" },
	];

	container.innerHTML = `
        <div class="profile-section">
            <div class="profile-row">
                <div class="profile-image">
                    <img src="assets/images/pfp.png" alt="profile picture" class="profile-pic" />
                </div>
                <div class="profile-text">
                    <h1 class="profile-name">g. haruo</h1>
                    <p class="profile-description">tudo que vejo são formas e cores.</p>
                </div>
            </div>
        </div>
        <div class="social-icons">
            <a href="https://github.com/haruo-gabriel" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>
            <a href="https://soundcloud.com/haruooo" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-soundcloud"></i></a>
            <a href="https://www.instagram.com/_haru.o/" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/@haruo_h/videos" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
        </div>
        <nav class="main-nav">
            <ul>
                ${sections
									.map(
										(section) => `
                    <li>
                        <a href="#" class="nav-item${
													section.id === activeSection ? " active" : ""
												}" data-section="${section.id}">${section.label}</a>
                    </li>
                `
									)
									.join("")}
            </ul>
        </nav>
    `;

    // Set a random profile picture after the HTML is rendered
    setRandomProfilePicture();

    // Navigation click handler using event delegation
    const navList = container.querySelector(".main-nav ul");
	navList.addEventListener("click", (e) => {
		const item = e.target.closest(".nav-item");
		if (item) {
			e.preventDefault();
			if (onNavClick) onNavClick(item.dataset.section);
		}
	});

	// Profile element glow animation using event delegation
	container.addEventListener("click", (e) => {
		if (e.target.matches(".profile-pic, .profile-name, .profile-description")) {
			e.target.classList.toggle("glow-active");
		}
	});

	// Keyboard navigation support
	document.addEventListener("keydown", function (e) {
		const currentActiveNav = document.querySelector(".nav-item.active");
		const navItems = document.querySelectorAll(".nav-item");
		const navItemsArray = Array.from(navItems);
		const currentIndex = navItemsArray.indexOf(currentActiveNav);

		if (e.key === "ArrowDown" && currentIndex < navItemsArray.length - 1) {
			e.preventDefault();
			const nextItem = navItemsArray[currentIndex + 1];
			const sectionId = nextItem.getAttribute("data-section");
			if (onNavClick) onNavClick(sectionId);
		} else if (e.key === "ArrowUp" && currentIndex > 0) {
			e.preventDefault();
			const prevItem = navItemsArray[currentIndex - 1];
			const sectionId = prevItem.getAttribute("data-section");
			if (onNavClick) onNavClick(sectionId);
		}
	});
}

// Function to update navigation active state
export function updateNavigationState(sectionId) {
	// Only update navigation active state, do NOT change profile picture
	const navItems = document.querySelectorAll(".nav-item");
	navItems.forEach((item) => {
		item.classList.remove("active");
	});

	const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
	if (activeNavItem) {
		activeNavItem.classList.add("active");
	}
}
