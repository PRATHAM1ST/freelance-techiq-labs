const allContainers = document.querySelectorAll(".container");
const allVideos = document.querySelectorAll("video");
const allCarousel = document.querySelectorAll(".content-carousel");

const openedContainers = {};

let gsapScroll = false;

let currentContainer = null;

let containerCursorPositionClicked = {
	left: false,
	right: false,
};

gsap.to(document.body, {
	duration: 1,
	scale: 0.75,
});

async function expandthecontainer(container) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

	Draggable.create(container, {
		type: "x",
		bounds: ".maincontainer",
	});

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

	const sections = openedContainers[container.id].sections;

	let currentSection = openedContainers[container.id].currentSection;

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

		openedContainers[container.id].currentSection = currentSection;
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

		// if id of the container is not in the openedContainers object
		if (!openedContainers[container.id]) {
			openedContainers[container.id] = {
				currentSection: 0,
				sections: [
					container.childNodes[3],
					...[...container.childNodes[5].childNodes].filter(
						(node) => node.nodeName === "DIV"
					),
				],
			};
		}

		// window.location.href = window.location.origin + "#" + container.id;
		document.body.style.overflowX = "scroll";
		expandthecontainer(container);
	});
});

allVideos.forEach((video) => {
	video.addEventListener("mousemove", (e) => {
		const mouseEnterX = e.clientX;
		if (mouseEnterX > window.innerWidth * 0.8) {
			video.style.cursor = "var(--cursor-right)";
			containerCursorPositionClicked.right = true;
		} else if (mouseEnterX < window.innerWidth * 0.2) {
			video.style.cursor = "var(--cursor-left)";
			containerCursorPositionClicked.left = true;
		} else {
			containerCursorPositionClicked.left = false;
			containerCursorPositionClicked.right = false;
		}

		if (
			containerCursorPositionClicked.left ||
			containerCursorPositionClicked.right
		)
			return;

		const isVideoPlaying = (video) =>
			!!(
				video.currentTime > 0 &&
				!video.paused &&
				!video.ended &&
				video.readyState > 2
			);
		if (isVideoPlaying(video)) {
			video.style.cursor = "var(--cursor-pause)";
		} else {
			video.style.cursor = "var(--cursor-play)";
		}
	});

	// video.addEventListener("mouseout", () => {
	// 	video.style.cursor = "var(--cursor-pointer)";
	// });

	video.addEventListener("click", (e) => {
		const mouseEnterX = e.clientX;
		if (mouseEnterX > window.innerWidth * 0.8) {
			video.style.cursor = "var(--cursor-right)";
			containerCursorPositionClicked.right = true;
		} else if (mouseEnterX < window.innerWidth * 0.2) {
			video.style.cursor = "var(--cursor-left)";
			containerCursorPositionClicked.left = true;
		} else {
			containerCursorPositionClicked.left = false;
			containerCursorPositionClicked.right = false;
		}

		if (
			containerCursorPositionClicked.left ||
			containerCursorPositionClicked.right
		)
			return;

		const isVideoPlaying = (video) =>
			!!(
				video.currentTime > 0 &&
				!video.paused &&
				!video.ended &&
				video.readyState > 2
			);
		if (isVideoPlaying(video)) {
			video.pause();
			video.style.cursor = "var(--cursor-play)";
		} else {
			video.play();
			video.style.cursor = "var(--cursor-pause)";
		}
	});
});

allCarousel.forEach((carousel) => {
	// loop trhorugh carousel items
	const removeInterval = setInterval(() => {
		const carouselWidth = carousel.offsetWidth;
		const scrolling =
			carousel.scrollLeft === carousel.scrollWidth - carouselWidth
				? 0
				: carousel.scrollLeft + carouselWidth;
		gsap.to(carousel, {
			duration: 1,
			scrollTo: {
				x: scrolling,
			},
		});
	}, 3000);

	carousel.addEventListener("mousemove", (e) => {
		const carouselWidth = carousel.offsetWidth;
		const carouselLeft = carousel.getBoundingClientRect().left;

		const mouseEnterX = e.clientX;
		if (mouseEnterX > window.innerWidth * 0.8) {
			carousel.style.cursor = "var(--cursor-right)";
			containerCursorPositionClicked.right = true;
		} else if (mouseEnterX < window.innerWidth * 0.2) {
			carousel.style.cursor = "var(--cursor-left)";
			containerCursorPositionClicked.left = true;
		} else {
			containerCursorPositionClicked.left = false;
			containerCursorPositionClicked.right = false;
		}

		if (
			containerCursorPositionClicked.left ||
			containerCursorPositionClicked.right
		)
			return;

		if (mouseEnterX > carouselLeft + carouselWidth * 0.5) {
			carousel.style.cursor = "var(--cursor-carousel-right)";
		} else {
			carousel.style.cursor = "var(--cursor-carousel-left)";
		}
	});

	carousel.addEventListener("click", async (e) => {
		e.stopPropagation();
		clearInterval(removeInterval);

		const carouselWidth = carousel.offsetWidth;
		const carouselLeft = carousel.getBoundingClientRect().left;
		const mouseEnterX = e.clientX;

		if (mouseEnterX > window.innerWidth * 0.8) {
			carousel.style.cursor = "var(--cursor-right)";
			containerCursorPositionClicked.right = true;
		} else if (mouseEnterX < window.innerWidth * 0.2) {
			carousel.style.cursor = "var(--cursor-left)";
			containerCursorPositionClicked.left = true;
		} else {
			containerCursorPositionClicked.left = false;
			containerCursorPositionClicked.right = false;
		}

		if (
			containerCursorPositionClicked.left ||
			containerCursorPositionClicked.right
		)
			return;

		if (mouseEnterX > carouselLeft + carouselWidth * 0.5) {
			const scrolling =
				carousel.scrollLeft === carousel.scrollWidth - carouselWidth
					? 0
					: carousel.scrollLeft + carouselWidth;
			await gsap.to(carousel, {
				duration: 1,
				scrollTo: {
					x: scrolling,
				},
			});
		} else {
			const scrolling =
				carousel.scrollLeft === 0
					? carousel.scrollWidth - carouselWidth
					: carousel.scrollLeft + carouselWidth;
			await gsap.to(carousel, {
				duration: 1,
				scrollTo: {
					x: scrolling,
				},
			});
		}

		removeInterval = setInterval(() => {
			const carouselWidth = carousel.offsetWidth;
			const scrolling =
				carousel.scrollLeft === carousel.scrollWidth - carouselWidth
					? 0
					: carousel.scrollLeft + carouselWidth;
			gsap.to(carousel, {
				duration: 1,
				scrollTo: {
					x: scrolling,
				},
			});
		}, 3000);
	});
});
