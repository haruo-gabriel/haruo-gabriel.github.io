document.addEventListener("DOMContentLoaded", function () {
	// Get all navigation items and content sections
	const navItems = document.querySelectorAll(".nav-item");
	const contentSections = document.querySelectorAll(".content-section");

	// Function to show a specific section
	function showSection(sectionId) {
		// Hide all content sections
		contentSections.forEach((section) => {
			section.classList.remove("active");
		});

		// Show the selected section
		const targetSection = document.getElementById(sectionId);
		if (targetSection) {
			targetSection.classList.add("active");
		}

		// Update navigation active state
		navItems.forEach((item) => {
			item.classList.remove("active");
		});

		// Add active class to clicked nav item
		const activeNavItem = document.querySelector(
			`[data-section="${sectionId}"]`
		);
		if (activeNavItem) {
			activeNavItem.classList.add("active");
		}
	}

	// Add click event listeners to navigation items
	navItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();
			const sectionId = this.getAttribute("data-section");
			showSection(sectionId);
		});
	});

	// Smooth scrolling for better UX
	function smoothScrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	// Add smooth scroll when switching sections
	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			smoothScrollToTop();
		});
	});

	// Social media links functionality (optional)
	const socialIcons = document.querySelectorAll(".social-icon");
	socialIcons.forEach((icon) => {
		icon.addEventListener("click", function (e) {
			// Remove the preventDefault for social icons so links work
		});
	});

	// Keyboard navigation support
	document.addEventListener("keydown", function (e) {
		const currentActiveNav = document.querySelector(".nav-item.active");
		const navItemsArray = Array.from(navItems);
		const currentIndex = navItemsArray.indexOf(currentActiveNav);

		if (e.key === "ArrowDown" && currentIndex < navItemsArray.length - 1) {
			e.preventDefault();
			const nextItem = navItemsArray[currentIndex + 1];
			const sectionId = nextItem.getAttribute("data-section");
			showSection(sectionId);
		} else if (e.key === "ArrowUp" && currentIndex > 0) {
			e.preventDefault();
			const prevItem = navItemsArray[currentIndex - 1];
			const sectionId = prevItem.getAttribute("data-section");
			showSection(sectionId);
		}
	});

	// Initialize with first section active
	showSection("sobre-mim");

	// Modal functionality for album covers
	const modal = document.createElement("div");
	modal.classList.add("modal");
	document.body.appendChild(modal);

	const modalImage = document.createElement("img");
	modal.appendChild(modalImage);

	const albumCovers = document.querySelectorAll(".release-img");

	albumCovers.forEach((cover) => {
		cover.addEventListener("click", () => {
			modalImage.src = cover.src;
			modal.classList.add("active");
		});
	});

	modal.addEventListener("click", () => {
		modal.classList.remove("active");
	});
});
