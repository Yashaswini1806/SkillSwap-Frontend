// app.js - small client-side data & UI
const sampleData = [
  {id:1,name:"Aisha",skill:"Python basics",category:"Tech",price:300,rate:4.8,desc:"Intro to Python, 60 min hands-on",img:"https://i.pravatar.cc/100?img=32",distance:1.2},
  {id:2,name:"Rahul",skill:"Guitar (acoustic)",category:"Music",price:250,rate:4.7,desc:"Chords & strumming for beginners",img:"https://i.pravatar.cc/100?img=12",distance:2.5},
  {id:3,name:"Sneha",skill:"Resume review",category:"Design",price:200,rate:4.9,desc:"CV improvements + ATS tips",img:"https://i.pravatar.cc/100?img=45",distance:0.8},
  {id:4,name:"Karan",skill:"Data Structures crash",category:"Tech",price:450,rate:4.6,desc:"30 minute concept + problems",img:"https://i.pravatar.cc/100?img=5",distance:3.0},
  {id:5,name:"Meera",skill:"Photoshop quickstart",category:"Design",price:350,rate:4.5,desc:"Basics of layers + retouching",img:"https://i.pravatar.cc/100?img=20",distance:1.8},
  {id:6,name:"Vikram",skill:"Bike repair basics",category:"Handyman",price:150,rate:4.3,desc:"Simple tune-up + flat fixes",img:"https://i.pravatar.cc/100?img=8",distance:2.1},
  {id:7,name:"Anya",skill:"Linear Algebra tutoring",category:"Tutoring",price:300,rate:4.8,desc:"Vector spaces + matrices",img:"https://i.pravatar.cc/100?img=14",distance:0.6}
];

const cardsEl = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');
const quickSearch = document.getElementById('quickSearch');
const quickBtn = document.getElementById('quickBtn');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const yearEl = document.getElementById('year');
const darkToggle = document.getElementById('darkToggle');
const offerBtn = document.getElementById('offerBtn');
const paginationEl = document.getElementById('pagination');

let favorites = JSON.parse(localStorage.getItem('ss_fav')||'[]');
let currentPage = 1;
const PAGE_SIZE = 6;

function render(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  let filtered = sampleData.filter(s=>{
    if(cat !== 'all' && s.category !== cat) return false;
    if(!q) return true;
    return (s.skill+s.name+s.desc).toLowerCase().includes(q);
  });

  // sort
  const sort = sortSelect.value;
  if(sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);

  // pagination
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if(currentPage > pages) currentPage = pages;
  const start = (currentPage-1)*PAGE_SIZE;
  const pageItems = filtered.slice(start, start+PAGE_SIZE);

  cardsEl.innerHTML = '';
  if(pageItems.length === 0) {
    cardsEl.innerHTML = `<div class="card"><p>No results found — try a different search.</p></div>`;
  } else {
    pageItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('role','listitem');
      card.innerHTML = `
        <div class="meta">
          <img class="avatar" alt="${item.name}" src="${item.img}" />
          <div>
            <h4>${item.skill}</h4>
            <small>${item.name} • ${item.category}</small>
          </div>
        </div>
        <p>${item.desc}</p>
        <div class="actions">
          <div>
            <strong>₹${item.price}</strong> • ${item.rate}⭐ • ${item.distance} km
          </div>
          <div style="margin-left:auto;display:flex;gap:.4rem">
            <button class="btn" onclick="showProfile(${item.id})">View</button>
            <button class="favorite" aria-pressed="${favorites.includes(item.id)}" onclick="toggleFav(${item.id},this)">${favorites.includes(item.id) ? '★' : '☆'}</button>
          </div>
        </div>
      `;
      cardsEl.appendChild(card);
    });
  }

  // pagination controls
  paginationEl.innerHTML = '';
  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = i;
    b.onclick = ()=>{ currentPage = i; render(); };
    if(i===currentPage) b.style.border = '2px solid var(--accent)';
    paginationEl.appendChild(b);
  }
}

// small UI helpers
window.showProfile = function(id){
  const p = sampleData.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.name} — ${p.skill}\n\n${p.desc}\n\nPrice: ₹${p.price}/hr\nRating: ${p.rate}`);
}

window.toggleFav = function(id,btn){
  const idx = favorites.indexOf(id);
  if(idx === -1){
    favorites.push(id);
    btn.innerText = '★';
    btn.setAttribute('aria-pressed','true');
  } else {
    favorites.splice(idx,1);
    btn.innerText = '☆';
    btn.setAttribute('aria-pressed','false');
  }
  localStorage.setItem('ss_fav', JSON.stringify(favorites));
}

// events
searchInput.addEventListener('input', ()=>{ currentPage=1; render(); });
quickBtn.addEventListener('click', ()=>{ searchInput.value = quickSearch.value; currentPage=1; render(); });
categorySelect.addEventListener('change', ()=>{ currentPage=1; render(); });
sortSelect.addEventListener('change', ()=>{ currentPage=1; render(); });
document.getElementById('sendBtn').addEventListener('click', ()=>{
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  if(!email || !message) { alert('Please fill both fields.'); return; }
  const mailto = `mailto:you@example.com?subject=SkillSwap%20Feedback&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
  window.location.href = mailto;
});

// dark mode
darkToggle.addEventListener('click', ()=>{
  const isDark = document.documentElement.classList.toggle('dark');
  darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  localStorage.setItem('ss_dark', isDark ? '1' : '0');
});

// Offer a skill (demo)
offerBtn.addEventListener('click', ()=>{
  const name = prompt('Your name');
  const skill = prompt('Skill you offer (e.g., "Photoshop intro")');
  if(!name || !skill) return;
  const id = Date.now();
  sampleData.unshift({id,name,skill,category:"Tutoring",price:200,rate:4.5,desc:"Offered by " + name,img:`https://i.pravatar.cc/100?u=${id}`,distance:1});
  render();
});

// initialize
yearEl.textContent = new Date().getFullYear();
if(localStorage.getItem('ss_dark') === '1') document.documentElement.classList.add('dark');
render();
