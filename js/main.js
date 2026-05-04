document.addEventListener('DOMContentLoaded', () => {

    // Smooth page transitions 
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

window.addEventListener('pageshow', (event) => {
    // If the page was loaded from the bfcache (event.persisted is true),
    // or as a general safeguard, we reset the body styles so it's visible again.
    if (event.persisted || document.body.style.opacity === '0') {
        document.body.style.opacity = '1';
        document.body.style.animation = ''; // Remove inline animation to let CSS keyframes run if needed
        document.body.style.transition = ''; // Reset transition
    }
});
