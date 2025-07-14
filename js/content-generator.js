// js/content-generator.js
import { contentData } from './data.js';

// Generate cover/media content based on type
function generateCover(item) {
    switch (item.type) {
        case 'image':
            return `
                <div class="project-cover">
                    <img src="${item.cover}" alt="${item.alt}" class="project-img" />
                </div>
            `;
        case 'paper':
            return `
                <div class="project-paper" data-poem="${item.poemKey}">
                    <div class="paper-title">${item.title}</div>
                    <div class="paper-preview">Carregando...</div>
                </div>
            `;
        case 'placeholder':
            return `
                <div class="project-cover">
                    <div class="placeholder-canvas"></div>
                </div>
            `;
        case 'custom':
            return item.customContent;
        case 'empty':
        default:
            return '';
    }
}

// Generate project item
function generateProjectItem(item) {
    const cover = generateCover(item);
    const hasTextContent = item.title || item.description || item.tag;
    
    if (!hasTextContent && item.type === 'empty') {
        return `
            <div class="project-item">
                <h3></h3>
                <p></p>
            </div>
        `;
    }
    
    return `
        <div class="project-item">
            ${cover}
            <div>
                <h3>${item.title || ''}</h3>
                <p>${item.tag ? `tag: ${item.tag}` : (item.description || '')}</p>
            </div>
        </div>
    `;
}

// Generate entire content section
function generateContentSection(sectionId, data) {
    const isActive = sectionId === 'sobre-mim' ? ' active' : '';
    const descriptions = data.description.map(desc => `<p>${desc}</p>`).join('');
    
    let itemsHTML = '';
    if (data.items && data.items.length > 0) {
        const projectItems = data.items.map(item => generateProjectItem(item)).join('');
        itemsHTML = `
            <div class="project-grid">
                ${projectItems}
            </div>
        `;
    }
    
    return `
        <div class="content-section${isActive}" id="${sectionId}">
            <h2>${data.title}</h2>
            ${descriptions}
            ${itemsHTML}
        </div>
    `;
}

// Generate all content sections
export function generateAllContent() {
    return Object.entries(contentData)
        .map(([sectionId, data]) => generateContentSection(sectionId, data))
        .join('');
}

// Initialize content generation
export function initializeContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = generateAllContent();
        
        // Reinitialize placeholder canvases after content is generated
        if (window.replacePlaceholderDivs) {
            window.replacePlaceholderDivs();
        }
        
        // Reinitialize paper previews
        if (window.initializePaperPreviews) {
            window.initializePaperPreviews();
        }
    }
}
