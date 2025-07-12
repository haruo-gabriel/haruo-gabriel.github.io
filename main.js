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

	// Modal functionality for project images
	const modal = document.createElement("div");
	modal.classList.add("modal");
	document.body.appendChild(modal);

	const modalImage = document.createElement("img");
	modal.appendChild(modalImage);

	const projectImages = document.querySelectorAll(".project-img");

	projectImages.forEach((image) => {
		image.addEventListener("click", () => {
			modalImage.src = image.src;
			modal.classList.add("active");
		});
	});

	modal.addEventListener("click", () => {
		modal.classList.remove("active");
	});

	// Glow animation functionality for profile elements
	const profilePic = document.querySelector(".profile-pic");
	const profileName = document.querySelector(".profile-name");
	const profileDescription = document.querySelector(".profile-description");

	// Function to toggle glow animation
	function toggleGlow(element) {
		element.classList.toggle("glow-active");
	}

	// Add click event listeners to profile elements
	if (profilePic) {
		profilePic.addEventListener("click", function () {
			toggleGlow(this);
		});
	}

	if (profileName) {
		profileName.addEventListener("click", function () {
			toggleGlow(this);
		});
	}

	if (profileDescription) {
		profileDescription.addEventListener("click", function () {
			toggleGlow(this);
		});
	}

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
		const filePath = fileName || `textos/${poemKey}.md`;
		return loadPoemFromMarkdown(poemKey, filePath);
	}

	// Function to generate preview text from content
	function generatePreview(content, maxLength = 300) {
		// Remove extra whitespace and newlines
		const cleanContent = content.replace(/\s+/g, ' ').trim();
		
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
		
		// If no good sentence break, just cut at word boundary
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
				poem = await loadPoemFromMarkdown(poemKey, `textos/${poemKey}.md`);
			}
			
			if (poem) {
				// Update title
				titleElement.textContent = poem.title;
				
				// Update preview with generated preview text
				previewElement.textContent = generatePreview(poem.content);
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

	// Add click event listeners to paper previews
	const paperPreviews = document.querySelectorAll('.project-paper');
	paperPreviews.forEach(paper => {
		paper.addEventListener('click', async (e) => {
			e.preventDefault();
			const poemKey = paper.getAttribute('data-poem');
			await displayPoem(poemKey);
		});
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
