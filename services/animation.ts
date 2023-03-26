export const createObserver = (
	htmlElement: HTMLElement,
	animationClassName: string,
) => {
	const observer = new IntersectionObserver(
		(entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add(animationClassName);
				}
			});
		},
	);

	observer.observe(htmlElement);
};
