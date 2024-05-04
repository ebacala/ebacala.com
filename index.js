const createObserver = (htmlElement, animationClassName) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("hidden");
        entry.target.classList.add(animationClassName);
      }
    });
  });

  htmlElement.classList.add("hidden");
  observer.observe(htmlElement);
};

createObserver(
  document.getElementById("profile-picture"),
  "animate-profile-picture"
);
createObserver(document.getElementById("h1"), "animate-h1");
createObserver(document.getElementById("h2"), "animate-h2");
createObserver(document.getElementById("job"), "animate-job");
createObserver(document.getElementById("social"), "animate-social");
createObserver(document.getElementById("about-me"), "animate-about-me");
createObserver(document.getElementById("technologies"), "animate-technologies");
