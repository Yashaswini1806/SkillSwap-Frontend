import React, { useEffect, useMemo, useState } from 'react'

const SAMPLE = [
  {id:1,name:"Aisha",skill:"Python basics",category:"Tech",price:300,rate:4.8,desc:"Intro to Python, 60 min hands-on",img:"https://i.pravatar.cc/120?img=32",distance:1.2},
  {id:2,name:"Rahul",skill:"Guitar (acoustic)",category:"Music",price:250,rate:4.7,desc:"Chords & strumming for beginners",img:"https://i.pravatar.cc/120?img=12",distance:2.5},
  {id:3,name:"Sneha",skill:"Resume review",category:"Design",price:200,rate:4.9,desc:"CV improvements + ATS tips",img:"https://i.pravatar.cc/120?img=45",distance:0.8},
  {id:4,name:"Karan",skill:"Data Structures crash",category:"Tech",price:450,rate:4.6,desc:"30 minute concept + problems",img:"https://i.pravatar.cc/120?img=5",distance:3.0},
  {id:5,name:"Meera",skill:"Photoshop quickstart",category:"Design",price:350,rate:4.5,desc:"Basics of layers + retouching",img:"https://i.pravatar.cc/120?img=20",distance:1.8},
  {id:6,name:"Vikram",skill:"Bike repair basics",category:"Handyman",price:150,rate:4.3,desc:"Simple tune-up + flat fixes",img:"https://i.pravatar.cc/120?img=8",distance:2.1},
  {id:7,name:"Anya",skill:"Linear Algebra tutoring",category:"Tutoring",price:300,rate:4.8,desc:"Vector spaces + matrices",img:"https://i.pravatar.cc/120?img=14",distance:0.6}
]

export default function App(){
  const [items, setItems] = useState(() => SAMPLE.slice())
  const [dark, setDark] = useState(() => localStorage.getItem('ss_dark') === '1')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState(()=>JSON.parse(localStorage.getItem('ss_fav')||'[]'))
  const [selected, setSelected] = useState(null)
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const modalPrevActive = React.useRef(null)

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('ss_dark', dark ? '1' : '0')
  },[dark])

  useEffect(()=>{
    localStorage.setItem('ss_fav', JSON.stringify(favorites))
  },[favorites])

  const PAGE_SIZE = 6

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    let out = items.filter(s=>{
      if(category !== 'all' && s.category !== category) return false
      if(!q) return true
      return (s.skill + ' ' + s.name + ' ' + s.desc).toLowerCase().includes(q)
    })
    if(sort === 'price-asc') out.sort((a,b)=>a.price-b.price)
    else if(sort === 'price-desc') out.sort((a,b)=>b.price-a.price)
    return out
  },[query,category,sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  if(page > pages) setPage(pages)

  const pageItems = filtered.slice((page-1)*PAGE_SIZE, (page-1)*PAGE_SIZE + PAGE_SIZE)

  function toggleFav(id){
    setFavorites(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id])
  }

  function viewProfile(id){
    const p = items.find(s=>s.id===id)
    if(!p) return
    modalPrevActive.current = document.activeElement
    setSelected(p)
  }

  // keyboard handling + focus restore for modal
  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') setSelected(null)
    }
    if(selected){
      document.addEventListener('keydown', onKey)
      // focus modal root for accessibility
      setTimeout(()=>{
        const m = document.querySelector('.modal')
        if(m) m.focus()
      }, 0)
    }
    return ()=>{ document.removeEventListener('keydown', onKey) }
  },[selected])

  useEffect(()=>{
    if(!selected && modalPrevActive.current){
      try{ modalPrevActive.current.focus() }catch(e){}
      modalPrevActive.current = null
    }
  },[selected])

  return (
    <div>
      <header className="site-header container fade-in-slow">
        <a className="brand" href="#" aria-label="SkillSwap homepage">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#2065F6"></rect>
            <path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SkillSwap</span>
        </a>

        <nav className="nav" aria-label="Main navigation">
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#browse">Browse</a>
          <a className="btn btn-outline" href="#browse">Browse Skills</a>
          <button id="darkToggle" className="icon-btn" aria-pressed={dark ? 'true' : 'false'} title="Toggle dark mode" onClick={()=>setDark(d=>!d)}>{dark ? '☀️' : '🌙'}</button>
        </nav>
      </header>

      <main>
        <section className="hero container" id="home">
          <div className="hero-left">
            <h1>Learn a new skill. Teach what you know.</h1>
            <p className="lead">SkillSwap connects neighbourhood learners and makers for short, focused sessions — perfect for students, creatives and busy professionals.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#browse">Find Skills</a>
              <button id="offerBtn" className="btn btn-ghost" onClick={()=>{
                const name = prompt('Your name')
                const skill = prompt('Skill you offer (e.g., "Photoshop intro")')
                if(!name || !skill) return
                const id = Date.now()
                const newItem = { id, name, skill, category: 'Tutoring', price: 200, rate: 4.5, desc: 'Offered by ' + name, img: `https://i.pravatar.cc/120?u=${id}`, distance: 1 }
                setItems(prev => [newItem, ...prev])
                setPage(1)
              }}>Offer a Skill</button>
            </div>
            <ul className="trust">
              <li>Fast local matches</li>
              <li>Micro-sessions (30–60 min)</li>
              <li>Client-side demo — easy to extend</li>
            </ul>
          </div>

          <div className="hero-right" aria-hidden="true">
            <div className="hero-card-visual">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b1a9b1b6f4a7f9d8d5f0c9fedf1e3f1" alt="Community learning" loading="lazy" />
            </div>
          </div>
        </section>

        <section id="features" className="container features">
          <h2 className="section-title">How SkillSwap helps</h2>
          <div className="feature-grid">
            <article className="feature fade-in">
              <div className="icon">⚡</div>
              <h3>Quick Matches</h3>
              <p>Find the nearest person offering the skill you need, instantly.</p>
            </article>

            <article className="feature fade-in" style={{animationDelay:'80ms'}}>
              <div className="icon">⏱️</div>
              <h3>Micro-sessions</h3>
              <p>Short 30–60 minute lessons keep learning focused and manageable.</p>
            </article>

            <article className="feature fade-in" style={{animationDelay:'160ms'}}>
              <div className="icon">💾</div>
              <h3>Bookmarks</h3>
              <p>Save favorites in your browser — client-side persistence with localStorage.</p>
            </article>
          </div>
        </section>

        <section id="browse" className="container browse">
          <div className="browse-header">
            <h2 className="section-title">Browse available skill swaps</h2>
            <div className="controls">
              <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1); }} id="searchInput" className="input" placeholder="Search skills or names..." aria-label="Search skills or names" />
              <select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} id="categorySelect" aria-label="Filter by category" className="select">
                <option value="all">All categories</option>
                <option>Tech</option>
                <option>Music</option>
                <option>Design</option>
                <option>Tutoring</option>
                <option>Handyman</option>
              </select>
              <select value={sort} onChange={e=>{ setSort(e.target.value); setPage(1); }} id="sortSelect" aria-label="Sort results" className="select">
                <option value="relevance">Most relevant</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div id="cards" className="cards" role="list" aria-live="polite">
            {pageItems.length === 0 && (<div className="card"><p>No results — try a different search.</p></div>)}
            {pageItems.map((item, idx)=> (
              <article key={item.id} className="card fade-in" role="listitem" style={{animationDelay:`${idx * 40}ms`}}>
                <div className="meta">
                  <img className="avatar" alt={item.name} src={item.img} loading="lazy" />
                  <div>
                    <h4>{item.skill}</h4>
                    <small>{item.name} • {item.category}</small>
                  </div>
                </div>
                <p>{item.desc}</p>
                <div className="actions">
                  <div>
                    <strong>₹{item.price}</strong> • {item.rate}⭐ • {item.distance} km
                  </div>
                  <div style={{marginLeft:'auto',display:'flex',gap:'.4rem'}}>
                    <button className="btn" aria-label={`View ${item.name}`} onClick={()=>viewProfile(item.id)}>View</button>
                    <button className={`favorite`} aria-pressed={favorites.includes(item.id)} onClick={()=>toggleFav(item.id)}>{favorites.includes(item.id) ? '★' : '☆'}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div id="pagination" className="pagination" aria-hidden={pages<=1}>
            {Array.from({length:pages},(_,i)=>i+1).map(i=> (
              <button key={i} className="btn" onClick={()=>setPage(i)} style={i===page?{border:'2px solid var(--accent)'}:{}}>{i}</button>
            ))}
          </div>
        </section>

        <section className="container contact" id="contact">
          <div className="contact-card">
            <h3>Share feedback</h3>
            <p>If you found a bug or have an idea, send a short message.</p>
            <form id="contactForm" onSubmit={(e)=>e.preventDefault()}>
              <label className="sr-only" htmlFor="email">Your email</label>
              <input id="email" type="email" placeholder="you@example.com" required value={contactEmail} onChange={e=>setContactEmail(e.target.value)} />
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" rows="3" placeholder="Tell us what you think..." required value={contactMessage} onChange={e=>setContactMessage(e.target.value)}></textarea>
              <div className="form-actions">
                <button id="sendBtn" className="btn btn-primary" onClick={()=>{
                  if(!contactEmail || !contactMessage){ alert('Please fill both fields.'); return }
                  const mailto = `mailto:you@example.com?subject=SkillSwap%20Feedback&body=${encodeURIComponent(contactMessage + '\n\nFrom: ' + contactEmail)}`
                  window.location.href = mailto
                }}>Send (mailto)</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer container fade-in-slow">
        <div>© <span id="year">{new Date().getFullYear()}</span> SkillSwap • Demo by <strong>M Yashaswini Rao</strong></div>
        <div className="small">Repo: <a href="https://github.com/Yashaswini1806/SkillSwap-Frontend" target="_blank" rel="noopener">github.com/Yashaswini1806/SkillSwap-Frontend</a></div>
      </footer>

      {/* profile modal */}
      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={`${selected.name} profile`} onClick={()=>setSelected(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
              <img src={selected.img} alt={selected.name} className="avatar" />
              <div>
                <h3 style={{margin:0}}>{selected.skill}</h3>
                <small>{selected.name} • {selected.category}</small>
              </div>
            </div>
            <p style={{marginTop:'.6rem'}}>{selected.desc}</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'.8rem'}}>
              <div><strong>₹{selected.price}</strong> • {selected.rate}⭐</div>
              <div>
                <button className="btn btn-primary" onClick={()=>{ alert('Contact flow demo') }}>Contact</button>
                <button className="btn" onClick={()=>setSelected(null)} style={{marginLeft:'.6rem'}}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
