// Select all elements
const containers = document.querySelectorAll(".container");
const videos = document.querySelectorAll("video");
const carousels = document.querySelectorAll(".content-carousel");

// Check if window width is less than 768px
const isMobile = window.innerWidth < 768;

// Store opened containers
const openedContainers = {};

// Flags
let isGsapScrolling = false;
let activeContainer = null;
let cursorPosition = {
	left: false,
	right: false,
};

// Initial body scale
gsap.to(document.body, {
	duration: 1,
	scale: isMobile ? 1 : 0.75,
});

// Function to handle mouse movement within container
const handleMouseMovement = (element, mouseX) => {
	if (mouseX > window.innerWidth * 0.8) {
		activeContainer.style.cursor = "var(--cursor-right)";
		element.style.cursor = "var(--cursor-right)";
		cursorPosition.right = true;
		cursorPosition.left = false;
		return true;
	} else if (mouseX < window.innerWidth * 0.2) {
		activeContainer.style.cursor = "var(--cursor-left)";
		element.style.cursor = "var(--cursor-left)";
		cursorPosition.left = true;
		cursorPosition.right = false;
		return true;
	} else {
		cursorPosition.left = false;
		cursorPosition.right = false;
	}
	return cursorPosition.left || cursorPosition.right;
};

// Function to check if video is playing
const isVideoPlaying = (video) =>
	!!(
		video.currentTime > 0 &&
		!video.paused &&
		!video.ended &&
		video.readyState > 2
	);

// Function to expand container
async function expandContainer(container) {
	// Register GSAP plugins
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

	// Make the container draggable horizontally within bounds
	if (isMobile) {
		// Draggable.create(container, {
		// 	type: "x",
		// 	bounds: ".maincontainer",
		// });

		const viewHeight = window.innerHeight;
		const targetHeight =
			openedContainers[container.id].targetHeight ??
			container.childNodes[3].offsetHeight;
		const bottomPadding =
			openedContainers[container.id].bottomPadding ??
			container.childNodes[1].offsetHeight;
		const verticalOffset = (viewHeight - 590) / 2;

		console.log("targetHeight", targetHeight);

		const snapping = gsap.to(window, {
			duration: 1,
			focus: true,
			ease: "power2.inOut",
			scrollTo: {
				y: container,
				offsetY: verticalOffset,
			},
		});

		// Animate the container's expansion
		const containerAnimation = gsap.to(container, {
			duration: 1,
			x: "-5%",
			width: "100vw",
			overflowX: "hidden",
			overflowY: "hidden",
			ease: "power2.inOut",
			stagger: 0.3,
			justifyContent: "start",
		});

		const mainScroll = gsap.to(`#${container.id} .main-content`, {
			overflowX: "scroll",
			overflowY: "visible",
			width: "100vw",
		})

		const revealAssets = gsap.to(
			`#${container.id} .hero-image > img, #${container.id} .content > img, #${container.id} .content > gif, #${container.id} .content > video`,
			{
				duration: 1,
				overflow: "visible",
				width: "fit-content",
				height: targetHeight,
				ease: "power2.inOut",
				stagger: 0.3,
			}
		);

		const adjustingParagraphs = gsap.to(`#${container.id} .description`, {
			duration: 1,
			width: "40ch",
			minWidth: "auto",
			height: targetHeight,
			ease: "power2.inOut",
			overflowX: "hidden",
			overflowY: "auto",
			stagger: 0.3,
		});

		// Reveal hidden content within the container
		const revealHiddenContentAnimation = gsap.to(
			`#${container.id} .hidden`,
			{
				duration: 1,
				overflow: "visible",
				width: "fit-content",
				height: targetHeight,
				ease: "power2.inOut",
				paddingLeft: "2rem",
				stagger: 0.3,
			}
		);

		const fixingContentCover = gsap.to(`#${container.id} .content-cover`, {
			ease: "none",
			paddingLeft: "2rem",

			// scrollTrigger: {
			// 	trigger: `#${container.id} .main-content`,
			// 	pin: true,
			// 	scrub: true,
			// 	// snap: 1 / (sections.length - 1),
			// 	end: () =>
			// 		"+=" + document.querySelector(`#${container.id} .main-content`).offsetWidth,
			// },
		});

		Promise.all([
			snapping,
			containerAnimation,
			revealHiddenContentAnimation,
			revealAssets,
			adjustingParagraphs,
			fixingContentCover,
		]);

		activeContainer = container;
	} else {
		// openedContainers[container.id].sections.forEach((section) => {
		// 	Draggable.create(section, {
		// 		type: "left",
		// 		bounds: ".container",
		// 	});
		// });

		// Calculate target height and vertical offset for snapping
		const viewHeight = window.innerHeight;
		const targetHeight = viewHeight * 0.6;
		const verticalOffset = (viewHeight - 590) / 2;

		// Set flag for GSAP scroll animation
		isGsapScrolling = true;

		// Scale up the body
		await gsap.to(document.body, {
			duration: 1,
			scale: 1,
		});

		// Snap to the container
		const snapping = gsap.to(window, {
			duration: 1,
			focus: true,
			ease: "power2.inOut",
			scrollTo: {
				y: container,
				offsetY: verticalOffset,
			},
		});

		// Animate the container's expansion
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

		// Reveal hidden content within the container
		const revealHiddenContentAnimation = gsap.to(
			`#${container.id} .hidden`,
			{
				duration: 1,
				overflow: "visible",
				width: "fit-content",
				height: "100%",
				ease: "power2.inOut",
				paddingLeft: "2rem",
				stagger: 0.3,
			}
		);

		// Wait for all animations to complete
		await Promise.all([
			snapping,
			containerAnimation,
			revealHiddenContentAnimation,
		]);

		// Reset GSAP scroll flag
		isGsapScrolling = false;

		// Set the current container
		activeContainer = container;

		// Retrieve sections within the container
		const sections = openedContainers[container.id].sections;

		// Initialize the current section
		let currentSection = openedContainers[container.id].currentSection;

		// Handle mouse movement within the container
		container.addEventListener("mousemove", (e) => {
			const mouseX = e.clientX;
			if (handleMouseMovement(container, mouseX)) return;
			container.style.cursor = "grab";
		});

		// Handle click events within the container
		container.addEventListener("click", (e) => {
			if (cursorPosition.right) {
				currentSection =
					currentSection === sections.length - 1
						? currentSection
						: currentSection + 1;
			} else if (cursorPosition.left) {
				currentSection = currentSection === 0 ? 0 : currentSection - 1;
			}

			// Scroll to the selected section
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
				cursor: cursorPosition.right
					? "var(--cursor-right)"
					: "var(--cursor-left)",
			});

			// Update the current section index
			openedContainers[container.id].currentSection = currentSection;
		});
	}
}

// Event listener for scroll
lenis.on("scroll", (e) => {
	if (isGsapScrolling || isMobile) return;
	
	gsap.to(activeContainer, {
		width: "133.33%",
		x: "-12.5%",
		overflowX: "hidden",
	});
	
	gsap.to(document.body, {
		duration: 1,
		scale: isMobile ? 1 : Math.max(0.7, 0.75 - Math.abs(e.velocity / 100)),
	});
	
	activeContainer = null;
});

// Event listener for container clicks
containers.forEach((container) => {
	container.addEventListener("click", () => {
		console.log('activeContainer', activeContainer);
		// Check if GSAP scroll is in progress or a container is already expanded
		if (isGsapScrolling || (activeContainer && !isMobile)) return;

		console.log([
			container.childNodes[3].childNodes[1],
			...[...container.childNodes[3].childNodes[3].childNodes].filter(
				(node) => node.nodeName === "DIV"
			),
		]);
		console.log([container.childNodes[3].childNodes[1]]);

		// Check if the container is not already in the openedContainers object
		if (!openedContainers[container.id]) {
			// Initialize the container sections
			openedContainers[container.id] = {
				currentSection: 0,
				sections: [
					container.childNodes[3].childNodes[1], // Assuming this is the first section
					...[
						...container.childNodes[3].childNodes[3].childNodes,
					].filter((node) => node.nodeName === "DIV"),
				],
				targetHeight: container.childNodes[3].offsetHeight,
				bottomPadding: container.childNodes[1].offsetHeight,
			};
		}

		// Enable horizontal scrolling for the body
		document.body.style.overflowX = "scroll";

		// Expand the clicked container
		expandContainer(container);
	});
});

// Event listener for video mouse movements and clicks
videos.forEach((video) => {
	video.addEventListener("mousemove", (e) => {
		const mouseX = e.clientX;

		// Check if mouse movement occurs within a container, handle it and return
		if (handleMouseMovement(video, mouseX)) return;
		else {
			console.log("video mousemove");
			e.stopPropagation();

			// Check if the video is playing and update cursor accordingly
			video.style.cursor = isVideoPlaying(video)
				? "var(--cursor-pause)"
				: "var(--cursor-play)";
		}
	});

	// Event listener for video clicks
	video.addEventListener("click", (e) => {
		const mouseX = e.clientX;

		// Check if mouse click occurs within a container, handle it and return
		if (handleMouseMovement(video, mouseX)) return;
		e.stopPropagation();

		// Check if the video is playing, pause or play accordingly
		if (isVideoPlaying(video)) {
			video.pause();
			video.style.cursor = "var(--cursor-play)";
		} else {
			video.play();
			video.style.cursor = "var(--cursor-pause)";
		}
	});
});

// Event listener for carousel mouse movements and clicks
carousels.forEach((carousel) => {
	// Set interval to auto-scroll the carousel
	let autoScrollInterval = setInterval(() => {
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

	if (isMobile) return;

	// Event listener for mouse movements on the carousel
	carousel.addEventListener("mousemove", (e) => {
		const carouselWidth = carousel.offsetWidth;
		const carouselLeft = carousel.getBoundingClientRect().left;
		const mouseX = e.clientX;

		// Check if mouse movement occurs within the carousel, handle it and return
		if (handleMouseMovement(carousel, mouseX)) return;
		else {
			console.log("carousel mousemove");
			e.stopPropagation();

			// Update cursor based on mouse position
			carousel.style.cursor =
				mouseX > carouselLeft + carouselWidth * 0.5
					? "var(--cursor-carousel-right)"
					: "var(--cursor-carousel-left)";
		}
	});

	// Event listener for carousel clicks
	carousel.addEventListener("click", async (e) => {
		clearInterval(autoScrollInterval);

		const carouselWidth = carousel.offsetWidth;
		const carouselLeft = carousel.getBoundingClientRect().left;
		const mouseX = e.clientX;

		// Check if click occurs within the carousel, handle it and return
		if (handleMouseMovement(carousel, mouseX)) return;
		e.stopPropagation();

		// Determine scrolling direction based on click position
		const scrolling =
			mouseX > carouselLeft + carouselWidth * 0.5
				? carousel.scrollLeft === carousel.scrollWidth - carouselWidth
					? 0
					: carousel.scrollLeft + carouselWidth
				: carousel.scrollLeft === 0
				? carousel.scrollWidth - carouselWidth
				: carousel.scrollLeft - carouselWidth;

		// Scroll to the calculated position
		await gsap.to(carousel, {
			duration: 1,
			scrollTo: {
				x: scrolling,
			},
		});

		// Restart auto-scrolling interval
		autoScrollInterval = setInterval(() => {
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
