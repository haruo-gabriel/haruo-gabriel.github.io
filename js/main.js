document.addEventListener('DOMContentLoaded', () => {

    // Smooth page transitions (Optional but feels premium)
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.href;
            
            // Fade out the body
            document.body.style.animation = 'none'; // reset previous
            document.body.style.transition = 'opacity 0.4s easeOut';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        });
    });
});
