const issesContainer = document.getElementById("issues_container");
const loadingSpinner = document.getElementById("loading");
const navButtons = document.querySelectorAll("#nav_buttons a");
const count = document.getElementById('count');
const modal = document.getElementById('modal');
const title = document.getElementById("title");
const open = document.getElementById("open");
const author = document.getElementById("author");
const date = document.getElementById("date");
const bug = document.getElementById("bug");
const description = document.getElementById("description");
const assign = document.getElementById("assign");
const priority = document.getElementById("priority");
const wanted = document.getElementById("wanted");


navButtons.forEach((button) => {
  button.addEventListener('click', () => {
     
    loadingSpinner.classList.remove("hidden");
      loadingSpinner.innerHTML = "";
    navButtons.forEach((btn) => {
      btn.classList.remove("btn-primary");
      btn.classList.remove("btn-outline");
    });
    button.classList.add("btn-primary");
  })
});





let allIssues = [];


async function loadIssues() {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  loadingSpinner.classList.add("hidden");
  allIssues = data.data;
  displayIssues(allIssues);
}


function displayIssues(issues) {
  issesContainer.innerHTML=""
  issues.forEach((issue) => {
    const borderColor = issue.status === "closed" ? "#A855F7" : "#3cea53";
    const symbol = issue.status === "closed" ? "Status.png" : "Open-Status.png";
    const card = document.createElement('div')
    card.innerHTML = `
     <div id="cardBody" class="card max-w-80 bg-base-100 card-lg shadow-sm border-t-5 border-[${borderColor}]">
            
            <div class="card-body">
             
              <div class="flex justify-between items-center">
                <img src="./assets/${symbol}" alt="">
                <button class="btn btn-soft btn-secondary rounded-full px-8">${issue.priority.toUpperCase()}</button>
              </div>
              <h2 onclick="openModal(${issue.id})" class="card-title">${issue.title}</h2>
              <p class="text-[#64748B] line-clamp-2">${issue.description}</p>
              <div class="card-actions pt-3 grid grid-cols-2 justify-between items-center gap-11 ">
                <button class="btn btn-soft btn-warning rounded-sm">${issue.labels[0]}</button>
                <button class="btn btn-soft btn-warning rounded-sm">${issue.labels[1]||"Empthy"}</button>
              </div>
              
            </div>
            <hr class="bg-slate-500 opacity-10">
            <div class="flex justify-between items-center p-5">
              <div>
              <p class="text-[#64748B] text-[12px]">#<span>${issue.id}</span> by <span>${issue.author || "not found"} </span></p>
              <p class="text-[#64748B] text-[12px]">Assignee: ${issue.assignee || "not found"}</p>
              </div>
              <div>
              <p class="text-[#64748B] text-[12px]">Created: ${new Date(issue.createdAt).toLocaleDateString()}</p>
              <p class="text-[#64748B] text-[12px]">Uploaded: ${new Date(issue.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
    `;
    issesContainer.appendChild(card)
  });
}

function selectButtons(id) {
  loadingSpinner.classList.remove("hidden");
  setTimeout(() => {
      if (id === "all") {
        displayIssues(allIssues);
        const allCount = allIssues.length
        count.innerText=allCount
      }
      if (id === "open") {
        const openIssues = allIssues.filter((issue) => issue.status === "open");
        displayIssues(openIssues);
        const openCount = openIssues.length
        count.innerText=openCount
      }
      if (id === "closed") {
        const closedIssues = allIssues.filter(
          (issue) => issue.status === "closed",
        );
        displayIssues(closedIssues);
        const closedCount = closedIssues.length
        count.innerText=closedCount
      }
      loadingSpinner.classList.add("hidden");
  }, 500);

}



async function openModal(issueId) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`,
  );
  const data = await res.json();
  const details = data.data;
  modal.showModal();
  title.textContent = details.title;
  description.textContent = details.description;
  open.textContent = details.status;
  bug.textContent = details.labels[0];
  wanted.textContent = details.labels[1] || "empthy";
  assign.textContent = details.assignee || "not found";
  priority.textContent = details.priority;
  author.textContent = details.author;
  date.textContent = new Date(details.createdAt).toLocaleDateString();
}

async function showCard() {
  const searchinput = document.getElementById("seachBox");
  const value = searchinput.value
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`
  );
  const data = await res.json()
  const show=data.data
  displayIssues(show)
  count.innerText=show.length
}

loadIssues();
