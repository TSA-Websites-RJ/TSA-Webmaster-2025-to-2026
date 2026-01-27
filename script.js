const resources = JSON.parse(localStorage.getItem("resources")) || [];
const pending = JSON.parse(localStorage.getItem("pending")) || [];
const lockedResources = [
    { title: "Fitness Center", description: "A top-notch gym with group classes.", category: "Health & Fitness" },
    { title: "Chess Tournaments", description: "For registration info please contact: chess@riversidemeadows.com.", category: "Recreation" },
    { title: "Career & Learning Hub", description: "Tutoring, career classes, and a library!", category: "Education" },
    { title: "Neighborhood Watch", description: "For more details please email: security@riversidemeadows.com", category: "Community Safety" },
    { title: "Riverside Credit Union", description: "Our local bank for low-interest small business loans.", category: "Finance" },
    { title: "Weekly River Clean-up Crew", description: "Email clean@riversidemeadows.com to join!", category: "Environment" },
    { title: "Free shuttles for ages 65+", description: "Call +1 (800) 000-0000 to sign up.", category: "Transportation" },
    { title: "Lola's Cafe", description: "Our highest rated restaurant which serves delicious food!", category: "Food & Drink" },
    { title: "Monthly Farmer's Market", description: "Buy from local farms on the first Saturday of each month just outside the fitness center!", category: "Food & Drink" }
];

const list = document.getElementById("resourceList");
let selectedCategory = "";

function renderResources(filter = "") {
    list.innerHTML = "";
    [...lockedResources, ...resources].forEach(r => {
        const categoryMatch = selectedCategory === "" || r.category === selectedCategory;
        const textMatch = r.title.toLowerCase().includes(filter) || r.description.toLowerCase().includes(filter);
        if (categoryMatch && textMatch) {
            list.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 h-100">
                    <h5>${r.title}</h5>
                    <p>${r.description}</p>
                    <small class="text-muted">Category: ${r.category || "Uncategorized"}</small>
                </div>
            </div>`;
        }
    });
}
const searchContainer = document.getElementById("search").parentElement;
const categories = ["", "Health & Fitness", "Recreation", "Education", "Community Safety", "Finance", "Environment", "Transportation", "Food & Drink", "Uncategorized"];
const categorySelect = document.createElement("select");
categorySelect.className = "form-select mb-3";
categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c === "" ? "All Categories" : c}</option>`).join("");
searchContainer.insertBefore(categorySelect, document.getElementById("search"));
categorySelect.addEventListener("change", e => {
    selectedCategory = e.target.value;
    renderResources(document.getElementById("search").value.toLowerCase());
});

document.getElementById("requestForm").addEventListener("submit", e => {
    e.preventDefault();
    pending.push({
        title: title.value,
        description: description.value,
        category: category.value || "Uncategorized"
    });
    localStorage.setItem("pending", JSON.stringify(pending));
    e.target.reset();
    alert("Thank you! Your request has been submitted for review.");
});

document.getElementById("search").addEventListener("input", e => {
    renderResources(e.target.value.toLowerCase());
});

renderResources();
