const initialLoadingContainer = document.querySelector(".initial-loading");
const initialLoadingLetter = document.querySelector(".initial-loading span");

function removeContainer() {
	gsap.to(".initial-loading", {
		duration: 1,
		delay: 1,
		y: "-100%",
		backgroundColor: "rgba(255, 255, 255, 0)",
		ease: "sine.in",
	});

	gsap.to(".fixed-dot.start", {
		duration: 1,
		delay: 1,
		top: "10vh",
		left: "30vw",
		x: "-50%",
        z: "10000",
		opacity: 0,
        ease: "Power2.inOut",
		onComplete: {
			display: "none",
		}
	});

	gsap.to(".fixed-dot.end", {
		duration: 1,
		delay: 1,
		top: "10vh",
		left: "70vw",
		x: "-50%",
        z: "10000",
		opacity: 0,
        ease: "Power2.inOut",
		onComplete: {
			display: "none",
		}
	});
}

function startLoading() {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

	gsap.to([".initial-loading *", ".fixed-dot"], {
		duration: 1,
		opacity: 1,
		delay: 0.5,
		stagger: 0.2,
		ease: "sine.out",
		onComplete: removeContainer,
	});
}

startLoading();
