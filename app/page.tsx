import Link from "next/link";

const programmes = [
  { slug: "introduction", title: "Introduction to Buddhism", duration: "10 weeks", level: "Foundation", description: "An accessible introduction to the Buddha’s teaching, practice and relevance to daily life." },
  { slug: "diploma", title: "Diploma in Buddhism", duration: "1 year", level: "Diploma", description: "A structured foundation in Buddhist doctrine, history, culture and practice." },
  { slug: "ba", title: "BA in Buddhist Studies", duration: "3 years", level: "Undergraduate", description: "A comprehensive academic programme affiliated with the Buddhist and Pali University of Sri Lanka." },
  { slug: "ma", title: "MA in Buddhist Studies", duration: "1 year", level: "Postgraduate", description: "Advanced study of Buddhist philosophy, psychology, society, arts and culture." },
];

const values = [
  ["Established in Singapore", "Serving learners since 1993"],
  ["Open to everyone", "Welcoming lay and monastic students"],
  ["Rooted in tradition", "Study connected to lived practice"],
];

function Header() {
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">BPC</span><span>Buddhist & Pali College<small>Singapore</small></span></Link><nav aria-label="Main navigation"><Link href="#programmes">Programmes</Link><Link href="#about">About</Link><Link href="#resources">Resources</Link><Link className="nav-cta" href="#contact">Contact</Link></nav></header>;
}

function Footer() {
  return <footer id="contact"><div><p className="eyebrow">Visit the College</p><h2>Begin your study of the Dhamma.</h2><p>30 Jalan Eunos, Singapore 419495<br />Located at Mangala Vihara Buddhist Temple</p></div><div className="footer-links"><a href="mailto:bpcsingapore@gmail.com">Email the College</a><a href="https://www.facebook.com/bpcsin/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/bpcsin/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.youtube.com/channel/UCjBK7PgFNmG5EJcNXoWJysA" target="_blank" rel="noreferrer">YouTube</a></div><p className="copyright">© 2019–2026 Buddhist and Pali College of Singapore</p></footer>;
}

export default function Home() {
  return <><Header /><main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">Buddhist education for everyone</p><h1>Wisdom for a changing world.</h1><p className="lead">Explore the Buddha’s teachings through thoughtful, structured study in the heart of Singapore.</p><div className="actions"><a className="button primary" href="#programmes">Explore programmes</a><a className="button secondary" href="#about">Discover our story</a></div></div><div className="hero-art" aria-hidden="true"><div className="sun"/><div className="arch"><span>Since</span><strong>1993</strong></div></div></section>
    <section className="values" aria-label="College highlights">{values.map(([title, text], i)=><article key={title}><span>0{i+1}</span><h2>{title}</h2><p>{text}</p></article>)}</section>
    <section className="section programmes" id="programmes"><div className="section-heading"><div><p className="eyebrow">Study pathways</p><h2>Programmes for every stage</h2></div><p>Begin with a short introduction or pursue a full academic pathway in Buddhist Studies.</p></div><div className="programme-grid">{programmes.map((p, i)=><article className="programme" key={p.slug}><div className="programme-top"><span>{p.level}</span><b>{String(i+1).padStart(2,"0")}</b></div><h3>{p.title}</h3><p>{p.description}</p><div className="programme-meta"><span>{p.duration}</span><a href={`https://www.bpc.edu.sg/${p.slug === "introduction" ? "intro" : p.slug}.html`} target="_blank" rel="noreferrer">Course details ↗</a></div></article>)}</div></section>
    <section className="section story" id="about"><div className="story-quote"><p>“In the world of darkness, BPC illuminates the Dhamma.”</p></div><div className="story-copy"><p className="eyebrow">Our story</p><h2>Three decades of learning, reflection and community.</h2><p>Founded in 1993, the Buddhist and Pali College of Singapore supports the study and practice of Buddhism through accessible courses and university-affiliated programmes.</p><p>Classes are conducted at Mangala Vihara Buddhist Temple by monastic and lay teachers with deep academic and practical experience.</p><a href="https://www.bpc.edu.sg/about.html" target="_blank" rel="noreferrer">Read the full history ↗</a></div></section>
    <section className="section resources" id="resources"><div><p className="eyebrow">Library & community</p><h2>Continue learning beyond the classroom.</h2></div><div className="resource-list"><a href="https://www.bpc.edu.sg/elibrary.html" target="_blank" rel="noreferrer"><span>01</span><strong>eLibrary</strong><em>Books and learning resources ↗</em></a><a href="https://www.bpc.edu.sg/alumni.html" target="_blank" rel="noreferrer"><span>02</span><strong>Alumni bulletins</strong><em>College news and community stories ↗</em></a><a href="https://www.bpc.edu.sg/key.html" target="_blank" rel="noreferrer"><span>03</span><strong>Key dates</strong><em>Academic calendar and events ↗</em></a></div></section>
  </main><Footer /></>;
}
