document.addEventListener("DOMContentLoaded", function () {
	// Cache frequently accessed elements
	const contentSections = document.querySelectorAll(".content-section");

	// Function to show a specific section - exposed globally for sidebar integration
	window.showSection = function showSection(sectionId) {
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

	// Poem content storage
	const poemContent = {};

	// Function to fetch and parse markdown file
	async function loadPoemFromMarkdown(poemKey, filePath) {
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Failed to load ${filePath}: ${response.status}`);
			}
			
			const markdownText = await response.text();
			
			// Parse markdown: first line is the title (# Title), rest is content
			const lines = markdownText.trim().split('\n');
			
			// Find the title line (first line starting with #)
			let titleLine = lines.find(line => line.trim().startsWith('#'));
			const title = titleLine ? titleLine.replace(/^#+\s+/, '') : 'Sem Título';
			
			// Find the index of the title line
			const titleIndex = lines.findIndex(line => line.trim().startsWith('#'));
			
			// Get content after title (skip empty lines)
			const contentLines = lines.slice(titleIndex + 1);
			const content = contentLines.join('\n').trim();
			
			poemContent[poemKey] = {
				title: title,
				content: content
			};
			
			return poemContent[poemKey];
		} catch (error) {
			console.error(`Error loading poem ${poemKey}:`, error);
			// Fallback content
			poemContent[poemKey] = {
				title: "Erro",
				content: "Não foi possível carregar o poema. Verifique se o arquivo existe."
			};
			return poemContent[poemKey];
		}
	}

	// Helper function to register a new poem
	function registerPoem(poemKey, fileName = null) {
		const filePath = fileName || `assets/textos/${poemKey}.md`;
		return loadPoemFromMarkdown(poemKey, filePath);
	}

	// Function to generate preview text from content
	function generatePreview(content, maxLength = 300) {
		// Clean content but preserve line breaks
		const cleanContent = content
			.replace(/\t/g, ' ')  // Replace tabs with spaces
			.replace(/ {2,}/g, ' ')  // Replace multiple spaces with single space
			.replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newlines
			.trim();
		
		if (cleanContent.length <= maxLength) {
			return cleanContent;
		}
		
		// Find the last complete sentence within the limit
		const truncated = cleanContent.substring(0, maxLength);
		const lastPeriod = truncated.lastIndexOf('.');
		const lastQuestionMark = truncated.lastIndexOf('?');
		const lastExclamation = truncated.lastIndexOf('!');
		
		const lastSentenceEnd = Math.max(lastPeriod, lastQuestionMark, lastExclamation);
		
		if (lastSentenceEnd > maxLength * 0.7) {
			return truncated.substring(0, lastSentenceEnd + 1);
		}
		
		// If no good sentence break, try to cut at line break
		const lastLineBreak = truncated.lastIndexOf('\n');
		if (lastLineBreak > maxLength * 0.5) {
			return truncated.substring(0, lastLineBreak) + '...';
		}
		
		// If no good line break, cut at word boundary
		const lastSpace = truncated.lastIndexOf(' ');
		return truncated.substring(0, lastSpace) + '...';
	}

	// Function to update paper preview content
	async function updatePaperPreview(paperElement, poemKey) {
		const titleElement = paperElement.querySelector('.paper-title');
		const previewElement = paperElement.querySelector('.paper-preview');
		
		try {
			let poem = poemContent[poemKey];
			
			// Load poem if not already loaded
			if (!poem) {
				poem = await loadPoemFromMarkdown(poemKey, `assets/textos/${poemKey}.md`);
			}
			
			if (poem) {
				// Update title
				titleElement.textContent = poem.title;
				
				// Update preview with generated preview text, preserving line breaks
				const previewText = generatePreview(poem.content);
				previewElement.innerHTML = previewText.replace(/\n/g, '<br>');
			}
		} catch (error) {
			console.error(`Error updating preview for ${poemKey}:`, error);
			previewElement.textContent = 'Erro ao carregar prévia do poema.';
		}
	}

	// Function to initialize all paper previews
	async function initializePaperPreviews() {
		const paperElements = document.querySelectorAll('.project-paper');
		
		// Load all poems in parallel
		const loadPromises = Array.from(paperElements).map(async (paperElement) => {
			const poemKey = paperElement.getAttribute('data-poem');
			if (poemKey) {
				await updatePaperPreview(paperElement, poemKey);
			}
		});
		
		await Promise.all(loadPromises);
	}

	// Initialize poem content and previews
	initializePaperPreviews();

	// Function to display poem in modal
	async function displayPoem(poemKey) {
		// Show loading state
		paperContent.innerHTML = `
			<div class="paper-close">&times;</div>
			<div style="text-align: center; padding: 50px;">
				<p style="font-size: 1.2rem; color: #666;">Carregando...</p>
			</div>
		`;

		// Show modal immediately with loading state
		paperModal.style.display = 'flex';
		requestAnimationFrame(() => {
			paperModal.classList.add('active');
		});

		let poem = poemContent[poemKey];
		
		// If poem is not loaded yet, try to load it
		if (!poem) {
			const filePath = `textos/${poemKey}.md`;
			poem = await loadPoemFromMarkdown(poemKey, filePath);
		}
		
		if (!poem) return;

		// Update content with actual poem
		paperContent.innerHTML = `
			<div class="paper-close">&times;</div>
			<h1>${poem.title}</h1>
			${poem.content.split('\n\n').map(paragraph => 
				paragraph.trim() ? `<p>${paragraph}</p>` : ''
			).join('')}
		`;

		// Re-attach close event listener
		const closeBtn = paperContent.querySelector('.paper-close');
		closeBtn.addEventListener('click', () => {
			closeModal();
		});
	}

	// Function to close modal
	function closeModal() {
		paperModal.classList.remove('active');
		setTimeout(() => {
			paperModal.style.display = 'none';
		}, 300);
	}

	// Add click event listeners to paper previews using event delegation
	document.addEventListener("click", async (e) => {
		const paper = e.target.closest('.project-paper');
		if (paper) {
			e.preventDefault();
			const poemKey = paper.getAttribute('data-poem');
			await displayPoem(poemKey);
		}
	});

	// Close modal when clicking outside the content
	paperModal.addEventListener('click', (e) => {
		if (e.target === paperModal) {
			closeModal();
		}
	});

	// Close modal with Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && paperModal.classList.contains('active')) {
			closeModal();
		}
	});
});
