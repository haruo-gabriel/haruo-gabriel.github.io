import { initializeContent } from "./content-generator.js";
import { renderSidebar, updateNavigationState } from "./sidebar.js";
import {
	initializePaperPreviews,
	setupPaperHandlers,
	displayPoem,
} from "./poem.js";

document.addEventListener("DOMContentLoaded", function () {
	// Initialize dynamic content generation
	initializeContent();

	// Initialize sidebar
	const sidebarContainer = document.querySelector(".sidebar");
	renderSidebar(sidebarContainer, "sobre-mim", (sectionId) => {
		// Connect sidebar navigation to showSection function
		if (window.showSection) {
			window.showSection(sectionId);
		}
	});

	// Make functions available globally
	window.updateNavigationState = updateNavigationState;
	window.initializePaperPreviews = initializePaperPreviews;
	window.setupPaperHandlers = setupPaperHandlers;
	window.displayPoem = displayPoem;

	// Cache frequently accessed elements
	const contentSections = document.querySelectorAll(".content-section");

	// Function to show a specific section - exposed globally for sidebar integration
	window.showSection = function showSection(sectionId) {
		// Update content sections cache after dynamic generation
		const contentSections = document.querySelectorAll(".content-section");

		// Hide all content sections
		contentSections.forEach((section) => {
			section.classList.remove("active");
		});

		// Show the selected section
		const targetSection = document.getElementById(sectionId);
		if (targetSection) {
			targetSection.classList.add("active");
		}

		// Update navigation active state using sidebar function
		if (window.updateNavigationState) {
			window.updateNavigationState(sectionId);
		}

		// Smooth scroll to top
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	// Initialize with first section active
	window.showSection("sobre-mim");

	// Modal functionality for project images using event delegation
	const modal = document.createElement("div");
	modal.classList.add("modal");
	document.body.appendChild(modal);

	const modalImage = document.createElement("img");
	modal.appendChild(modalImage);

	// Use event delegation for project images (handles dynamically added images)
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("project-img")) {
			modalImage.src = e.target.src;
			modal.classList.add("active");
		}
	});

	modal.addEventListener("click", () => {
		modal.classList.remove("active");
	});

	// Paper modal functionality
	const paperModal = document.createElement("div");
	paperModal.classList.add("paper-modal");
	document.body.appendChild(paperModal);

	const paperContent = document.createElement("div");
	paperContent.classList.add("paper-content");
	paperModal.appendChild(paperContent);

	const paperClose = document.createElement("div");
	paperClose.classList.add("paper-close");
	paperClose.innerHTML = "&times;";
	paperContent.appendChild(paperClose);

	// Function to close modal
	function closeModal() {
		paperModal.classList.remove("active");
		setTimeout(() => {
			paperModal.style.display = "none";
		}, 300);
	}

	// Function to show poem modal
	async function showPoemModal(poemKey) {
		// Show modal immediately with loading state
		paperModal.style.display = "flex";
		requestAnimationFrame(() => {
			paperModal.classList.add("active");
		});

		// Use poem module to display poem
		if (window.displayPoem) {
			const poem = await window.displayPoem(poemKey, paperContent);

			// Re-attach close event listener
			const closeBtn = paperContent.querySelector(".paper-close");
			if (closeBtn) {
				closeBtn.addEventListener("click", () => {
					closeModal();
				});
			}
		}
	}

	// Initialize poem previews and handlers
	if (window.initializePaperPreviews) {
		window.initializePaperPreviews();
	}

	if (window.setupPaperHandlers) {
		window.setupPaperHandlers(showPoemModal);
	}

	// Close modal when clicking outside the content
	paperModal.addEventListener("click", (e) => {
		if (e.target === paperModal) {
			closeModal();
		}
	});

	// Close modal with Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && paperModal.classList.contains("active")) {
			closeModal();
		}
	});
});
