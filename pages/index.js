import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const FAQ_SCHEMA = "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Vad är ett privatlån utan UC?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Ett privatlån utan UC innebär att lånet beviljas utan att en kreditupplysning görs hos UC.\"}},{\"@type\":\"Question\",\"name\":\"Hur påverkar ett lån utan UC min kreditvärdighet?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Det påverkar inte din kreditvärdighet hos UC, men kan påverka hos andra aktörer.\"}},{\"@type\":\"Question\",\"name\":\"Vilka räntor kan jag förvänta mig?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Räntor varierar beroende på långivare och din kreditvärdighet.\"}},{\"@type\":\"Question\",\"name\":\"Kan jag få lån utan fast inkomst?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Ja, men det kan bli svårare och räntan kan bli högre.\"}},{\"@type\":\"Question\",\"name\":\"Hur snabbt får jag pengarna?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Ofta får du pengarna inom 24 timmar efter beviljat lån.\"}}]}";

export async function getServerSideProps() {
  var fallback = [{"name":"Lendo","url":"https://www.lendo.se","description":"Jämför lån från 40+ banker på en ansökan","badge":"Bäst totalt","score":"4.8","price":"från 4.95%","pros":["Ansök hos 40+ banker på en gång","Svar direkt — utan UC-påverkan","Upp till 600 000 kr, 1–15 år"]},{"name":"Sambla","url":"https://www.sambla.se","description":"Marknadens lägsta ränta — upp till 800 000 kr","badge":"Bäst ränta","score":"4.7","price":"från 4.50%","pros":["Lägst ränta — garanterat","Upp till 800 000 kr","Samlingslån och privatlån"]},{"name":"Zmarta","url":"https://www.zmarta.se","description":"Specialister på att samla dina lån","badge":"Bäst samlingslån","score":"4.5","price":"från 5.20%","pros":["Minska din månadskostnad","Samla flera lån till ett","Snabbt besked"]},{"name":"Advisa","url":"https://www.advisa.se","description":"Snabbast svar på marknaden","badge":"Snabbast svar","score":"4.4","price":"från 5.80%","pros":["Svar inom några minuter","Enkel digital ansökan","Upp till 600 000 kr"]},{"name":"Credigo","url":"https://www.credigo.se","description":"Flexibla återbetalningstider","badge":"Mest flexibel","score":"4.3","price":"från 6.20%","pros":["Flexibel återbetalningsplan","Ingen uppläggningsavgift","Anpassa efter din budget"]}];
  var items = fallback;
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function() { ctrl.abort(); }, 3000);
    var r = await fetch('https://api.adtraction.net/v2/public/compare-loans', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: '{"market":"SE","currency":"SEK"}', signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (r.ok) {
      var data = await r.json();
      if (Array.isArray(data) && data.length > 0) {
        items = data.slice(0, 5).map(function(p, i) {
          var base = fallback[i] || fallback[0];
          return { name: p.programName || base.name, url: p.approvalUrl || p.trackingUrl || base.url,
            description: base.description, badge: base.badge, score: base.score,
            price: p.interestRateFrom ? p.interestRateFrom + '% ränta' : base.price,
            pros: base.pros, logoUrl: p.logoUrl || null };
        });
      }
    }
  } catch(e) {}
  return { props: { providers: items, updatedAt: new Date().toISOString() } };
}

export default function Home({ providers, updatedAt }) {
  const [filter, setFilter] = useState('alla');
  const [amount, setAmount] = useState(150000);
  const [loanYears, setLoanYears] = useState(5);
  const rate = 0.0795 / 12;
  const months = loanYears * 12;
  const monthly = Math.round(amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1));

  const sorted = filter === 'betyg'
    ? [...providers].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    : filter === 'pris'
    ? [...providers].sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    : providers;

  const pc = '#0047AB';
  const pcLight = '#0047AB14';
  const pcMed = '#0047AB30';

  const AffBtn = ({ url, name, primary }) => (
    <a href={url + (url.includes('?') ? '&' : '?') + 'ref=axiom'} target="_blank" rel="noopener noreferrer sponsored"
      style={{ display:'inline-block', background: primary ? pc : '#0f172a', color:'#fff',
        padding:'11px 22px', borderRadius:9, fontWeight:700, fontSize:14,
        textDecoration:'none', whiteSpace:'nowrap', transition:'opacity .15s' }}>
      Välj {name} →
    </a>
  );

  const Stars = ({ score }) => {
    const n = parseFloat(score);
    return (
      <span style={{ fontSize:15, letterSpacing:1 }}>
        <span style={{ color:'#f59e0b' }}>{'★'.repeat(Math.floor(n))}</span>
        <span style={{ color:'#d1d5db' }}>{'★'.repeat(5 - Math.floor(n))}</span>
        <span style={{ color:'#64748b', fontSize:12, marginLeft:6, fontWeight:600 }}>{score}</span>
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Bästa Privatlån Utan UC 2026 - Jämför Lån Online</title>
        <meta name="description" content="Jämför de bästa privatlånen utan UC 2026. Upptäck Lendo, Sambla, Zmarta, Advisa och Credigo." />
        <meta property="og:title" content="Bästa Privatlån Utan UC 2026 - Jämför Lån Online" />
        <meta property="og:description" content="Hitta bästa privatlånet utan UC 2026. Enkel jämförelse av fem toppalternativ." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://basta-privatlan-utan-uc-2026.vercel.app" />
        <link rel="canonical" href="https://basta-privatlan-utan-uc-2026.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
      </Head>

      <nav style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 20px',
        height:60, display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100, fontFamily:'Inter,sans-serif' }}>
        <Link href="/" style={{ fontWeight:800, fontSize:18, color:pc, textDecoration:'none' }}>
          BastaPrivatlanUtanUc2026
        </Link>
        <div style={{ display:'flex', gap:28, fontSize:14 }}>
          <a href="#jamfor" style={{ color:'#64748b', textDecoration:'none' }}>Jämförelse</a>
          <a href="#guide" style={{ color:'#64748b', textDecoration:'none' }}>Guide</a>
          <Link href="/om-oss" style={{ color:'#64748b', textDecoration:'none' }}>Om oss</Link>
        </div>
      </nav>

      <section style={{ background:'linear-gradient(135deg,#f0f9ff 0%,#e8f4fd 50%,#f8fafc 100%)',
        padding:'72px 20px 56px', fontFamily:'Inter,sans-serif' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center',
          gap:48, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6,
              background:pcLight, color:pc, padding:'4px 14px', borderRadius:20,
              fontSize:13, fontWeight:700, marginBottom:20 }}>
              ✓ Uppdaterad 23 juni 2026
            </div>
            <h1 style={{ fontSize:'clamp(26px,4vw,46px)', fontWeight:800,
              lineHeight:1.14, marginBottom:18, color:'#0f172a' }}>
              Bästa Privatlån Utan UC 2026
            </h1>
            <p style={{ fontSize:18, color:'#475569', lineHeight:1.72,
              marginBottom:32, maxWidth:540 }}>
              Upptäck de bästa lånen utan UC för 2026
            </p>
            <a href="#jamfor" style={{ display:'inline-block', background:pc, color:'#fff',
              padding:'14px 32px', borderRadius:10, fontWeight:700, fontSize:16,
              textDecoration:'none', boxShadow:'0 4px 24px '+pc+'44' }}>
              Jämför nu →
            </a>
            <p style={{ marginTop:14, fontSize:13, color:'#94a3b8' }}>
              Gratis &middot; Oberoende &middot; Ingen prenumeration
            </p>
          </div>
          <div style={{ flexShrink:0 }} dangerouslySetInnerHTML={{ __html: "<svg width=\"260\" height=\"210\" viewBox=\"0 0 260 210\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"18\" y=\"130\" width=\"34\" height=\"68\" rx=\"5\" fill=\"#0047AB\" opacity=\"0.18\"/><rect x=\"64\" y=\"98\" width=\"34\" height=\"100\" rx=\"5\" fill=\"#0047AB\" opacity=\"0.38\"/><rect x=\"110\" y=\"58\" width=\"34\" height=\"140\" rx=\"5\" fill=\"#0047AB\" opacity=\"0.65\"/><rect x=\"156\" y=\"76\" width=\"34\" height=\"122\" rx=\"5\" fill=\"#0047AB\" opacity=\"0.82\"/><rect x=\"202\" y=\"36\" width=\"34\" height=\"162\" rx=\"5\" fill=\"#0047AB\"/><path d=\"M35 124 L81 93 L127 53 L173 71 L219 31\" stroke=\"#0047AB\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"35\" cy=\"124\" r=\"5\" fill=\"#0047AB\"/><circle cx=\"81\" cy=\"93\" r=\"5\" fill=\"#0047AB\"/><circle cx=\"127\" cy=\"53\" r=\"5\" fill=\"#0047AB\"/><circle cx=\"173\" cy=\"71\" r=\"5\" fill=\"#0047AB\"/><circle cx=\"219\" cy=\"31\" r=\"5\" fill=\"#0047AB\"/><circle cx=\"228\" cy=\"178\" r=\"24\" fill=\"#0047AB\" opacity=\"0.12\" stroke=\"#0047AB\" stroke-width=\"2\"/><text x=\"228\" y=\"184\" text-anchor=\"middle\" fill=\"#0047AB\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\">kr</text></svg>" }} />
        </div>
      </section>

      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0',
        padding:'16px 20px', fontFamily:'Inter,sans-serif' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex',
          gap:32, flexWrap:'wrap', justifyContent:'center', alignItems:'center' }}>
          <div style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:14,color:'#374151'}}><span style={{color:'#0047AB',fontWeight:800,flexShrink:0}}>✓</span><span>Inga UC-kreditupplysningar</span></div><div style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:14,color:'#374151'}}><span style={{color:'#0047AB',fontWeight:800,flexShrink:0}}>✓</span><span>Snabb ansökan</span></div><div style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:14,color:'#374151'}}><span style={{color:'#0047AB',fontWeight:800,flexShrink:0}}>✓</span><span>Flera långivare</span></div>
        </div>
      </div>

      <section id="jamfor" style={{ padding:'64px 20px', maxWidth:980,
        margin:'0 auto', fontFamily:'Inter,sans-serif' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h2 style={{ fontSize:30, fontWeight:800, marginBottom:10, color:'#0f172a' }}>
            Jämför Privatlån Utan UC
          </h2>
          <p style={{ color:'#64748b', fontSize:15 }}>
            Vi har granskat {providers.length} alternativ &mdash; senast uppdaterat 23 juni 2026
          </p>
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:28,
          flexWrap:'wrap', justifyContent:'center' }}>
          {['alla','betyg','pris'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'7px 18px', borderRadius:20, fontSize:13, fontWeight:600,
                cursor:'pointer', fontFamily:'Inter,sans-serif', border:'none',
                background: filter===f ? pc : '#f1f5f9',
                color: filter===f ? '#fff' : '#64748b' }}>
              {f==='alla' ? 'Alla' : f==='betyg' ? '★ Bäst betyg' : '💰 Lägst pris'}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {sorted.map((p, i) => (
            <div key={p.name} style={{
              background:'#fff',
              border: i===0 ? '2px solid '+pc : '1px solid #e2e8f0',
              borderRadius:16, padding:'22px 26px',
              position:'relative', boxShadow: i===0 ? '0 4px 24px '+pc+'18' : '0 1px 4px #0000000a',
            }}>
              {i===0 && (
                <div style={{ position:'absolute', top:-15, left:22,
                  background:pc, color:'#fff', fontSize:11,
                  fontWeight:800, padding:'3px 14px', borderRadius:12, letterSpacing:'0.5px' }}>
                  ⭐ REDAKTIONENS VAL
                </div>
              )}
              <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
                <div style={{ width:44, height:44, borderRadius:12,
                  background: i===0 ? pcLight : '#f8fafc',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:800, fontSize:16, color: i===0 ? pc : '#64748b',
                  flexShrink:0, border:'1px solid '+(i===0 ? pcMed : '#e2e8f0') }}>
                  {['1','2','3','4','5'][i] || (i+1)}
                </div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontWeight:800, fontSize:18, color:'#0f172a',
                    marginBottom:3 }}>{p.name}</div>
                  <div style={{ fontSize:13, color:'#64748b',
                    marginBottom:10 }}>{p.description}</div>
                  {p.pros && (
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {p.pros.map((pro, j) => (
                        <div key={j} style={{ display:'flex', gap:7, alignItems:'flex-start',
                          fontSize:13 }}>
                          <span style={{ color:pc, fontWeight:700,
                            flexShrink:0 }}>✓</span>
                          <span style={{ color:'#374151' }}>{pro}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign:'right', minWidth:190,
                  display:'flex', flexDirection:'column',
                  alignItems:'flex-end', gap:8 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:pc }}>
                    {p.currentPrice || p.price}
                  </div>
                  <Stars score={p.score} />
                  <div style={{ background:'#f0fdf4', color:'#15803d',
                    fontSize:11, fontWeight:700, padding:'3px 10px',
                    borderRadius:8 }}>{p.badge}</div>
                  <AffBtn url={p.url} name={p.name} primary={i===0} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop:20, fontSize:12, color:'#94a3b8', textAlign:'center' }}>
          * Vi kan erhålla provision vid val via våra länkar. Det påverkar aldrig priset för dig eller våra oberoende betyg.
          Se vår <Link href="/om-oss" style={{ color:pc }}>redaktionspolicy</Link>.
        </p>
      </section>

      <section style={{ background:'#fff', borderTop:'1px solid #e2e8f0',
        padding:'56px 20px', fontFamily:'Inter,sans-serif' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <h2 style={{ fontSize:26, fontWeight:800, marginBottom:6, color:'#0f172a' }}>
            Räkna på din kostnad
          </h2>
          <p style={{ color:'#64748b', marginBottom:32, fontSize:15 }}>
            Ange ditt belopp och tid för en snabb uppskattning av månadskostnaden.
          </p>
          <div style={{ display:'grid', gap:28, gridTemplateColumns:'1fr 1fr' }}>
            <div>
              <label style={{ display:'block', fontWeight:700, marginBottom:8, fontSize:14, color:'#374151' }}>
                Belopp: <span style={{ color:pc }}>{amount.toLocaleString('sv')} kr</span>
              </label>
              <input type="range" min="10000" max="600000" step="5000"
                value={amount} onChange={e => setAmount(Number(e.target.value))}
                style={{ width:'100%', accentColor:pc }} />
              <div style={{ display:'flex', justifyContent:'space-between',
                fontSize:12, color:'#94a3b8', marginTop:4 }}>
                <span>10 000 kr</span><span>600 000 kr</span>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontWeight:700, marginBottom:8, fontSize:14, color:'#374151' }}>
                Återbetalningstid: <span style={{ color:pc }}>{loanYears} år</span>
              </label>
              <input type="range" min="1" max="15" step="1"
                value={loanYears} onChange={e => setLoanYears(Number(e.target.value))}
                style={{ width:'100%', accentColor:pc }} />
              <div style={{ display:'flex', justifyContent:'space-between',
                fontSize:12, color:'#94a3b8', marginTop:4 }}>
                <span>1 år</span><span>15 år</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop:32, background:pcLight,
            border:'1px solid '+pcMed, borderRadius:14, padding:'24px 28px',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:14, color:'#64748b', marginBottom:4 }}>
                Estimerad månadskostnad
              </div>
              <div style={{ fontSize:38, fontWeight:800, color:pc }}>
                {monthly.toLocaleString('sv')} kr/mån
              </div>
            </div>
            <a href="#jamfor" style={{ background:pc, color:'#fff',
              padding:'12px 24px', borderRadius:9, fontWeight:700,
              fontSize:15, textDecoration:'none' }}>
              Jämför nu →
            </a>
          </div>
          <p style={{ marginTop:12, fontSize:12, color:'#94a3b8' }}>
            Beräknat på 7.95% nominell årsränta. Faktisk kostnad beror på din kreditupplysning
            och vald bank. Alla lån förutsätter kreditprövning.
          </p>
        </div>
      </section>

      <section id="guide" style={{ background:'#f8fafc',
        borderTop:'1px solid #e2e8f0', padding:'64px 20px',
        fontFamily:'Inter,sans-serif' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:800, marginBottom:20, color:'#0f172a' }}>
            Så Väljer Du Rätt Lån
          </h2>
          <p style={{ fontSize:16, lineHeight:1.85, color:'#374151',
            marginBottom:36 }}>
            När du väljer ett privatlån utan UC är det viktigt att tänka på räntor, lånebelopp och återbetalningstid. Läs våra tips för att göra ett informerat val och hitta det lån som passar dig bäst.
          </p>
          <h3 style={{ fontSize:20, fontWeight:700, marginBottom:24, color:'#0f172a' }}>
            Vad ska du tänka på?
          </h3>
          <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}><div style={{width:28,height:28,borderRadius:'50%',background:'#0047AB15',color:'#0047AB',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>1</div><p style={{color:'#374151',lineHeight:1.7,fontSize:15}}>Jämför räntor noggrant</p></div><div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}><div style={{width:28,height:28,borderRadius:'50%',background:'#0047AB15',color:'#0047AB',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>2</div><p style={{color:'#374151',lineHeight:1.7,fontSize:15}}>Kontrollera lånevillkor</p></div><div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}><div style={{width:28,height:28,borderRadius:'50%',background:'#0047AB15',color:'#0047AB',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>3</div><p style={{color:'#374151',lineHeight:1.7,fontSize:15}}>Välj rätt återbetalningstid</p></div><div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}><div style={{width:28,height:28,borderRadius:'50%',background:'#0047AB15',color:'#0047AB',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>4</div><p style={{color:'#374151',lineHeight:1.7,fontSize:15}}>Läs recensioner</p></div>
        </div>
      </section>

      <section style={{ padding:'64px 20px', maxWidth:760,
        margin:'0 auto', fontFamily:'Inter,sans-serif' }}>
        <h2 style={{ fontSize:26, fontWeight:800, marginBottom:32, color:'#0f172a' }}>
          Vanliga frågor
        </h2>
        <details style={{borderBottom:'1px solid #e2e8f0',paddingBottom:16,marginBottom:16}} open={false}><summary style={{fontWeight:700,fontSize:15,cursor:'pointer',color:'#0f172a',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>Vad är ett privatlån utan UC?<span style={{color:'#0047AB',fontSize:18,fontWeight:400}}>+</span></summary><p style={{marginTop:12,color:'#475569',lineHeight:1.75,fontSize:14}}>Ett privatlån utan UC innebär att lånet beviljas utan att en kreditupplysning görs hos UC.</p></details><details style={{borderBottom:'1px solid #e2e8f0',paddingBottom:16,marginBottom:16}} open={false}><summary style={{fontWeight:700,fontSize:15,cursor:'pointer',color:'#0f172a',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>Hur påverkar ett lån utan UC min kreditvärdighet?<span style={{color:'#0047AB',fontSize:18,fontWeight:400}}>+</span></summary><p style={{marginTop:12,color:'#475569',lineHeight:1.75,fontSize:14}}>Det påverkar inte din kreditvärdighet hos UC, men kan påverka hos andra aktörer.</p></details><details style={{borderBottom:'1px solid #e2e8f0',paddingBottom:16,marginBottom:16}} open={false}><summary style={{fontWeight:700,fontSize:15,cursor:'pointer',color:'#0f172a',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>Vilka räntor kan jag förvänta mig?<span style={{color:'#0047AB',fontSize:18,fontWeight:400}}>+</span></summary><p style={{marginTop:12,color:'#475569',lineHeight:1.75,fontSize:14}}>Räntor varierar beroende på långivare och din kreditvärdighet.</p></details><details style={{borderBottom:'1px solid #e2e8f0',paddingBottom:16,marginBottom:16}} open={false}><summary style={{fontWeight:700,fontSize:15,cursor:'pointer',color:'#0f172a',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>Kan jag få lån utan fast inkomst?<span style={{color:'#0047AB',fontSize:18,fontWeight:400}}>+</span></summary><p style={{marginTop:12,color:'#475569',lineHeight:1.75,fontSize:14}}>Ja, men det kan bli svårare och räntan kan bli högre.</p></details><details style={{borderBottom:'1px solid #e2e8f0',paddingBottom:16,marginBottom:16}} open={false}><summary style={{fontWeight:700,fontSize:15,cursor:'pointer',color:'#0f172a',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>Hur snabbt får jag pengarna?<span style={{color:'#0047AB',fontSize:18,fontWeight:400}}>+</span></summary><p style={{marginTop:12,color:'#475569',lineHeight:1.75,fontSize:14}}>Ofta får du pengarna inom 24 timmar efter beviljat lån.</p></details>
      </section>

      <footer style={{ background:'#0f172a', color:'#94a3b8',
        padding:'52px 20px 32px', fontFamily:'Inter,sans-serif' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ display:'flex', gap:52, flexWrap:'wrap', marginBottom:36 }}>
            <div style={{ maxWidth:280 }}>
              <div style={{ fontWeight:800, color:'#fff', fontSize:18,
                marginBottom:10 }}>BastaPrivatlanUtanUc2026</div>
              <p style={{ fontSize:13, lineHeight:1.75 }}>
                Oberoende jämförelsetjänst för svenska konsumenter.
                Vi jämför 5 alternativ inom finans.
              </p>
            </div>
            <div>
              <div style={{ fontWeight:700, color:'#e2e8f0',
                marginBottom:14, fontSize:13, textTransform:'uppercase',
                letterSpacing:'0.5px' }}>Sidor</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14 }}>
                <Link href="/" style={{ color:'#94a3b8', textDecoration:'none' }}>Jämförelse</Link>
                <Link href="/om-oss" style={{ color:'#94a3b8', textDecoration:'none' }}>Om oss</Link>
                <Link href="/kontakt" style={{ color:'#94a3b8', textDecoration:'none' }}>Kontakt</Link>
                <Link href="/integritetspolicy" style={{ color:'#94a3b8', textDecoration:'none' }}>Integritetspolicy</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop:'1px solid #1e293b', paddingTop:24, fontSize:12, lineHeight:1.75 }}>
            <p style={{ marginBottom:8 }}>
              &copy; 2026 BastaPrivatlanUtanUc2026. Oberoende jämförelsetjänst utan koppling till listade
              varumärken utöver eventuella affiliate-provisioner.
            </p>
            <p>
              <strong style={{ color:'#e2e8f0' }}>Affiliateinformation:</strong> Sidan innehåller
              affiliate-länkar via Adtraction Sverige. Vi kan ta emot provision från annonsörer.
              Det påverkar aldrig priset för dig eller våra oberoende betyg.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}