// js/sidebar.js
export function renderSidebar(container, activeSection = "sobre-mim", onNavClick) {
    const sections = [
        { id: "sobre-mim", label: "sobre mim" },
        { id: "musicas", label: "músicas" },
        { id: "textos", label: "textos" },
        { id: "eletronicos", label: "eletrônicos" },
        { id: "softwares", label: "softwares" },
        { id: "pesquisas", label: "pesquisas" }
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
                ${sections.map(section => `
                    <li>
                        <a href="#" class="nav-item${section.id === activeSection ? " active" : ""}" data-section="${section.id}">${section.label}</a>
                    </li>
                `).join("")}
            </ul>
        </nav>
    `;

    // Navigation click handler using event delegation
    const navList = container.querySelector('.main-nav ul');
    navList.addEventListener('click', e => {
        const item = e.target.closest('.nav-item');
        if (item) {
            e.preventDefault();
            if (onNavClick) onNavClick(item.dataset.section);
        }
    });
}
