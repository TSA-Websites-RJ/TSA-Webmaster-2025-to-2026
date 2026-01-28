const resources = JSON.parse(localStorage.getItem("resources")) || [];
const pending = JSON.parse(localStorage.getItem("pending")) || [];

const lockedResources = [
    { title: "Fitness Center", description: "A top-notch gym with group classes.", category: "Health & Fitness" },
    { title: "Chess Tournaments", description: "Contact chess@riversidemeadows.com.", category: "Recreation" },
    { title: "Career & Learning Hub", description: "Tutoring and career classes.", category: "Education" },
    { title: "Neighborhood Watch", description: "Email security@riversidemeadows.com", category: "Community Safety" },
    { title: "Riverside Credit Union", description: "Low-interest loans.", category: "Finance" },
    { title: "River Clean-up Crew", description: "Email clean@riversidemeadows.com", category: "Environment" },
    { title: "Senior Shuttles", description: "Free rides for ages 65+.", category: "Transportation" },
    { title: "Lola's Cafe", description: "Highest rated restaurant!", category: "Food & Drink" }
];

const list = document.getElementById("resourceList");
let selectedCategory = "";
function showToast(message, type = "success") {
    const container = document.querySelector(".toast-container");

    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toastEl.role = "alert";

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








function renderResources(filter = "") {
    list.innerHTML = "";
    [...lockedResources, ...resources].forEach(r => {
        const categoryMatch = selectedCategory === "" || r.category === selectedCategory;
        const textMatch =
            r.title.toLowerCase().includes(filter) ||
            r.description.toLowerCase().includes(filter);

        if (categoryMatch && textMatch) {
            list.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 h-100">
                    <h5>${r.title}</h5>
                    <p>${r.description}</p>
                    <small class="text-muted">Category: ${r.category}</small>
                </div>
            </div>`;
        }
    });
}

const searchContainer = document.getElementById("search").parentElement;
const categories = ["", "Health & Fitness", "Recreation", "Education", "Community Safety", "Finance", "Environment", "Transportation", "Food & Drink", "Uncategorized"];

const categorySelect = document.createElement("select");
categorySelect.className = "form-select mb-3";



categorySelect.innerHTML = categories.map(c =>
    `<option value="${c}">${c || "All Categories"}</option>`
).join("");

searchContainer.insertBefore(categorySelect, document.getElementById("search"));

categorySelect.addEventListener("change", e => {
    selectedCategory = e.target.value;
    renderResources(search.value.toLowerCase());
});

document.getElementById("search").addEventListener("input", e => {
    renderResources(e.target.value.toLowerCase());
});

document.getElementById("requestForm").addEventListener("submit", e => {
    e.preventDefault();

    pending.push({
        title: title.value,
        description: description.value,
        category: category.value
    });

    localStorage.setItem("pending", JSON.stringify(pending));
    e.target.reset();

    showToast("Resource request submitted for admin review!", "success");
});

renderResources();

const aiModal = document.getElementById("aiChatModal");
const aiChatBody = document.getElementById("aiChatBody");
const aiUserInput = document.getElementById("aiUserInput");

const startBtn = document.getElementById("startAI");
const closeBtn = document.getElementById("closeAI");
const sendBtn = document.getElementById("aiSendBtn");

let aiStep = 0;
let aiAnswers = {};
let aiQuestions = [
    { id:"interest", text:"What are you interested in? Please type your choice exactly as seen below.", options:["Health & Fitness","Education","Finance","Food & Drink","Recreation","Community Safety","Environment","Transportation"] },
   
                                { id:"format", text:"Do you prefer in-person or online resources?", options:["In-person","Online"] }
];

startBtn.addEventListener("click", () => {
    aiModal.style.display = "flex";
    aiStep = 0;
    aiAnswers = JSON.parse(localStorage.getItem("aiMemory")) || {};
    aiChatBody.innerHTML = "";

    setTimeout(() => showAIMessage("Hi! I'm ResBot 🤖. I will help you find the best community resources. Ready? Say 'Yes' to start."), 500);
});

closeBtn.addEventListener("click", () => aiModal.style.display = "none");

sendBtn.addEventListener("click", handleAIInput);


aiUserInput.addEventListener("keypress", e => { if(e.key === "Enter") handleAIInput(); });

function showAIMessage(text){
    const div = document.createElement("div");
    div.className = "ai-msg bot";
    div.textContent = text;
    aiChatBody.appendChild(div);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

function showUserMessage(text){
    const div = document.createElement("div");
    div.className = "ai-msg user";
    div.textContent = text;
    aiChatBody.appendChild(div);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

function handleAIInput(){
    const val = aiUserInput.value.trim();
    if(!val) return;
    showUserMessage(val);
    aiUserInput.value = "";
    if(aiStep === 0){
        if(val.toLowerCase() === "yes"){
            aiStep++;
            askNextQuestion();
        } else {
            showAIMessage("No worries! You can start me anytime by clicking the button again.");
        }
    } else if(aiStep <= aiQuestions.length){
        const question = aiQuestions[aiStep-1];
        aiAnswers[question.id] = val;
        aiStep++;
        askNextQuestion();


    }
}

function askNextQuestion(){
    if(aiStep <= aiQuestions.length){
        const question = aiQuestions[aiStep-1];
        showAIMessage(question.text + " Options: " + question.options.join(", "));
    } else {
        showAIMessage("Great! Let me find the best resources for you. Gimme one sec...");
        setTimeout(showAIRecommendations, 800);
    }
}

function showAIRecommendations(){
    localStorage.setItem("aiMemory", JSON.stringify(aiAnswers));

    let filtered = [...lockedResources,...resources].filter(r => {
        return (aiAnswers.interest ? r.category === aiAnswers.interest : true);
    });

    if(filtered.length === 0) {
        showAIMessage("Apologies. I couldn't find anything matching your answers, but feel free to explore the directory!");
        return;
    }

    filtered.forEach(r => {
        showAIMessage(`⭐ ${r.title}: ${r.description}`);
    });

    showToast("ResBot finished recommendations! Scroll down to see all resources.", "success");
}

if(!localStorage.getItem("progress")) {
    localStorage.setItem("progress", JSON.stringify({ resBotUses: 0, requestsSubmitted: 0 }));
}


startBtn.addEventListener("click", () => {
    const progress = JSON.parse(localStorage.getItem("progress"));
    progress.resBotUses++;
    localStorage.setItem("progress", JSON.stringify(progress));
});

document.getElementById("requestForm").addEventListener("submit", e => {
    const progress = JSON.parse(localStorage.getItem("progress"));
    progress.requestsSubmitted++;
    localStorage.setItem("progress", JSON.stringify(progress));
});


