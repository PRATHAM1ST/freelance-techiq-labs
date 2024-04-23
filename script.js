const allContainers = document.querySelectorAll(".container");

function expandthecontainer(container) {
	gsap.to(container, {
		duration: 1,
		height: 400,
		ease: "power2.inOut",
		stagger: 0.3,
	});
}

allContainers.forEach((container) => {
	container.addEventListener("click", () => {
		expandthecontainer(container);
	});
});
