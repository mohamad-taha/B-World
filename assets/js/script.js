/*-------------------------------------- nav ------------------------------------- */
const body = document.querySelector("body");
const modeSwitchBtn = document.querySelectorAll(".modeSwitchBtn");
const listBtn = document.querySelectorAll(".menuBtn");
const dataTheme = localStorage.getItem("themeMode");
const logo = document.querySelector(".logo");
const nav = document.querySelector("nav");
const sideBar = document.querySelector(".sideBar");
const closeBtn = document.querySelectorAll(".closeBtn");
const switchInput = document.querySelector(".switch");
const switchInputIcn = document.querySelector(".switchIcn");
const modeSwitchContent = document.querySelector(".modeSwitchBtn p");
switchInputIcn.style.display = "block";

window.onscroll = () => {
  if (window.scrollY > 0) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
};

window.onresize = () => {
  if (window.innerWidth > 630) {
    sideBar.style.transform = "translateX(200%)";
  }
};

body.setAttribute("data-theme", dataTheme ?? "light");
localStorage.setItem("themeMode", body.getAttribute("data-theme"));

logo.src =
  dataTheme === "dark"
    ? "./assets/imgs/dark-Logo.svg"
    : "./assets/imgs/Logo.svg";

modeSwitchBtn[0].innerHTML =
  dataTheme === "dark"
    ? "<img src='./assets/imgs/sun.svg' /> Light mode"
    : "<img src='./assets/imgs/moon.svg' /> Dark mode";

modeSwitchContent.innerHTML = dataTheme == "dark" ? "Light mode" : "Dark mode";

switchInputIcn.style.transform = dataTheme === "dark" ? "translateX(100%)" : "";

modeSwitchBtn.forEach((mode) => {
  mode.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    switchInputIcn.style.transform =
      newTheme === "dark" ? "translateX(100%)" : "";

    localStorage.setItem("themeMode", newTheme);
    body.setAttribute("data-theme", newTheme);

    logo.src =
      newTheme === "dark"
        ? "./assets/imgs/dark-Logo.svg"
        : "./assets/imgs/Logo.svg";

    modeSwitchBtn[0].innerHTML =
      newTheme === "dark"
        ? "<img src='./assets/imgs/sun.svg' /> Light mode"
        : "<img src='./assets/imgs/moon.svg'/> Dark mode";

    modeSwitchContent.innerHTML =
      newTheme == "dark" ? "Light mode" : "Dark mode";
  });
});

listBtn.forEach((menu) => {
  menu.addEventListener("click", () => {
    sideBar.style.transform = "translateX(0)";
  });
});

closeBtn.forEach((close) => {
  close.addEventListener("click", () => {
    sideBar.style.transform = "translateX(200%)";
  });
});
/* -------------------------booksCards-------------------------- */
const cards = document.querySelector(".cards .container .cardsBody");

async function showBooks() {
  if (cards) {
    cards.innerHTML = "Loading....";
  }
  try {
    const response = await fetch("https://example-data.draftbit.com/books");
    const data = await response.json();
    const selectedBooks = data.slice(0, 8);

    const booksHtml = selectedBooks
      .map((book) => {
        return `<div class="card">
                <img src="${book.image_url}" alt="${book.title}" class="bookImg"/>
                <p class="author">${book.authors}</p>
                <div>
                  <p> <img src='./assets/imgs/book-open.svg'/> ${book.num_pages}</p>
                  <p> <img src='./assets/imgs/bi_star-fill.svg'/> ${book.rating}</p>
                </div>
                <button class=primaryBtn onClick=showBookDetails(${book.id})>Show Details</button>
              </div>`;
      })
      .join("");

    if (!response.ok) {
      cards.innerHTML = "Network response was not ok" + response.status;
    }

    cards.innerHTML = booksHtml;
  } catch (err) {
    if (cards) {
      cards.innerHTML = "Error fetching data" + err;
    }
  }
}

showBooks();

/* -------------------------productDetails------------------------ */
const productDetailsContainer = document.querySelector(
  ".productDetails .container"
);

function showBookDetails(id) {
  window.location.href = `details.html?id=${id}`;
  localStorage.setItem("productId", id);
}

const productId = localStorage.getItem("productId");

if (productId) {
  fetch(`https://example-data.draftbit.com/books/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((book) => {
      productDetailsContainer.innerHTML = `
      <div class=bookCard>
        <img src='${book.image_url}'/>
        <div class=bookCardBody>
          <div>
            <h1>${book.title}</h1>
            <p>${book.authors}</p>
          </div>
          <p>About Book: <br/> <span>${book.description}</span></p>
          <div class=mountCount>
            <button class=mountBtn>-</button>
            <span>1</span>
            <button class=mountBtn>+</button>
          </div>
          <div class=bookCardActions>
            <button class=primaryBtn>Add to cart</button>
            <button class=outlinePrimaryBtn>Favorite</button>
          </div>
          <div class=bookCardFooter>
            <p class=bookStat><span>Pages Numbers : </span>${book.num_pages}</p>
            <p class=bookStat><span>Rating Count : </span>${book.rating_count}</p>
            <p class=bookStat><span>Reviews : </span>${book.review_count}</p>
          </div>
        </div>
      </div>
      `;
    })
    .catch((err) => {
      if (productDetailsContainer) {
        productDetailsContainer.innerHTML = `Error fetching data: ${err.message}`;
      }
    });
}
