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

    // Image Zoom functionality
    const portraitImg = document.querySelector('.portrait-img');
    if (portraitImg) {
        portraitImg.addEventListener('click', () => {
            const isZoomed = portraitImg.classList.toggle('zoomed');
            
            if (isZoomed) {
                // Calculate distance to center of viewport
                const rect = portraitImg.getBoundingClientRect();
                const viewportCenterX = window.innerWidth / 2;
                const viewportCenterY = window.innerHeight / 2;
                const imageCenterX = rect.left + (rect.width / 2);
                const imageCenterY = rect.top + (rect.height / 2);
                
                const translateX = viewportCenterX - imageCenterX;
                const translateY = viewportCenterY - imageCenterY;
                
                // Calculate max scale to fit within 90% of viewport
                const scaleX = (window.innerWidth * 0.9) / rect.width;
                const scaleY = (window.innerHeight * 0.9) / rect.height;
                const scale = Math.min(scaleX, scaleY, 4.5); // cap at 4.5x scale
                
                // Apply dynamic transform
                portraitImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            } else {
                // Reset to default
                portraitImg.style.transform = '';
            }
        });
    }
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
