// gsap.registerPlugin(ScrollTrigger) || gsap.core.globals("ScrollTrigger");

const allContainers = document.querySelectorAll(".container");
let gsapScroll = false;

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TweenLite);
async function expandthecontainer(container) {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
	console.log('container', container.childNodes[5].childNodes);
	console.log("container", [
		container.childNodes[3],
		container.childNodes[5].childNodes,
	]);
	var viewWidth = window.innerWidth;
	var viewHeight = window.innerHeight;
	var targetWidth = container.offsetWidth;
	var targetHeight = container.offsetHeight;
	var x = (viewWidth - targetWidth) / 2;
	var y = (viewHeight - 650) / 2;
	console.log("x", x, "y", y);
	// container.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" })
	// await gsap.to(window, { duration: 1, scrollTo: {x: x, y: y}, offsetY: y, offsetX: x });
	// center the container
	gsap.to(window, {
		duration: 1,
		focus: true,
		ease: "power2.inOut",
		scrollTo: 
		{
			y: container,
			offsetY: y,
		},
		
	});

	gsap.to(container, {
		duration: 1,
		x: "0rem",
		width: "100%",
		height: "70vh",
		overflowX: "scroll",
		margin: "5rem 0",
		ease: "power2.inOut",
		gap: "2rem",
		stagger: 0.3,
		justifyContent: "start",
		paddingRight: "5rem",	
	})

	gsap.to("#" + container.id + "> .hidden", {
		duration: 1,
		overflow: "visible",
		width: "fit-content",
		ease: "power2.inOut",
		stagger: 0.3,
	});

	// const sections = [
	// 	container.childNodes[3],
	// 	container.childNodes[5].childNodes[0],
	// ];

	// gsap.to(sections, {
	// 	xPercent: -100 * (sections.length - 1),
	// 	ease: "none",
	// 	scrollTrigger: {
	// 		trigger: container,
	// 		pin: true,
	// 		scrub: 1,
	// 		snap: 1 / (sections.length - 1),
	// 		end: () => "+=" + document.querySelector(".container").offsetWidth,
	// 	},
	// });
}

allContainers.forEach((container) => {
	container.addEventListener("scroll", () => {
		console.log("scrolling");
	});

	container.addEventListener("click", () => {
		document.body.style.overflowX = "scroll";
		console.log("container clicked");
		// gsapScroll = true;
		expandthecontainer(container);
		// container.classList.add("reveal");
	});
});

var lastScrollTop = 0;

// check vertical scroll
window.addEventListener(
	"scroll",
	function (e) {
		if (gsapScroll) return;
		// or window.addEventListener("scroll"....
		var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
		if (st > lastScrollTop || st < lastScrollTop) {
			// downscroll code
			// document.body.style.overflowX = "hidden";
		}
		lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
	},
	false
);
