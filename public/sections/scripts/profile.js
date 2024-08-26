document.querySelector(".content-1 > div#pfp img").setAttribute("src", JSON.parse(localStorage.getItem("user"))["photoURL"]);

document.querySelectorAll(".content-1 > div:not(first-of-type) > b").forEach(el => {
    el.innerHTML = JSON.parse(localStorage.getItem("profile"))[el.parentElement.id];
});