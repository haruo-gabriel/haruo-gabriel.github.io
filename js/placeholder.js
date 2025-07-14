// js/placeholder.js

// Generates a square canvas filled with a solid color
function createPlaceholderCanvas(size = 300, color = "#333") {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, size, size);
	return canvas;
}

// Replaces project-cover divs containing a placeholder image with a placeholder-canvas div
window.replacePlaceholderDivs = function replacePlaceholderDivs() {
	const placeholderDivs = document.querySelectorAll(".placeholder-canvas");
	placeholderDivs.forEach((div) => {
		// Avoid duplicating canvas if already present
		if (!div.querySelector("canvas")) {
			// Use parent .project-cover width if available, else default to 300px to match project images
			const parentCover = div.closest(".project-cover");
			let size = 300;
			if (parentCover) {
				const rect = parentCover.getBoundingClientRect();
				size = Math.max(rect.width, rect.height, 300);
			}
			div.appendChild(createPlaceholderCanvas(size));
		}
	});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", window.replacePlaceholderDivs);
} else {
	window.replacePlaceholderDivs();
}
