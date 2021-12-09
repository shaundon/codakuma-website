const makeAllCoursesVisibleInSequence = () => {
  const INTERVAL = 2500;
  const allCourses = document.querySelectorAll(".course p");
  for (let i = 0; i < allCourses.length; i++) {
    window.setTimeout(() => {
      allCourses[i].classList.add("visible");
    }, INTERVAL * i);
  }
};

window.onload = () => {
  window.setTimeout(makeAllCoursesVisibleInSequence, 500);
};
