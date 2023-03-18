const button = document.querySelector(".table-of-contents button");
const content = document.querySelector("#toc-list");

button.addEventListener("click", toggleTableOfContents);

function toggleTableOfContents() {
  content.classList.toggle("toc-hide");

  if (button.innerText === "[ Hiện mục lục ]") {
    button.innerText = "[ Ẩn mục lục ]";
    button.setAttribute("aria-expanded", false);
  } else {
    button.innerText = "[ Hiện mục lục ]";
    button.setAttribute("aria-expanded", true);
  }
}
