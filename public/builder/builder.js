const slots=[
  { key:'subject', words:['I','You','Uriah','Liron','We'] },
  { key:'verb',    words:['love','cook','train','write','learn'] },
  { key:'object',  words:['pizza','coffee','printers','sports','code'] }
];

const chosen={};
const histories=new Map();
const scroller=document.getElementById('scroller');

// === NEW: מביא הצעות מה-API, עם fallback ל-words המקומי ===
async function getSuggestionsForSlot(key, contextText){
  try {
    const qs = new URLSearchParams({ slot: key, q: contextText || '' });
    const res = await fetch(`/api/generate?${qs.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Bad response');
    const data = await res.json();
    if (Array.isArray(data.words) && data.words.length) return data.words;
  } catch (e) {
    console.warn('getSuggestionsForSlot fallback:', e.message);
  }
  return null; // מסמן שלא קיבלנו API ונשתמש ב-local
}

function btn(cls,text,fn){ const b=document.createElement('button'); b.className='actionBtn '+cls; b.textContent=text; b.onclick=fn; return b; }

function createSlot(slot,index){
  const wrap=document.createElement('section'); wrap.className='slot'; wrap.dataset.index=index;
  const card=document.createElement('div'); card.className='card';

  // נציג placeholder עד שנטעין הצעות
  const word=document.createElement('div'); word.className='word'; word.textContent=slot.words[0] || '…';

  const actions=document.createElement('div'); actions.className='actions';
  const like=btn('like','✓',()=> setSelection(slot,wrap,word.textContent));
  const edit=btn('edit','✎',()=> openEditor(slot,wrap,word));
  const dislike=btn('dislike','✕',()=> changeWord(slot,wrap,1,word));
  const undo=btn('undo','↺',()=> undoLast(slot,wrap,word));
  actions.append(like,edit,dislike,undo);

  card.append(word,actions);
  wrap.append(card);
  histories.set(slot.key,[0]);

  // === NEW: נטעין הצעות מה-API אחרי יצירת הכרטיס, ונעדכן מילים ===
  initSlotSuggestions(slot, wrap, word);

  return wrap;
}

// === NEW: טוען הצעות מהשרת ומעדכן את המילים של הסלוט ===
async function initSlotSuggestions(slot, wrap, wordEl){
  // נבנה הקשר בסיסי ממשפט חלקי שכבר נבחר
  const contextText = buildSentence(); // [..., ..., ...] בתחילת הדרך זה בסדר
  const remoteWords = await getSuggestionsForSlot(slot.key, contextText);
  if (remoteWords && remoteWords.length){
    slot.words = remoteWords;
    // נעדכן את המילה הראשונה והיסטוריה
    wordEl.textContent = slot.words[0];
    histories.set(slot.key,[0]);
  }
}

function setSelection(slot,wrap,text){
  chosen[slot.key]=text;
  wrap.querySelector('.actions').style.display='none';
  const idx=Number(wrap.dataset.index);
  const next=idx+1;
  if(next<slots.length){
    renderUpTo(next);
    centerOnIndex(next);
  } else { openPreview(); }
}
function changeWord(slot,wrap,delta,wordEl){
  if(!slot.words || !slot.words.length) return; // הגנה אם טרם נטען
  const idx=slot.words.indexOf(wordEl.textContent);
  const next=(idx+delta+slot.words.length)%slot.words.length;
  wordEl.textContent=slot.words[next];
  pushHistory(slot.key,next);
}
function undoLast(slot,wrap,wordEl){
  const stack=histories.get(slot.key)||[];
  if(stack.length<=1)return;
  stack.pop();
  const prev=stack[stack.length-1];
  wordEl.textContent=slot.words[prev];
}
function pushHistory(key,i){ const s=histories.get(key)||[]; s.push(i); histories.set(key,s); }
function openEditor(slot,wrap,wordEl){
  const newText=prompt('Edit word:', wordEl.textContent);
  if(newText){ slot.words.push(newText); wordEl.textContent=newText; pushHistory(slot.key,slot.words.length-1); setSelection(slot,wrap,newText); }
}
function renderUpTo(targetIndex){
  for(let i=scroller.children.length;i<=targetIndex && i<slots.length;i++){
    scroller.appendChild(createSlot(slots[i],i));
  }
}
function centerOnIndex(i){
  const el=document.querySelector(`.slot[data-index="${i}"]`);
  if(!el)return;
  const top=el.offsetTop - (scroller.clientHeight/2 - el.clientHeight/2);
  scroller.scrollTo({top,behavior:'smooth'});
}
function buildSentence(){ return slots.map(s=>chosen[s.key]||'[...]').join(' '); }
function openPreview(){
  const el = document.getElementById('previewSentence');
  if (el) el.textContent=buildSentence();
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.add('open');
}
const closeBtn = document.getElementById('closePreview');
if (closeBtn) closeBtn.onclick=()=> {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('open');
};
const previewBtn = document.getElementById('previewBtn');
if (previewBtn) previewBtn.onclick=openPreview;

// התחל
renderUpTo(0);
