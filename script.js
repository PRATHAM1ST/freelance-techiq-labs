const config = {
	animationDuration: 1, // 1 second animation for all animations
	containerFocusOffset: 0.15, // 10% of the screen height
	zoomOutScale: 0.75, // 75% of the original size
	mobileResponsiveMinWidth: 768, // 768px
};

const calculatedConfig = {
	zoomOutContainerWidth: `${100 / config.zoomOutScale}vw`,
};

const listOfCursors = {
	containerLeft: document.getElementById("cursor-content-slider-left"),
	containerRight: document.getElementById("cursor-content-slider-right"),
	carouselLeft: document.getElementById("cursor-content-carousel-left"),
	carouselRight: document.getElementById("cursor-content-carousel-right"),
	pause: document.getElementById("cursor-content-video-pause"),
	play: document.getElementById("cursor-content-video-play"),
};

const containers = document.querySelectorAll(".scrollable-container");
const mainContainer = document.querySelector(".main-container");

const allVideos = document.querySelectorAll("video");

const containerInformation = {};

let activeContainer = null;

let isMobile = window.innerWidth < config.mobileResponsiveMinWidth;

if (isMobile) {
	for (const video of allVideos) {
		video.autoplay = false;
		video.loop = true;
		video.muted = true;
		video.controls = true;
	}
}

window.addEventListener("resize", () => {
	isMobile = window.innerWidth < config.mobileResponsiveMinWidth;
});

function handleDocumentScroll() {
	if (activeContainer === null) return;
	if (isMobile) return;

	hideAllCursors();
	const main = activeContainer.querySelector(".content-main");
	const containerCover = activeContainer.querySelector(".content-cover");
	const containerCoverRight =
		window.getComputedStyle(containerCover)["right"];

	// gsap.to(mainContainer, {
	// 	width: isMobile ? "100vw" : calculatedConfig.zoomOutContainerWidth,
	// });

	for (const container of containers) {
		if (container === activeContainer) continue;
		// container.style.transform = `scale(${
		// 	isMobile ? 1 : config.zoomOutScale
		// }) translateX(-50%)`;
	}
	gsap.to(activeContainer, {
		width: isMobile ? "100vw" : calculatedConfig.zoomOutContainerWidth,
		scale: isMobile ? 1 : config.zoomOutScale,
	});

	gsap.to(main, {
		x: 0,
		width: isMobile ? "100vw" : calculatedConfig.zoomOutContainerWidth,
		overflowX: isMobile ? "scroll" : "hidden",
		scrollTo: {
			x: containerInformation[activeContainer.id].scroll,
		},
	});

	gsap.to(containerCover, {
		right: isMobile ? 0 : containerCoverRight * config.zoomOutScale,
	});

	containerInformation[activeContainer.id].opened = false;

	activeContainer = null;
}

function documentScrollAdder() {
	lenis.start();
	document.addEventListener("scroll", handleDocumentScroll);
}

function documentScrollRemover() {
	lenis.stop();
	document.removeEventListener("scroll", handleDocumentScroll);
}

documentScrollAdder();

function hideAllCursors() {
	for (const cursor of Object.values(listOfCursors)) {
		cursor.style.display = "none";
	}
}

function handleContainerCursors(container) {
	// container cursor

	function handleContainerCursor(e) {
		if (containerInformation[container.id].overridingCursor) {
			return;
		}

		const x = e.clientX;
		const y = e.clientY;

		// make container cursor visible when 20% left of the screen
		hideAllCursors();

		container.style.cursor = "none";

		if (!containerInformation[container.id].opened) {
			container.style.cursor = "pointer";
			return;
		}

		if (container !== activeContainer) return;

		if (containerInformation[container.id].isDragging) {
			container.style.cursor = "grabbing";
			return;
		} else if (
			x < window.innerWidth * 0.2 &&
			containerInformation[container.id].activeElement !== 0
		) {
			listOfCursors.containerLeft.style.display = "block";
			listOfCursors.containerLeft.style.top = y + "px";
			listOfCursors.containerLeft.style.left = x + "px";
			return;
		}
		// make container cursor visible when 20% left of the screen
		else if (
			x > window.innerWidth * 0.8 &&
			containerInformation[container.id].activeElement !==
				containerInformation[container.id].elements.length - 1
		) {
			listOfCursors.containerRight.style.display = "block";
			listOfCursors.containerRight.style.top = y + "px";
			listOfCursors.containerRight.style.left = x + "px";
			return;
		} else {
			container.style.cursor = "grab";
		}
	}

	function handleCursorLeave() {
		hideAllCursors();
		container.style.cursor = "auto";
	}

	container.addEventListener("mouseenter", (e) => handleContainerCursor(e));

	container.addEventListener("mousemove", (e) => handleContainerCursor(e));

	container.addEventListener("mouseleave", handleCursorLeave);

	// Video cursor

	function handleVideoCursor(e, video) {
		if (!containerInformation[container.id].opened) return;
		if (container !== activeContainer) return;

		containerInformation[container.id].overridingCursor = true;

		const x = e.clientX;
		const y = e.clientY;

		hideAllCursors();

		container.style.cursor = "none";

		if (video.paused) {
			listOfCursors.play.style.display = "block";
			listOfCursors.play.style.top = y + "px";
			listOfCursors.play.style.left = x + "px";
		} else {
			listOfCursors.pause.style.display = "block";
			listOfCursors.pause.style.top = y + "px";
			listOfCursors.pause.style.left = x + "px";
		}
	}

	const videos = container.querySelectorAll(".content-video");

	for (const video of videos) {
		video.addEventListener("mouseenter", (e) =>
			handleVideoCursor(e, video)
		);

		video.addEventListener("mousemove", (e) => handleVideoCursor(e, video));

		video.addEventListener("mouseleave", () => {
			handleCursorLeave();
			containerInformation[container.id].overridingCursor = false;
		});
	}
}

function dragContainer(container) {
	const main = container.querySelector(".content-main");
	let initialX = 0;
	let initialScroll = 0;

	document.addEventListener("mousedown", (e) => {
		if (activeContainer !== container) return;
		if (!containerInformation[container.id].opened) return;

		containerInformation[container.id].isDragging = true;
		initialX = e.clientX;
		initialScroll = main.scrollLeft;
		containerInformation[container.id].scroll = main.scrollLeft;
	});

	document.addEventListener("mousemove", (e) => {
		if (activeContainer !== container) return;
		if (!containerInformation[container.id].opened) return;
		if (!containerInformation[container.id].isDragging) return;

		const diff = initialX - e.clientX;
		main.scrollLeft = initialScroll + diff;
	});

	document.addEventListener("mouseup", (e) => {
		e.stopPropagation();
		if (activeContainer !== container) return;
		if (!containerInformation[container.id].opened) return;

		containerInformation[container.id].isDragging = false;
		containerInformation[container.id].scroll = main.scrollLeft;
	});
}

function handleContainerClicks(container) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

	const main = container.querySelector(".content-main");
	const hiddenElements = container.querySelectorAll(".content-hidden");
	const heroImage = container.querySelector(".content-hero-image");
	const containerCover = container.querySelector(".content-cover");
	const carouselContainers = container.querySelectorAll(".content-carousel");
	const videos = container.querySelectorAll(".content-video");
	const heroImageHeight = heroImage.offsetHeight;
	const containerCoverWidth = String(containerCover.offsetWidth);

	const containerGlobalConstants = {
		width: "100vw",
		height: isMobile ? "auto" : "80vh",
		padding: "2rem",
		coverWidth: isMobile
			? 0
			: `calc(${containerCover.offsetWidth}px + var(--spacing))`,
		mobileWidth: "90vw",
	};

	container.addEventListener("click", async (e) => {
		const x = e.clientX;

		if (activeContainer !== null && activeContainer !== container) {
			handleDocumentScroll();
		}

		if (
			containerInformation[container.id].isDragging ||
			containerInformation[container.id].overridingCursor ||
			e.detail > 1 ||
			window.getComputedStyle(e.target)["cursor"] === "grabbing"
		)
			return;

		if (
			containerInformation[container.id].opened &&
			activeContainer === container &&
			isMobile === false
		) {
			const elements = containerInformation[container.id].elements;
			let activeElement =
				containerInformation[container.id].activeElement;

			if (x < window.innerWidth * 0.2) {
				if (activeElement === 0) return;
				activeElement--;
			} else if (x > window.innerWidth * 0.8) {
				if (activeElement === elements.length - 1) return;
				activeElement++;
			}

			await gsap.to(main, {
				duration: config.animationDuration,
				scrollTo: {
					x: elements[activeElement],
					offsetX:
						(window.innerWidth -
							elements[activeElement].offsetWidth) /
						2,
				},
			});

			containerInformation[container.id].activeElement = activeElement;
			containerInformation[container.id].scroll = main.scrollLeft;

			return;
		}

		documentScrollRemover();

		activeContainer = container;

		containerInformation[container.id].opened = true;

		const settingHeroImage = gsap.to(heroImage, {
			duration: config.animationDuration,
			height: isMobile ? "auto" : containerGlobalConstants.height,
			width: isMobile
				? containerGlobalConstants.mobileWidth
				: "fit-content",
		});

		const settingMain = gsap.to(main, {
			duration: config.animationDuration,
			x: 0,
			width: containerGlobalConstants.width,
			height: containerGlobalConstants.height,
			paddingLeft: containerGlobalConstants.coverWidth,
			paddingRight: containerGlobalConstants.padding,
			alignItems: "center",
			overflowX: "scroll",
		});

		const revealingHiddenContent = gsap.to(hiddenElements, {
			duration: config.animationDuration,
			width: "auto",
			display: "block",
			overflow: "visible",
		});

		const settingVideoAndGif = gsap.to([".content-video", ".content-gif"], {
			duration: config.animationDuration,
			height: isMobile
				? heroImageHeight
				: containerGlobalConstants.height,
			width: "auto",
			maxWidth: "none",
		});

		const settingContainerWidthAndPosition = gsap.to(container, {
			duration: config.animationDuration,
			width: containerGlobalConstants.width,
			x: 0,
			scale: 1,
		});

		console.log(containerCoverWidth, 'containerCoverWidth');

		const positioningCoverElements = gsap.to(containerCover, {
			duration: config.animationDuration,
			right: isMobile
				? 0
				: `calc(100% - ${containerGlobalConstants.padding} - ${containerCoverWidth}px + ${main.scrollLeft}px)`,
			paddingLeft: "calc((100vw - var(--mobile-content-width)) / 2)",
		});

		const focusingContainer = gsap.to(window, {
			duration: config.animationDuration,
			scrollTo: {
				y: container.offsetTop,
				offsetY: window.innerHeight * config.containerFocusOffset,
			},
		});

		const settingMainContainerWidthAndScale = gsap.to(mainContainer, {
			duration: config.animationDuration,
			scale: 1,
			width: containerGlobalConstants.width,
		});

		await Promise.all([
			settingHeroImage,
			settingMain,
			revealingHiddenContent,
			settingVideoAndGif,
			settingContainerWidthAndPosition,
			positioningCoverElements,
		]);

		await Promise.all([
			focusingContainer,
			settingMainContainerWidthAndScale,
		]);

		gsap.to(mainContainer, {
			scale: 1,
		});

		for (const carouselContainer of carouselContainers) {
			const carousels = carouselContainer.querySelectorAll(".carousel");

			gsap.to(carouselContainer, {
				duration: config.animationDuration,
				width: "var(--carousel-width)",
				minWidth: "var(--carousel-width)",
				marginLeft: "var(--spacing)",
			});

			const carouselsLength = carousels.length - 1;

			for (const carousel of carousels) {
				gsap.to(carousel, {
					duration: carouselsLength * 4,
					x:
						activeContainer === container
							? -carousel.offsetWidth * carouselsLength
							: -carousel.offsetWidth *
							  carouselsLength *
							  config.zoomOutScale,
					ease: `steps(${carouselsLength})`,
					repeat: -1,
				});
			}
		}

		documentScrollAdder();
	});

	main.addEventListener("scroll", (e) => {
		if (!containerInformation[container.id].opened) return;
		if (isMobile) return;
		if (container !== activeContainer) return;

		containerInformation[container.id].scroll = main.scrollLeft;

		containerCover.style.right = `calc(100% - ${containerGlobalConstants.padding} - ${containerCoverWidth}px + ${main.scrollLeft}px)`;
	});

	for (const carouselContainer of carouselContainers) {
		const carousels = carouselContainer.querySelectorAll(".carousel");
		for (let i = 1; i <= carousels.length; i++) {
			const small = document.createElement("small");
			small.textContent = `${String(i).padStart(2, "0")} / ${String(
				carousels.length
			).padStart(2, "0")}`;
			carousels[i - 1].appendChild(small);
		}
	}

	if (isMobile) return;

	for (const video of videos) {
		video.addEventListener("click", (e) => {
			const x = e.clientX;
			const y = e.clientY;
			hideAllCursors();
			if (video.paused) {
				video.play();
				listOfCursors.pause.style.display = "block";
				listOfCursors.pause.style.top = y + "px";
				listOfCursors.pause.style.left = x + "px";
			} else {
				video.pause();
				listOfCursors.play.style.display = "block";
				listOfCursors.play.style.top = y + "px";
				listOfCursors.play.style.left = x + "px";
			}
		});
	}
}

for (const container of containers) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

	if (containerInformation[container.id] === undefined) {
		containerInformation[container.id] = {
			scroll: 0,
			opened: false,
			isDragging: false,
			overridingCursor: false,
			activeElement: 0,
			elements: container.querySelectorAll(".content"),
		};
	}

	if (isMobile === false) handleContainerCursors(container);
	dragContainer(container);
	handleContainerClicks(container);

	gsap.to(container, {
		scale: isMobile ? 1 : config.zoomOutScale,
	});
}

// gsap.to(mainContainer, {
// 	// scale: isMobile ? 1 : config.zoomOutScale,
// 	width: isMobile ? "100vw" : calculatedConfig.zoomOutContainerWidth,
// });

hideAllCursors();
