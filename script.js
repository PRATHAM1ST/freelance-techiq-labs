// gsap.registerPlugin(ScrollTrigger) || gsap.core.globals("ScrollTrigger");

const allContainers = document.querySelectorAll(".container");
let gsapScroll = false;

let currentContainer = null;

gsap.to(document.body, {
	duration: 1,
	scale: 0.75,
});

async function expandthecontainer(container) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	var viewHeight = window.innerHeight;
	var targetHeight = viewHeight * 0.6;
	var y = (viewHeight - 590) / 2;

	gsapScroll = true;

	await gsap.to(document.body, {
		duration: 1,
		scale: 1,
	});

	const snapping = gsap.to(window, {
		duration: 1,
		focus: true,
		ease: "power2.inOut",
		scrollTo: {
			y: container,
			offsetY: y,
		},
	});

	const containerAnimation = gsap.to(container, {
		duration: 1,
		x: 0,
		width: "100%",
		height: targetHeight,
		overflowX: "scroll",
		margin: "5rem 0",
		ease: "power2.inOut",
		gap: "2rem",
		stagger: 0.3,
		justifyContent: "start",
		paddingRight: "5rem",
		cursor: "grab",
	});

	const revealHiddenContentAnimation = gsap.to(
		"#" + container.id + "> .hidden",
		{
			duration: 1,
			overflow: "visible",
			width: "fit-content",
			ease: "power2.inOut",
			stagger: 0.3,
		}
	);

	await Promise.all([
		snapping,
		containerAnimation,
		revealHiddenContentAnimation,
	]);

	gsapScroll = false;

	currentContainer = container;

	const sections = [
		container.childNodes[3],
		...[...container.childNodes[5].childNodes].filter(
			(node) => node.nodeName === "DIV"
		),
	];

	let currentSection = 0;

	let containerCursorPositionClicked = {
		left: false,
		right: false,
	};

	container.addEventListener("mousemove", (e) => {
		const containerWidth = container.offsetWidth;
		const containerLeft = container.getBoundingClientRect().left;
		const mouseEnterX = e.clientX;

		// Check if mouse entered from the right side of 10% of the container width
		if (mouseEnterX > containerLeft + containerWidth * 0.8) {
			container.style.cursor = "var(--cursor-right)";
			containerCursorPositionClicked.right = true;
		} else if (mouseEnterX < containerLeft + containerWidth * 0.2) {
			container.style.cursor = "var(--cursor-left)";
			containerCursorPositionClicked.left = true;
		} else {
			container.style.cursor = "grab";
			containerCursorPositionClicked.left = false;
			containerCursorPositionClicked.right = false;
		}
	});

	container.addEventListener("click", (e) => {
		if (containerCursorPositionClicked.right) {
			currentSection = (currentSection + 1) % sections.length;
			gsap.to(container, {
				duration: 1,
				scrollTo: {
					x: sections[currentSection].offsetLeft,
					offsetX:
						(window.innerWidth -
							sections[currentSection % sections.length]
								.offsetWidth) /
						2,
				},
				cursor: "var(--cursor-right)",
			});
		} else if (containerCursorPositionClicked.left) {
			currentSection =
				currentSection === 0 ? sections.length - 1 : currentSection - 1;
			gsap.to(container, {
				duration: 1,
				scrollTo: {
					x: sections[currentSection].offsetLeft,
					offsetX:
						(window.innerWidth -
							sections[currentSection % sections.length]
								.offsetWidth) /
						2,
				},
				cursor: "var(--cursor-left)",
			});
		}
	});
}

lenis.on("scroll", (e) => {
	if (gsapScroll) return;

	gsap.to(currentContainer, {
		width: "133.33%",
		x: "-12.5%",
		overflowX: "hidden",
	});

	gsap.to(document.body, {
		duration: 1,
		scale: Math.max(0.7, 0.75 - Math.abs(e.velocity / 100)),
	});

	currentContainer = null;
});

allContainers.forEach((container) => {
	container.addEventListener("click", () => {
		if (gsapScroll) return;
		if (currentContainer) return;

		// window.location.href = window.location.origin + "#" + container.id;
		document.body.style.overflowX = "scroll";
		expandthecontainer(container);
	});
});
