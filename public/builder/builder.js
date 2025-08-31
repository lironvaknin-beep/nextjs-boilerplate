const slots = [
  { key:'subject', words:['I','You','Uriah','Liron','We'] },
  { key:'verb',    words:['love','cook','train','write','learn'] },
  { key:'object',  words:['pizza','coffee','printers','sports','code'] }
];

const chosen = {};
const histories = new Map();
const scroller = document.getElementById('scroller');

function btn(cls, text, fn){
  const b = document.createElement('button');
  b.className = 'actionBtn ' + cls;
  b.textContent = text;
  b.onclick = fn;
  return b;
}

function createSlot(slot, index){
  const wrap = document.createElement('section');
  wrap.className = 'slot';
  wrap.dataset.index = index;

  const card = document.createElement('div');
  card.className = 'card';

  const word = document.createElement('div');
  word.className = 'word';
  word.textContent = slot.words[0] || '…';
  // מצב עריכה דיפולט: כבוי
  word.setAttribute('contenteditable', 'false');

  const actions = document.createElement('div');
  actions.className = 'actions';

  // כפתורי מצב רגיל
  const like    = btn('like','✓',    ()=> setSelection(slot, wrap, word.textContent));
  const edit    = btn('edit','✎',    ()=> startInlineEdit(slot, wrap, word, actions));
  const dislike = btn('dislike','✕', ()=> changeWord(slot, wrap, 1, word));
  const undo    = btn('undo','↺',    ()=> undoLast(slot, wrap, word));

  actions.append(like, edit, dislike, undo);

  card.append(word, actions);
  wrap.append(card);
  histories.set(slot.key, [0]);

  return wrap;
}

function setSelection(slot, wrap, text){
  chosen[slot.key] = text;
  wrap.querySelector('.actions').style.display = 'none';
  const idx  = Number(wrap.dataset.index);
  const next = idx + 1;
  if (next < slots.length) {
    renderUpTo(next);
    centerOnIndex(next);
  } else {
    openPreview();
  }
}

function changeWord(slot, wrap, delta, wordEl){
  if (!slot.words || !slot.words.length) return;
  const idx  = slot.words.indexOf(wordEl.textContent);
  const next = (idx + delta + slot.words.length) % slot.words.length;
  wordEl.textContent = slot.words[next];
  pushHistory(slot.key, next);
}

function undoLast(slot, wrap, wordEl){
  const stack = histories.get(slot.key) || [];
  if (stack.length <= 1) return;
  stack.pop();
  const prev = stack[stack.length - 1];
  wordEl.textContent = slot.words[prev];
}

function pushHistory(key, i){
  const s = histories.get(key) || [];
  s.push(i);
  histories.set(key, s);
}

/* ======== Inline Edit ======== */
function startInlineEdit(slot, wrap, wordEl, actionsEl){
  // נעבור למצב עריכה
  wordEl.setAttribute('contenteditable', 'true');
  wordEl.focus();
  placeCaretEnd(wordEl);

  // נחביא את כפתורי המצב הרגיל
  Array.from(actionsEl.children).forEach(ch => ch.style.display = 'none');

  // נוסיף כפתורי שמירה/ביטול
  const saveBtn   = btn('save','✓', ()=> saveInlineEdit(slot, wrap, wordEl, actionsEl, saveBtn, cancelBtn));
  const cancelBtn = btn('cancel','✕',()=> cancelInlineEdit(wordEl, actionsEl, saveBtn, cancelBtn));
  actionsEl.append(saveBtn, cancelBtn);

  // האזנה ל-Enter לשמירה (בלי שורה חדשה)
  const onKeyDown = (e)=>{
    if (e.key === 'Enter') {
      e.preventDefault();
      saveInlineEdit(slot, wrap, wordEl, actionsEl, saveBtn, cancelBtn);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelInlineEdit(wordEl, actionsEl, saveBtn, cancelBtn);
    }
  };
  wordEl.addEventListener('keydown', onKeyDown, { once: true });

  // אם המשתמש לחץ מחוץ למילה — נשמור אוטומטית
  const onBlur = ()=>{
    saveInlineEdit(slot, wrap, wordEl, actionsEl, saveBtn, cancelBtn);
  };
  wordEl.addEventListener('blur', onBlur, { once: true });
}

function saveInlineEdit(slot, wrap, wordEl, actionsEl, saveBtn, cancelBtn){
  const newText = sanitizeInlineText(wordEl.textContent || '');
  // אם ריק — לא לשנות
  if (newText.trim().length === 0) {
    wordEl.textContent = slot.words[histories.get(slot.key)?.slice(-1)[0] || 0] || '…';
    return endInlineEdit(actionsEl, saveBtn, cancelBtn, wordEl);
  }

  // אם לא קיים ברשימת המילים — נוסיף
  if (!slot.words.includes(newText)) {
    slot.words.push(newText);
  }
  wordEl.textContent = newText;
  pushHistory(slot.key, slot.words.indexOf(newText));

  // אחרי עדכון — זה נחשב SET ומתקדמים לכרטיס הבא (כמו בלוגיקה הקודמת)
  endInlineEdit(actionsEl, saveBtn, cancelBtn, wordEl);
  setSelection(slot, wrap, newText);
}

function cancelInlineEdit(wordEl, actionsEl, saveBtn, cancelBtn){
  // שחזור מצב תצוגה בלבד — בלי לשנות מילה
  endInlineEdit(actionsEl, saveBtn, cancelBtn, wordEl);
}

function endInlineEdit(actionsEl, saveBtn, cancelBtn, wordEl){
  if (saveBtn?.parentNode) saveBtn.parentNode.removeChild(saveBtn);
  if (cancelBtn?.parentNode) cancelBtn.parentNode.removeChild(cancelBtn);
  Array.from(actionsEl.children).forEach(ch => ch.style.display = ''); // להחזיר את הכפתורים הרגילים
  wordEl.setAttribute('contenteditable', 'false');
}

// מיקום הסמן בסוף הטקסט
function placeCaretEnd(el){
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ניקוי טקסט (למניעת רווחים/שורות מיותרות)
function sanitizeInlineText(s){ return s.replace(/\s+/g, ' ').trim(); }
/* ======== /Inline Edit ======== */

function renderUpTo(targetIndex){
  for (let i = scroller.children.length; i <= targetIndex && i < slots.length; i++){
    scroller.appendChild(createSlot(slots[i], i));
  }
}

function centerOnIndex(i){
  const el = document.querySelector(`.slot[data-index="${i}"]`);
  if (!el) return;
  const top = el.offsetTop - (scroller.clientHeight/2 - el.clientHeight/2);
  scroller.scrollTo({ top, behavior: 'smooth' });
}

function buildSentence(){
  return slots.map(s => chosen[s.key] || '[...]').join(' ');
}

function openPreview(){
  const sEl = document.getElementById('previewSentence');
  if (sEl) sEl.textContent = buildSentence();
  const m = document.getElementById('previewModal');
  if (m) m.classList.add('open');
}

const closeBtn = document.getElementById('closePreview');
if (closeBtn) closeBtn.onclick = ()=> {
  const m = document.getElementById('previewModal');
  if (m) m.classList.remove('open');
};
const previewBtn = document.getElementById('previewBtn');
if (previewBtn) previewBtn.onclick = openPreview;

// התחל
renderUpTo(0);
