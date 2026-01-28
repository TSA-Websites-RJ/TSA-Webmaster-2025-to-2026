function showToast(message, type = "info") {
    const container = document.querySelector(".toast-container");

    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function login() {
    if (username.value === "admin" && password.value === "rivers") {
            loginBox.style.display = "none";
            adminPanel.style.display = "block";
            loadPending();
        showToast("Logged in successfully!", "success");
    } else {
        showToast("Invalid login. Try again.", "danger");
    }
}

function togglePassword() {
            const pwd = document.getElementById("password");
    const eye = document.querySelector(".eye");
        pwd.type = pwd.type === "password" ? "text" : "password";
    eye.classList.toggle("hidden");
}

function loadPending(filterCategory = "") {
    const pending = JSON.parse(localStorage.getItem("pending")) || [];
    pendingList.innerHTML = "";

    if (pending.length === 0) {
        pendingList.innerHTML = `<p class="text-muted">No pending requests.</p>`;
        return;
    }

    const categories = ["", "Health & Fitness", "Recreation", "Education", "Community Safety", "Finance", "Environment", "Transportation", "Food & Drink", "Uncategorized"];

    if (!document.getElementById("adminCategoryFilter")) {
        const select = document.createElement("select");


        select.id = "adminCategoryFilter";


            select.className = "form-select mb-3";
        select.innerHTML = categories.map(c =>
            `<option value="${c}">${c || "All Categories"}</option>`
        ).join("");
        select.onchange = e => loadPending(e.target.value);
        pendingList.parentElement.insertBefore(select, pendingList);
    }

    pending.forEach((p, bro) => {
                    if (filterCategory === "" || p.category === filterCategory) {
            pendingList.innerHTML += `
            <div class="card p-3 my-3">
                <h5>${p.title}</h5>
                <p>${p.description}</p>
                <small class="text-muted">Category: ${p.category}</small>
                <div class="mt-3">
                    <button class="btn btn-success btn-sm me-2" onclick="approve(${bro})">Approve</button>
                    <button class="btn btn-outline-danger btn-sm" onclick="reject(${bro})">Reject</button>
                </div>
            </div>`;
        }
    });
}

function approve(index) {
    const pending = JSON.parse(localStorage.getItem("pending"));
            const resources = JSON.parse(localStorage.getItem("resources")) || [];

                resources.push(pending[index]);
    pending.splice(index, 1);

    localStorage.setItem("resources", JSON.stringify(resources));

    localStorage.setItem("pending", JSON.stringify(pending));

        
        showToast("Resource approved and published!", "success");

    loadPending(document.getElementById("adminCategoryFilter")?.value || "");
}

function reject(index) {
    const pending = JSON.parse(localStorage.getItem("pending"));
        pending.splice(index, 1);
    localStorage.setItem("pending", JSON.stringify(pending));

        showToast("Resource request rejected", "warning");
    loadPending(document.getElementById("adminCategoryFilter")?.value || "");
}
