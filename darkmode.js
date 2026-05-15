(function () {
  if (localStorage.getItem("glamify_theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
})();
document.addEventListener("DOMContentLoaded", function () {
  let btn = document.createElement("button");
  btn.id = "theme-btn";
  btn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
  document.body.appendChild(btn);
  btn.addEventListener("click", function () {
    let isDark = document.documentElement.classList.toggle("dark");
    btn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("glamify_theme", isDark ? "dark" : "light");
  });
});