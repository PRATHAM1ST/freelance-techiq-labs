// gsap.registerPlugin(ScrollTrigger) || gsap.core.globals("ScrollTrigger");

const allContainers = document.querySelectorAll(".container");
let gsapScroll = false;

let currentContainer = null;

gsap.to(document.body, {
	duration: 1,
	scale: 0.75,
});

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TweenLite);
async function expandthecontainer(container) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	console.log(
		"container",
		[...container.childNodes[5].childNodes].filter(
			(node) => node.nodeName === "DIV"
		)
	);
	console.log("container", [
		container.childNodes[3],
		...[...container.childNodes[5].childNodes].filter(
			(node) => node.nodeName === "DIV"
		),
	]);
	var viewWidth = window.innerWidth;
	var viewHeight = window.innerHeight;
	var targetWidth = container.offsetWidth;
	var targetHeight = container.offsetHeight;
	var x = (viewWidth - targetWidth) / 2;
	var y = (viewHeight - 590) / 2;
	console.log("x", x, "y", y);
	// container.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" })
	// await gsap.to(window, { duration: 1, scrollTo: {x: x, y: y}, offsetY: y, offsetX: x });
	// center the container

	gsapScroll = true;

	console.log("body", "scale: 1");

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
		height: "60vh",
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

	// gsap.to(sections, {
	// 	ease: "none",
	// 	scrollTrigger: {
	// 		trigger: container,
	// 		scrub: 1,
	// 		snap: 1 / (sections.length - 1),
	// 		end: () => "+=" + container.offsetWidth,
	// 	},
	// });
}

lenis.on("scroll", (e) => {
	// console.log(e);
	if (gsapScroll) return;

	gsap.to(currentContainer, {
		width: "133.33%",
		x: "-12.5%",
		overflowX: "hidden",
	});

	gsap.to(document.body, {
		duration: 1,
		scale: Math.max(0.75, 0.75 - Math.abs(e.velocity / 100)),
	});
});

allContainers.forEach((container) => {
	container.addEventListener("scroll", () => {
		console.log("scrolling container");
	});

	container.addEventListener("click", () => {
		document.body.style.overflowX = "scroll";
		console.log("container clicked");
		expandthecontainer(container);
	});
});
