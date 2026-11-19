HEAD^:next-chapter/first-week.jsx
import React, {useState} from 'react';

const places = [
  {id:'home', name:'Home', x:2, y:1},
  {id:'cafe', name:'Café', x:0, y:1},
  {id:'warehouse', name:'Warehouse', x:4, y:0},
  {id:'grocery', name:'Grocery store', x:4, y:3},
  {id:'thrift', name:'Thrift shop', x:0, y:3},
];
const jobs = {
  cafe:{name:'Café', pay:288, commute:0, description:'Four shifts. Walk to work for free.'},
  warehouse:{name:'Warehouse', pay:384, commute:48, description:'Four early shifts. Set aside $48 for rides before the bus starts running.'},
};
const furniture = [
  {id:'bed', name:'Bed and mattress', price:150, icon:'🛏️'},
  {id:'desk', name:'Used desk', price:35, icon:'🪑'},
  {id:'lamp', name:'Reading lamp', price:20, icon:'💡'},
];
const keys = {
  ArrowUp:[0,-1], w:[0,-1], ArrowDown:[0,1], s:[0,1],
  ArrowLeft:[-1,0], a:[-1,0], ArrowRight:[1,0], d:[1,0],
};
const initial = () => ({cash:500, position:places[0], place:'home', job:null, groceries:0, shifts:0, paid:false, owned:[], color:'sage', done:false});
const dollars = n => '$'+n.toLocaleString('en-US');

export default function FirstWeek({exit}) {
  const [week,setWeek] = useState(initial);
  const [previous,setPrevious] = useState(null);
  const [feedback,setFeedback] = useState(false);
  const [sent,setSent] = useState(false);
  const [savedLocally,setSavedLocally] = useState(false);
  const feedbackUrl = new URLSearchParams(location.search).get('feedback');
  let formLink;
  try {
    const url = new URL(feedbackUrl);
    if (url.protocol==='https:' && (url.hostname==='forms.gle' || (url.hostname==='docs.google.com' && url.pathname.startsWith('/forms/')))) formLink=url.href;
  } catch {}
  const target = places.find(place=>place.x===week.position.x && place.y===week.position.y);
  const job = jobs[week.job];
  const objective = !job?'Visit the café or warehouse to accept a job.'
    : !week.groceries?'Buy a week of food at the grocery store.'
    : !week.paid?'Go to '+job.name+' and finish your shifts.'
    : 'Furnish your room or head home to finish the week.';

  function move([dx,dy]) {
    setWeek(w=>({...w, place:null, position:{x:Math.min(4,Math.max(0,w.position.x+dx)),y:Math.min(3,Math.max(0,w.position.y+dy))}}));
  }

  function enter() {
    if (target) setWeek(w=>({...w,place:target.id}));
  }

  function mapKey(event) {
    if (event.target!==event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase().length===1 ? event.key.toLowerCase() : event.key;
    if (Object.hasOwn(keys,key)) { event.preventDefault(); move(keys[key]); }
    if (key==='Enter') { event.preventDefault(); enter(); }
  }

  function shift() {
    setWeek(w=>{
      if (w.paid || !w.groceries || w.place!==w.job) return w;
      const shifts = w.shifts+1;
      const paid = shifts===4;
      return {...w, shifts, paid, cash:w.cash+(paid?jobs[w.job].pay:0)};
    });
  }

  function replay() {
    setPrevious({cash:week.cash, job:job.name});
    setWeek(initial());
    setFeedback(false);
    setSent(false);
    setSavedLocally(false);
  }

  function saveFeedback(event) {
    event.preventDefault();
    const answers=Object.fromEntries(new FormData(event.currentTarget));
    try {
      const key='nc-first-week-feedback-v1';
      const totals=JSON.parse(localStorage.getItem(key)||'{"clear":{"yes":0,"no":0},"replay":{"yes":0,"no":0},"comments":[]}');
      totals.clear[answers.clear]++;
      totals.replay[answers.replay]++;
      if (answers.change.trim()) totals.comments.push(answers.change.trim());
      localStorage.setItem(key,JSON.stringify(totals));
      setSavedLocally(true);
    } catch {}
    setSent(true);
    setFeedback(false);
  }

  return <main className="week-shell">
    <button className="text-button" onClick={exit}>← Next Chapter</button>
    <h1>First Week Challenge</h1>
    {week.done?<section className="paper week-recap">
      <h2>You made it to payday</h2>
      <p>{job.name} paid <strong>{dollars(job.pay)}</strong> after four shifts. You finished with <strong>{dollars(week.cash)}</strong>.</p>
      <p>Food {dollars(week.groceries)} · Commute {dollars(job.commute)} · Furniture {dollars(furniture.filter(item=>week.owned.includes(item.id)).reduce((sum,item)=>sum+item.price,0))}</p>
      {previous?<p>Last run: {previous.job}, {dollars(previous.cash)} left.</p>:null}
      <p>Next goal: A {dollars(1600)} move-in fund. {week.cash<1600?dollars(1600-week.cash)+' to go.':'Goal reached.'}</p>
      <div className="actions">
        <button className="btn" onClick={replay}>Play again</button>
        {formLink?<a className="btn secondary" href={formLink} target="_blank" rel="noopener noreferrer">Give feedback</a>
          : !sent&&!feedback?<button className="btn secondary" onClick={()=>setFeedback(true)}>Give feedback</button>:null}
      </div>
      {sent?<p role="status">{savedLocally?'Thanks. Your feedback was saved on this device.':'This browser could not save your feedback.'}</p>:null}
      {feedback?<form onSubmit={saveFeedback}>
        <h3>Quick feedback</h3>
        <p>Responses are stored on this device. Please leave names out.</p>
        {[['clear','Was it clear what to do first?'],['replay','Would you play another week?']].map(([name,label])=><fieldset key={name}>
          <legend>{label}</legend>
          {['yes','no'].map(value=><label key={value}><input type="radio" name={name} value={value} required/> {value==='yes'?'Yes':'No'}</label>)}
        </fieldset>)}
        <label htmlFor="week-change">What’s one thing you’d change? (Optional)</label>
        <textarea id="week-change" name="change" maxLength={300}/>
        <div className="actions"><button className="btn">Submit feedback</button><button className="btn secondary" type="button" onClick={()=>setFeedback(false)}>Skip survey</button></div>
      </form>:null}
    </section>:<>
      <div className="week-status"><strong>{dollars(week.cash)} available</strong><span>Shifts {week.shifts} / 4</span><span>{week.groceries?'Food stocked':'Food needed'}</span></div>
      <p className="lead" role="status">{objective}</p>
      <div className="week-layout">
        <section className="paper">
          <h2>Town</h2>
          <p id="week-help">Use WASD, arrow keys, or the movement buttons. Enter when you reach a building.</p>
          <div className="week-map" tabIndex={0} role="region" aria-label="Town map" aria-describedby="week-help" onKeyDown={mapKey}>
            {places.map(place=><span key={place.id} className="week-place" style={{gridColumn:place.x+1,gridRow:place.y+1}}>{place.name}</span>)}
            <span className="week-player" aria-hidden="true" style={{gridColumn:week.position.x+1,gridRow:week.position.y+1}}>●</span>
          </div>
          <div className="week-directions" role="group" aria-label="Move around town">
            {[['ArrowLeft','←','left'],['ArrowUp','↑','up'],['ArrowDown','↓','down'],['ArrowRight','→','right']].map(([key,arrow,label])=>
              <button className="btn secondary" key={key} aria-label={'Move '+label} onClick={()=>move(keys[key])}>{arrow}</button>)}
          </div>
          <button className="btn" disabled={!target} onClick={enter}>{target?'Enter '+target.name:'Walk to a building'}</button>
        </section>
        <section className="paper week-visit" aria-label="Current location">
          <h2>{places.find(place=>place.id===week.place)?.name||'On the way'}</h2>
          {week.place==='home'?<>
            <p>You’re staying with family this week. Save toward a place of your own or make this room yours.</p>
            <div className={'week-room '+week.color} aria-label="Your furnished room">
              {week.owned.length?furniture.filter(item=>week.owned.includes(item.id)).map(item=><span key={item.id} role="img" aria-label={item.name}>{item.icon}</span>):<span>Your room is empty.</span>}
            </div>
            <label>Wall color <select value={week.color} onChange={e=>setWeek({...week,color:e.target.value})}><option value="sage">Sage</option><option value="blue">Sky blue</option><option value="peach">Peach</option></select></label>
            {week.paid?<div className="actions"><button className="btn" onClick={()=>setWeek({...week,done:true})}>Finish week</button></div>:null}
          </>:null}
          {jobs[week.place]?<>
            <p>{jobs[week.place].description} Take-home pay on Friday: {dollars(jobs[week.place].pay)}.</p>
            {!job?<button className="btn" onClick={()=>setWeek(w=>w.job?w:{...w,job:w.place,cash:w.cash-jobs[w.place].commute})}>Accept job</button>
              : week.job!==week.place?<p>You already accepted the {job.name} job.</p>
              : !week.groceries?<p>Stock up on food before your first shift.</p>
              : week.paid?<p role="status">Payday! You earned {dollars(job.pay)}.</p>
              : <button className="btn" onClick={shift}>Work shift {week.shifts+1}</button>}
          </>:null}
          {week.place==='grocery'?week.groceries?<p>Your food is covered for the week.</p>:<>
            <p>Choose food for the week.</p>
            {[80,120].map(price=><button className="btn secondary" key={price} disabled={week.cash<price} onClick={()=>setWeek(w=>w.groceries||w.cash<price?w:{...w,cash:w.cash-price,groceries:price})}>{price===80?'Cook at home':'Prepared meals'} · {dollars(price)}</button>)}
          </>:null}
          {week.place==='thrift'?<>
            <p>Take a look at what’s available for your room.</p>
            {furniture.map(item=><button className="btn secondary" key={item.id} disabled={week.owned.includes(item.id)||week.cash-item.price<(week.groceries?0:80)+(week.job?0:48)}
              onClick={()=>setWeek(w=>({...w,cash:w.cash-item.price,owned:[...w.owned,item.id]}))}>
              {item.name} · {week.owned.includes(item.id)?'Owned':dollars(item.price)}
            </button>)}
            <p>Keep enough cash for food and travel until they’re covered.</p>
          </>:null}
          {!week.place?<p>{target?'You’re at '+target.name+'. Enter to go inside.':'Follow the map to your next stop.'}</p>:null}
        </section>
      </div>
    </>}
  </main>;
}
