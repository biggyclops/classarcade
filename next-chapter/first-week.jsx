import React, {useState} from 'react';

const places = [
  {id:'home', name:'Home', x:2, y:1, mapX:54, mapY:23},
  {id:'cafe', name:'Café', x:0, y:1, mapX:13, mapY:73},
  {id:'warehouse', name:'Warehouse', x:4, y:0, mapX:18, mapY:24},
  {id:'grocery', name:'Grocery store', x:4, y:3, mapX:52, mapY:73},
  {id:'thrift', name:'Thrift shop', x:0, y:3, mapX:85, mapY:78},
];
const baseJobs = {
  cafe:{name:'Café', pay:288, commute:0, description:'Four shifts. Walk to work for free.'},
  warehouse:{name:'Warehouse', pay:384, commute:48, description:'Four early shifts. Set aside money for rides before the bus starts running.'},
};
const baseFurniture = [
  {id:'bed', name:'Bed and mattress', price:150},
  {id:'desk', name:'Used desk', price:35},
  {id:'lamp', name:'Reading lamp', price:20},
];
const foodOptions = [
  {id:'groceries', name:'Cook at home', description:'Produce and beans for home cooking'},
  {id:'prepared-meals', name:'Prepared meals', description:'Ready-to-heat entrées'},
];
function itemPhoto(id) {
  return new URL(`./items/${id}.webp?v=2`, import.meta.url).href;
}

const shareAlike = ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'];
const photoCredits = [
  ['Grocery bag of healthy foods.jpg', 'Bill Branson / National Cancer Institute', 'U.S. public domain', 'https://creativecommons.org/publicdomain/mark/1.0/'],
  ['Chicken Dinner.jpg', 'Kefeizheng01', ...shareAlike],
  ['Bed.jpg', 'Gausanchennai', ...shareAlike],
  ['Full view of desk.jpg', 'Nono cocon', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/'],
  ['Desktop-lamp-2 hg.jpg', 'Hannes Grobe', ...shareAlike],
];

function PhotoCredits() {
  return <details className="week-photo-credits">
    <summary>Item photo credits</summary>
    <ul>{photoCredits.map(([title, author, license, licenseUrl])=><li key={title}>
      <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replaceAll(' ', '_'))}`} target="_blank" rel="noreferrer">{title}</a>
      {' by '}{author}{' · '}<a href={licenseUrl} target="_blank" rel="noreferrer">{license}</a>
    </li>)}</ul>
    <p>Photos were resized and converted to WebP. Furniture photos were also cropped and their backgrounds removed.</p>
  </details>;
}

function ShopItem({item, children}) {
  return <article className="week-shop-item">
    <img src={itemPhoto(item.id)} alt="" width="240" height="170" />
    <div>
      {item.description?<p>{item.description}</p>:null}
      {children}
    </div>
  </article>;
}

const goalIcons = {move:'🔑', car:'🚗', training:'🎓'};
const startingSituations = [
  {cash:500, name:'Fresh start with family'},
  {cash:380, name:'Helping with family bills'},
  {cash:650, name:'Summer savings'},
];
function workTask(job, offset, week) {
  const shift = ((week-1)%3)+offset;
  const first = 6+shift;
  const second = 9+shift;
  const crates = 4+shift;
  const shelves = 3;
  const answer = job==='cafe'?first+second:crates*shelves;
  const prompt = job==='cafe'
    ? `Two café orders are $${first} and $${second}. What total goes on the receipt?`
    : `A shelf holds ${crates} cartons. There are ${shelves} shelves. How many cartons do you need?`;
  const choices = [answer-2,answer,answer+2];
  const rotation = (week+offset+3)%choices.length;
  return {prompt, answer, choices:choices.slice(rotation).concat(choices.slice(0,rotation))};
}
const unlocks = {
  move:[
    {id:'mill',name:'Mill District loft',cost:1600,weekly:145,detail:'Walk to town from the old brick mill.'},
    {id:'river',name:'Riverside two-bedroom',cost:1740,weekly:125,detail:'More cash upfront, lower weekly rent.'},
  ],
  car:[{id:'compact',name:'Used compact car',cost:2400,weekly:24,detail:'Drive to the warehouse. Budget $24 each week for fuel and maintenance.'}],
  training:[{id:'course',name:'Career training course',cost:750,weekly:0,detail:'Completing the course unlocks a $45 weekly raise starting next week.'}],
};
function playCue(kind) {
  try {
    const context = new AudioContext();
    const notes = kind==='payday'?[392,523,659]:[165,196];
    notes.forEach((frequency,index)=>{
      const tone=context.createOscillator();
      const volume=context.createGain();
      const start=context.currentTime+index*.11;
      tone.frequency.value=frequency;
      volume.gain.setValueAtTime(.045,start);
      volume.gain.exponentialRampToValueAtTime(.001,start+.13);
      tone.connect(volume).connect(context.destination);
      tone.start(start);
      tone.stop(start+.14);
      if(index===notes.length-1) tone.onended=()=>void context.close();
    });
  } catch {}
}
const goals = [
  {id:'move', name:'Move out with a friend', cost:1600},
  {id:'car', name:'Save for a used car', cost:2400},
  {id:'training', name:'Pay for career training', cost:750},
];
const keys = {
  ArrowUp:[0,-1], w:[0,-1], ArrowDown:[0,1], s:[0,1],
  ArrowLeft:[-1,0], a:[-1,0], ArrowRight:[1,0], d:[1,0],
};
function initial(previous, situationIndex=0) {
  const variants = [-2,-1,0,1,2].filter(value=>value!==previous);
  const priceOffset = variants[Math.floor(Math.random()*variants.length)];
  return {priceOffset,situationIndex,cash:startingSituations[situationIndex].cash,position:places[0],place:'home',job:null,groceries:0,
    number:1,paid:false,extra:null,owned:[],layout:{},taskDone:false,taskBonus:0,event:null,eventMinutes:0,social:null,hangouts:0,roommate:false,purchase:null,commutePaid:0,rentPaid:0,furnitureSpend:0,color:'sage',goal:null,done:false};
}
const dollars = n => '$'+n.toLocaleString('en-US');

export default function FirstWeek({exit}) {
  const [week,setWeek] = useState(initial);
  const [sound,setSound] = useState(false);
  const [tour,setTour] = useState(null);
  const [taskNote,setTaskNote] = useState('');
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
  const offset = week.priceOffset;
  const jobs = {
    cafe:{...baseJobs.cafe,pay:baseJobs.cafe.pay+offset*8+(week.purchase?.id==='course'?45:0)},
    warehouse:{...baseJobs.warehouse,pay:baseJobs.warehouse.pay+offset*8+(week.purchase?.id==='course'?45:0),
      commute:baseJobs.warehouse.commute+offset*4},
  };
  const furniture = baseFurniture.map(item=>({...item,price:item.price+offset*5}));
  const food = [80+offset*5,120+offset*5];
  const job = jobs[week.job];
  const objective = !job?'Compare the job offers and pick your first job.'
    : week.number>=2&&!week.goal?'Pick what you want to save for back at home.'
    : !week.groceries?'Buy a week of food at the grocery store.'
    : !week.paid&&week.number>1&&!week.event?'Handle this week’s transportation or errand change at home.'
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

  const extraPay = job ? Math.round(job.pay / 4) - Math.round(week.commutePaid / 4) : 0;
  const goal = goals.find(option=>option.id===week.goal);
  const savingsTarget = goal || {id:'move',name:'Move-in fund',cost:1600};
  const goalOptions = (unlocks[savingsTarget.id] || []).map(option=>({
    ...option,cost:option.cost-(savingsTarget.id==='move'&&week.roommate?300:0),
  }));
  const targetCost = goalOptions[0]?.cost ?? savingsTarget.cost;
  const savingsProgress = week.purchase ? targetCost : Math.min(week.cash,targetCost);
  const nextCommute = week.purchase?.id==='compact'?24:(job?.commute ?? 0);
  const nextRent = week.purchase?.id==='mill'||week.purchase?.id==='river'?week.purchase.weekly:0;
  const projectedCash = Math.max(0,week.cash+ (job?.pay ?? 0)-nextCommute-nextRent-food[0]);
  const receiptPay = week.paid ? week.receiptPay : job?.pay;
  const task = workTask(week.job,offset,week.number);
  function purchaseReserve(option) {
    const commute = option.id==='compact'?option.weekly:nextCommute;
    const rent = ['mill','river'].includes(option.id)?option.weekly:nextRent;
    return commute+rent+food[0];
  }
  const correctTask = answer=>{
    if (answer!==task.answer) {
      setTaskNote('Try again. Work it out from the amounts above.');
      return;
    }
    setTaskNote('');
    setWeek(w=>w.taskDone?w:{...w,taskDone:true,taskBonus:15,cash:w.cash+15});
  };
  const remaining = targetCost-savingsProgress;

  function travel(place) {
    if(sound&&place.id!==week.place) playCue('town');
    setWeek(w=>({...w,position:place,place:place.id}));
  }

  function acceptJob(id) {
    setWeek(w=>w.job?w:{...w,job:id,cash:w.cash-jobs[id].commute,commutePaid:jobs[id].commute});
  }

  function finishShifts(extra) {
    setWeek(w=>{
      if (w.paid || !w.groceries || !w.taskDone || w.place!==w.job || (w.number>=2&&(!w.goal||!w.event))) return w;
      return {...w,paid:true,extra,receiptPay:jobs[w.job].pay,receiptExtra:extra?extraPay:0,cash:w.cash+jobs[w.job].pay+(extra?extraPay:0)};
    });
  }

  function buyGoal(option) {
    setWeek(w=>w.purchase||!w.done||w.cash<option.cost+purchaseReserve(option)?w:{
      ...w,purchase:option,purchaseWeek:w.number,cash:w.cash-option.cost,
    });
  }

  function chooseEvent(choice) {
    const cost=choice==='backup'?12:0;
    setWeek(w=>w.event||w.cash-cost<(w.groceries?0:food[0])?w:{
      ...w,event:choice,eventCost:cost,eventMinutes:choice==='backup'?15:45,cash:w.cash-cost,
    });
  }

  function chooseFriday(choice) {
    const cost=choice==='hangout'?12:0;
    setWeek(w=>w.extra!==false||w.social||w.cash<cost?w:{
      ...w,social:choice,cash:w.cash-cost,hangouts:w.hangouts+(choice==='hangout'?1:0),
    });
  }

  function continueWeek() {
    setWeek(w=>({
      ...w,number:w.number+1,done:false,paid:false,extra:null,groceries:0,furnitureSpend:0,
      taskDone:false,taskBonus:0,event:null,eventCost:0,eventMinutes:0,social:null,commutePaid:nextCommute,rentPaid:nextRent,
      cash:w.cash-nextCommute-nextRent,position:places[0],place:'home',
    }));
  }

  function replay() {
    setPrevious({cash:week.cash, job:job.name});
    setWeek(initial(week.priceOffset,(week.situationIndex+1)%startingSituations.length));
    setTour(null);
    setTaskNote('');
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
    <h1>{week.number===1?'First Week Challenge':`Week ${week.number} · Your next goal`}</h1>
    <label className="week-audio"><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/> Town sounds and payday chime</label>
    {week.done?<section className="paper week-recap">
      <h2>You made it to payday</h2>
      <div className="week-pay-stub">
        <div><strong>{job.name} pay stub</strong><span>Week {week.number} · Four regular shifts</span></div>
        <dl>
          <dt>Regular pay</dt><dd>{dollars(receiptPay)}</dd>
          {week.extra?<><dt>Extra shift after travel</dt><dd>{dollars(week.receiptExtra)}</dd></>:null}
          <dt>Food</dt><dd>−{dollars(week.groceries)}</dd>
          <dt>Commute</dt><dd>−{dollars(week.commutePaid)}</dd>
          {week.rentPaid?<><dt>Rent</dt><dd>−{dollars(week.rentPaid)}</dd></>:null}
          {week.taskBonus?<><dt>Work task bonus</dt><dd>{dollars(week.taskBonus)}</dd></>:null}
          {week.eventCost?<><dt>Backup travel</dt><dd>−{dollars(week.eventCost)}</dd></>:null}
          {week.social==='hangout'?<><dt>Friday with Jordan</dt><dd>−$12</dd></>:null}
          <dt>Furniture</dt><dd>−{dollars(week.furnitureSpend)}</dd>
          <dt>Cash at payday</dt><dd>{dollars(week.cash+(week.purchaseWeek===week.number?week.purchase.cost:0))}</dd>
        </dl>
      </div>
      {previous?<p>Last run: {previous.job}, {dollars(previous.cash)} left.</p>:null}
      <section className="week-savings">
        <h3><span aria-hidden="true">{goalIcons[savingsTarget.id]}</span> {savingsTarget.name}</h3>
        <div className="week-progress" role="progressbar" aria-label={savingsTarget.name}
          aria-valuenow={savingsProgress} aria-valuemax={targetCost}>
          <span style={{width:(100*savingsProgress/targetCost)+'%'}}/>
        </div>
        <p>{dollars(savingsProgress)} of {dollars(targetCost)} · {remaining?dollars(remaining)+' to go':'Goal reached!'}</p>
        {!goal?<p>Keep your cash and furniture and choose your own goal in Week 2.</p>:null}
        {goal&&!week.purchase?<div className="week-unlocks">
          <p>Available now: <strong>{dollars(week.cash)}</strong> · After one more regular payday: <strong>{dollars(projectedCash)}</strong> (after basic bills).</p>
          {goalOptions.map(option=><article key={option.id} className="week-unlock">
            <span aria-hidden="true">{goalIcons[goal.id]}</span><strong>{option.name} · {dollars(option.cost)}</strong>
            <button className="btn secondary" onClick={()=>setTour(tour===option.id?null:option.id)}
              aria-expanded={tour===option.id}>{tour===option.id?'Close preview':goal.id==='move'?'Tour apartment':'Preview purchase'}</button>
            {tour===option.id?<div className={`week-tour week-tour--${option.id}`}>
              <div className="week-tour-art" aria-hidden="true">{goalIcons[goal.id]}</div>
              <p>{option.detail}</p><p>{option.weekly?dollars(option.weekly)+' per week. ':''}Keep {dollars(purchaseReserve(option))} for next week’s basic bills.</p>
            </div>:null}
            <button className="btn" disabled={week.cash<option.cost+purchaseReserve(option)} onClick={()=>buyGoal(option)}>
              {week.cash<option.cost+purchaseReserve(option)?dollars(option.cost+purchaseReserve(option)-week.cash)+' more with bill reserve':'Unlock '+option.name}
            </button>
          </article>)}
        </div>:null}
        {week.purchase?<p role="status"><strong>Unlocked {week.purchase.name}.</strong> {week.purchase.detail} Cash left: {dollars(week.cash)}.</p>:null}
      </section>
      {week.eventMinutes?<p>This week’s detour took {week.eventMinutes} minutes.</p>:null}
      {week.social==='hangout'?<p>You spent Friday with Jordan. Hangouts so far: {week.hangouts}.</p>
        :week.extra===false?<p>You kept Friday night free.</p>:null}
      <div className="actions">
        <button className="btn" onClick={continueWeek} disabled={week.cash<nextCommute+nextRent+food[0]}>Continue to Week {week.number+1}</button>
        <button className="btn secondary" onClick={replay}>Play again with a new start</button>
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
      <div className="week-status"><strong>{dollars(week.cash)} available</strong><span>{week.paid?'Payday complete':'Payday pending'}</span><span>{week.groceries?'Food stocked':'Food needed'}</span></div>
      <p className="week-objective" role="status"><strong>Next:</strong> {objective} <small>{startingSituations[week.situationIndex].name}</small></p>
      {!job?<section className="week-job-offers" aria-label="Compare job offers">
        {Object.entries(jobs).map(([id,offer])=><article key={id} className="paper">
          <div className={`week-job-art week-job-art--${id}`} aria-hidden="true" />
          <h2>{offer.name}</h2>
          <p>{id==='cafe'?'3–7 p.m. · Walk':'5–9 a.m. · Rides'}</p>
          <p>Take-home pay {dollars(offer.pay)} · Commute {dollars(offer.commute)}</p>
          <p><strong>{dollars(offer.pay-offer.commute)} after commute</strong></p>
          <button className="btn" onClick={()=>acceptJob(id)}>Choose {offer.name}</button>
        </article>)}
      </section>:null}
      <div className="week-layout">
        <section className="paper">
          <h2>Town</h2>
          <p id="week-help">Click a building to visit it, or move with WASD or the arrow keys and press Enter.</p>
          <div className="week-map" tabIndex={0} role="region" aria-label="Town map" aria-describedby="week-help" onKeyDown={mapKey}>
            {places.map(place=><button type="button" key={place.id} className="week-place" aria-label={`Visit ${place.name}`} onClick={()=>travel(place)} style={{left:place.mapX+'%',top:place.mapY+'%'}}><span aria-hidden="true">{{home:'⌂',cafe:'☕',warehouse:'▦',grocery:'🛒',thrift:'🏷'}[place.id]}</span> {place.name}</button>)}
            <span className="week-player" aria-hidden="true" style={{left:(target?.mapX ?? (12+week.position.x*19))+'%',
              top:(target?.mapY ?? (23+week.position.y*18))+'%'}}><span key={week.position.x+':'+week.position.y}>🚶</span></span>
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
            {week.number>=2&&!week.purchase?<fieldset className="week-goals">
              <legend>What are you saving for?</legend>
              {goals.map(option=><label key={option.id}>
                <input type="radio" name="week-goal" checked={week.goal===option.id}
                  onChange={()=>setWeek(w=>({...w,goal:option.id}))}/>
                {option.name} · {dollars(option.cost)}
              </label>)}
            </fieldset>:null}
            {week.number>1&&!week.event?<div className="week-event">
              <strong>{week.number%2===0?'A ride fell through':'Jordan needs a hand moving'}</strong>
              <p>{week.number%2===0?'Pay for a backup ride or take the longer route and keep your cash.':'Help Jordan for free, or pay $12 to split a ride and get back sooner.'}</p>
              <button className="btn secondary" onClick={()=>chooseEvent('free')}>{week.number%2===0?'Take the longer route':'Help Jordan move'}</button>
              <button className="btn secondary" disabled={week.cash<(week.groceries?0:food[0])+12} onClick={()=>chooseEvent('backup')}>Split a ride · $12</button>
            </div>:null}
            {week.goal==='move'&&!week.purchase?<label className="week-roommate">
              <input type="checkbox" checked={week.roommate} onChange={e=>setWeek(w=>({...w,roommate:e.target.checked}))}/>
              Save with Jordan. Jordan covers $300 of the move-in cost.
            </label>:null}
            <p>{nextRent?'You’ve moved into your new apartment.':'You’re staying with family while you build toward your next goal.'}</p>
            <div className={'week-room '+week.color} role="group" aria-label="Your furnished room">
              {week.owned.length?furniture.filter(item=>week.owned.includes(item.id)).map(item=><img key={item.id} className={`week-furniture week-furniture--${item.id}${week.layout[item.id]==='alternate'?' alternate':''}`} src={itemPhoto(item.id)} alt={item.name}/>):<span className="week-room-empty">Your room is empty</span>}
            </div>
            {week.owned.map(id=><label key={id} className="week-placement">{furniture.find(item=>item.id===id).name} placement
              <select value={week.layout[id]||'original'} onChange={e=>setWeek(w=>({...w,layout:{...w.layout,[id]:e.target.value}}))}>
                <option value="original">Original spot</option><option value="alternate">Move to other side</option>
              </select>
            </label>)}
            <label>Wall color <select value={week.color} onChange={e=>setWeek({...week,color:e.target.value})}><option value="sage">Sage</option><option value="blue">Sky blue</option><option value="peach">Peach</option></select></label>
            {week.paid&&week.extra===false&&!week.social?<div className="week-event">
              <strong>Friday night is free</strong>
              <p>Jordan invites you out. Spend $12 together, or stay in and keep saving.</p>
              <button className="btn secondary" onClick={()=>chooseFriday('hangout')} disabled={week.cash<12}>Hang out with Jordan · $12</button>
              <button className="btn secondary" onClick={()=>chooseFriday('save')}>Stay in and save</button>
            </div>:null}
            {week.paid?<div className="actions"><button className="btn" onClick={()=>{if(sound)playCue('payday');setWeek(w=>({...w,done:true}))}}>Finish week</button></div>:null}
          </>:null}
          {jobs[week.place]?<>
            <div className={`week-interior week-interior--${week.place}`} aria-hidden="true" />
            <p>{jobs[week.place].description} Take-home pay on Friday: {dollars(jobs[week.place].pay)}. Commute for the week: {dollars(jobs[week.place].commute)}.</p>
            {!job?<button className="btn" onClick={()=>acceptJob(week.place)}>Accept job</button>
              : week.job!==week.place?<p>You already accepted the {job.name} job.</p>
              : !week.groceries?<p>Stock up on food before your first shift.</p>
              : week.paid?<p role="status">Payday! You earned {dollars(job.pay)}.</p>
              : week.number===2&&!goal?<p>Choose a savings goal at home first.</p>
              : week.number>1&&!week.event?<p>Handle this week’s change at home before work.</p>
              : !week.taskDone?<div className="week-event">
                  <strong>{week.job==='cafe'?'Ring up the order':'Stock the shipment'}</strong>
                  <p>{task.prompt} Earn a $15 bonus for the correct answer.</p>
                  {task.choices.map(answer=><button className="btn secondary" key={answer}
                    onClick={()=>correctTask(answer)}>{answer}</button>)}
                  {taskNote?<p role="status">{taskNote}</p>:null}
                </div>
              : <div className="week-work-choice">
                  <p>Your manager offers a Friday evening shift. Is the extra money worth giving up your evening?</p>
                  <button className="btn" onClick={()=>finishShifts(true)}>Take extra shift · +{dollars(extraPay)} after travel</button>
                  <button className="btn secondary" onClick={()=>finishShifts(false)}>Work regular shifts only</button>
                </div>}
          </>:null}
          {week.place==='grocery'?week.groceries?<p>Your food is covered for the week.</p>:<>
            <p>Choose food for the week.</p>
            <div className="week-shop-items">
              {foodOptions.map((item,index)=><ShopItem key={item.id} item={item}>
                <button className="btn secondary" disabled={week.cash<food[index]}
                  onClick={()=>setWeek(w=>w.groceries||w.cash<food[index]?w:{...w,cash:w.cash-food[index],groceries:food[index]})}>
                  {item.name} · {dollars(food[index])}
                </button>
              </ShopItem>)}
            </div>
          </>:null}
          {week.place==='thrift'?<>
            <p>Take a look at what’s available for your room.</p>
            <div className="week-shop-items">
              {furniture.map(item=><ShopItem key={item.id} item={item}>
                <button className="btn secondary" disabled={week.owned.includes(item.id)||week.cash-item.price<(week.groceries?0:food[0])+(week.job?0:jobs.warehouse.commute)}
                  onClick={()=>setWeek(w=>({...w,cash:w.cash-item.price,furnitureSpend:w.furnitureSpend+item.price,owned:[...w.owned,item.id]}))}>
                  {item.name} · {week.owned.includes(item.id)?'Owned':dollars(item.price)}
                </button>
              </ShopItem>)}
            </div>
            <p>Keep enough cash for food and travel until they’re covered.</p>
          </>:null}
          {!week.place?<p>{target?'You’re at '+target.name+'. Enter to go inside.':'Follow the map to your next stop.'}</p>:null}
        </section>
      </div>
    </>}
    <PhotoCredits />
  </main>;
}
