const navbarLinks = document.querySelectorAll('.side-navbar a');

function addHoverEventListner() {
    navbarLinks.forEach((link) => {
        const linkText = link.textContent;
        link.addEventListener('mouseover', () => {
            gsap.to(link, {
                duration: 0.3,
                color: 'black',
                ease: 'sine.inOut',
            });
        });

        link.addEventListener('mouseout', () => {
            gsap.to(link, {
                duration: 0.3,
                color: 'white',
                ease: 'sine.inOut',
            });
        });
    });
}

addHoverEventListner();