// Bootstrap Modal instance
const imgModal = new bootstrap.Modal(document.getElementById("imgModal"));
const modalImg = document.getElementById("imgModalDisplay");
const modalTitle = document.getElementById("imgTitle");

// Click item -> show modal
document.querySelectorAll(".temp-picture").forEach(pic => {
    pic.addEventListener("click", () => {
        modalImg.src = pic.dataset.img;
        modalTitle.textContent = pic.dataset.title;
        imgModal.show();
    });
});

// Tab bar
document.querySelectorAll(".tab-item").forEach(tab => {
    tab.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
        this.classList.add("active");
    });
});