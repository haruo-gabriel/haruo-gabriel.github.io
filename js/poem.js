// js/poem.js

// Poem content storage
const poemContent = {};

// Initialize paper previews - made globally available
window.initializePaperPreviews = function initializePaperPreviews() {
	const paperElements = document.querySelectorAll('.project-paper');
	paperElements.forEach(paper => {
		const poemKey = paper.dataset.poem;
		if (poemKey && !poemContent[poemKey]) {
			updatePaperPreview(paper, poemKey);
		}
	});
};

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
	const filePath = fileName || `assets/textos/poemas/${poemKey}.md`;
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
			poem = await loadPoemFromMarkdown(poemKey, `assets/textos/poemas/${poemKey}.md`);
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
export async function initializePaperPreviews() {
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

// Function to display poem in modal
export async function displayPoem(poemKey, paperContent) {
	// Show loading state
	paperContent.innerHTML = `
		<div class="paper-close">&times;</div>
		<div style="text-align: center; padding: 50px;">
			<p style="font-size: 1.2rem; color: #666;">Carregando...</p>
		</div>
	`;

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

	return poem;
}

// Set up paper preview click handlers using event delegation
export function setupPaperHandlers(onPaperClick) {
	document.addEventListener("click", async (e) => {
		const paper = e.target.closest('.project-paper');
		if (paper) {
			e.preventDefault();
			const poemKey = paper.getAttribute('data-poem');
			if (onPaperClick) {
				onPaperClick(poemKey);
			}
		}
	});
}