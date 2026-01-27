function login() {
    if (username.value === "admin" && password.value === "rivers") {
        loginBox.style.display = "none";
        adminPanel.style.display = "block";
        loadPending();
    } else {
        alert("Invalid login");
    }
}

function togglePassword() {
    const pwd = document.getElementById("password");
    const eye = document.querySelector(".eye");
    if (pwd.type === "password") {
        pwd.type = "text";
        eye.classList.add("hidden");
    } else {
        pwd.type = "password";
        eye.classList.remove("hidden");
    }
}

function loadPending(filterCategory = "") {
    const pending = JSON.parse(localStorage.getItem("pending")) || [];
    pendingList.innerHTML = "";

    if (pending.length === 0) {
        pendingList.innerHTML = `<p class="text-muted">No pending requests at the moment.</p>`;
        return;
    }







    const categories = ["", "Health & Fitness", "Recreation", "Education", "Community Safety", "Finance", "Environment", "Transportation", "Food & Drink", "Uncategorized"];
    const filterSelectId = "adminCategoryFilter";

    if (!document.getElementById(filterSelectId)) {
        const select = document.createElement("select");
        select.className = "form-select mb-3";
        select.id = filterSelectId;
        select.innerHTML = categories.map(c => `<option value="${c}">${c === "" ? "All Categories" : c}</option>`).join("");
        select.addEventListener("change", e => {
            loadPending(e.target.value);
        });
        pendingList.parentElement.insertBefore(select, pendingList);
    }

    pending.forEach((p, i) => {
        
      
      
      if (filterCategory === "" || p.category === filterCategory) {
            pendingList.innerHTML += `
            <div class="card p-3 my-3">
                <h5>${p.title}</h5>
                <p>${p.description}</p>
                <small class="text-muted">Category: ${p.category || "Uncategorized"}</small>
                <div class="mt-3">
                    <button class="btn btn-success btn-sm admin-action-btn" onclick="approve(${i})">
                        Approve
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="reject(${i})">
                        Reject
                    </button>
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

    





    const currentFilter = document.getElementById("adminCategoryFilter")?.value || "";
    loadPending(currentFilter);
}

function reject(index) {
    const pending = JSON.parse(localStorage.getItem("pending"));
    pending.splice(index, 1);
    localStorage.setItem("pending", JSON.stringify(pending));
    const currentFilter = document.getElementById("adminCategoryFilter")?.value || "";
    loadPending(currentFilter);
}
