
// Partículas dinâmicas
const bg = document.querySelector('.background-particles');
function makeParticle(){
  const p = document.createElement('div');
  p.className='particle';
  const size = Math.random()*6 + 2;
  p.style.width = p.style.height = size + 'px';
  p.style.left = Math.random()*100 + '%';
  p.style.top = Math.random()*100 + '%';
  const dur = Math.random()*12 + 6;
  p.style.opacity = Math.random()*0.6 + 0.2;
  p.style.transform = 'translateY(0)';
  p.animate([
    { transform: 'translateY(0) scale(0.6)', opacity: p.style.opacity },
    { transform: 'translateY(-120vh) scale(1.2)', opacity: 0 }
  ], { duration: dur*1000, iterations: 1, easing: 'linear' });
  bg.appendChild(p);
  setTimeout(()=> p.remove(), dur*1000);
}

for(let i=0;i<40;i++){ setTimeout(makeParticle, i*200); }
setInterval(()=>{ makeParticle(); }, 900);

// Observers para animações
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: '0px 0px -80px 0px' };
const appearOnScroll = new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('active'); obs.unobserve(entry.target); }
  });
}, appearOptions);
faders.forEach(f=> appearOnScroll.observe(f));

// Timeline observer
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('active');
    else entry.target.classList.remove('active');
  });
},{threshold:0.45, rootMargin:'0px 0px -40px 0px'});
timelineItems.forEach(i=> timelineObserver.observe(i));

// Smooth scroll for nav and button
document.querySelectorAll('.navbar a, .scroll-to-top-button').forEach(el=>{
  el.addEventListener('click', e=>{
    e.preventDefault();
    const target = document.querySelector(el.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth'});
  });
});

// Small accessibility tweak: focus visible for keyboard navigation
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('user-is-tabbing');
});

// Search movie if AI
const moodtextarea = document.getElementById("test-input");
const searchbutton = document.getElementById("search-button");

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  moodtextarea.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  });

  searchbutton.addEventListener("click", handleSearch);
}

async function handleSearch() {
  const mood = moodtextarea.value.trim();

  if (!mood) {
    alert("Escreva algo no campo de Humor!");
    return;
  }

  const response = await fetch("https://victorgimenes.app.n8n.cloud/webhook/site-futurista", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userPrompt: mood })
  });

  const data = await response.json();

  if (data && data.results.length > 0) {
		const movie = data.results[0];
		const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

		const resultsDiv = document.getElementById("results");
		const moviesGrid = document.getElementById("movies");
console
		resultsDiv.classList.add("show");

		moviesGrid.innerHTML = `<div class="movies">
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movie.title}" />
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                   
                    <div class="movie-rating">⭐ ${movie.vote_average.toFixed() || "N/A"} / 10</div>
                </div>
            </div>`;
  }
}