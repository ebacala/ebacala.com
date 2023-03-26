export const createObserver = (
	htmlElement: HTMLElement,
	animationClassName: string,
) => {
	const observer = new IntersectionObserver(
		(entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				if (entry.isIntersecting) {
					entry.target.classList.remove("hidden");
					entry.target.classList.add(animationClassName);
				}
			});
		},
	);

	htmlElement.classList.add("hidden");
	observer.observe(htmlElement);
};
