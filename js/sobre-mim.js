// js/sobre-mim.js

// Custom HTML for the sobre-mim section
export function getSobreMimHTML() {
	return `
        <section class="content-section active" id="sobre-mim">
            <h2>sobre mim</h2>
            <p>Conheça um pouco sobre mim e meu trabalho por meio deste portfólio digital.</p>
        </section>
    `;
}

// Function to apply the custom sobre-mim content to the main-content div
export function applySobreMimContent() {
	const mainContent = document.querySelector(".main-content");
	if (mainContent) {
		mainContent.innerHTML = getSobreMimHTML();
	}
}
