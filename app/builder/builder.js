// File: public/builder/builder.js
// Location: /public/builder/builder.js
// This script provides the interactive logic for the builder after the initial form is submitted.
// It includes inline editing, animations, and communication with the React parent component.

document.addEventListener('DOMContentLoaded', () => {
    // --- SVG Icon Library (for a premium feel) ---
    const ICONS = {
        like: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        dislike: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        undo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.8-6.3"></path><polyline points="21 3 21 8 16 8"></polyline></svg>`,
        save: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13H7v8"></polyline><polyline points="7 3 7 8H15"></polyline></svg>`
    };

    // --- Initial Setup ---
    const seed = window.__builderSeed;
    if (!seed) {
        console.error("Builder seed data not found!");
        return;
    }

    const { setComposedText } = seed;
    const scroller = document.getElementById('scroller');
    if (!scroller) return;

    // This data structure defines the interactive steps of the builder
    const slots = [
        { key: 'subject', words: ['I', 'You', 'The cat', 'The artist', 'We'] },
        { key: 'verb', words: ['love', 'create', 'design', 'write', 'explore'] },
        { key: 'object', words: ['art', 'music', 'stories', 'code', 'the future'] }
    ];

    const chosen = {};
    const histories = new Map();

    // --- Core Functions ---
    function createActionButton(cls, iconSvg, fn) {
        const btn = document.createElement('button');
        btn.className = `actionBtn ${cls}`;
        btn.innerHTML = iconSvg;
        btn.onclick = (e) => {
            e.stopPropagation();
            fn();
        };
        return btn;
    }

    function createSlot(slotData, index) {
        const wrap = document.createElement('section');
        wrap.className = 'slot';
        wrap.dataset.index = index;

        const card = document.createElement('div');
        card.className = 'card';

        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        wordEl.textContent = slotData.words[0] || '…';

        const actions = document.createElement('div');
        actions.className = 'actions';

        const likeBtn = createActionButton('like', ICONS.like, () => setSelection(slotData, wrap, wordEl.textContent));
        const editBtn = createActionButton('edit', ICONS.edit, () => enterEditMode(slotData, wrap, wordEl, actions));
        const dislikeBtn = createActionButton('dislike', ICONS.dislike, () => changeWord(slotData, 1, wordEl));
        const undoBtn = createActionButton('undo', ICONS.undo, () => undoLast(slotData, wordEl));

        actions.append(likeBtn, editBtn, dislikeBtn, undoBtn);
        card.append(wordEl, actions);
        wrap.append(card);

        histories.set(slotData.key, [0]);
        return wrap;
    }

    function setSelection(slotData, wrap, text) {
        chosen[slotData.key] = text;
        
        document.querySelectorAll('.slot').forEach(el => el.classList.remove('is-active'));
        wrap.classList.add('is-selected', 'is-active');

        updateFullSentence();

        const currentIndex = Number(wrap.dataset.index);
        const nextIndex = currentIndex + 1;

        if (nextIndex < slots.length) {
            renderUpTo(nextIndex);
            centerOnIndex(nextIndex);
        } else {
            document.getElementById('previewBtn')?.focus();
        }
    }

    function enterEditMode(slotData, wrap, wordEl, actions) {
        if (wrap.classList.contains('is-editing')) return;

        wrap.classList.add('is-editing');
        actions.style.display = 'none';
        wordEl.contentEditable = 'true';
        wordEl.focus();
        
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(wordEl);
        selection.removeAllRanges();
        selection.addRange(range);

        const saveBtn = createActionButton('saveBtn', ICONS.save, () => exitEditMode(slotData, wrap, wordEl, actions, saveBtn));
        const card = wrap.querySelector('.card');
        card.append(saveBtn);

        wordEl.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                exitEditMode(slotData, wrap, wordEl, actions, saveBtn);
            }
        };
    }

    function exitEditMode(slotData, wrap, wordEl, actions, saveBtn) {
        wrap.classList.remove('is-editing');
        wordEl.contentEditable = 'false';
        wordEl.onkeydown = null;
        saveBtn.remove();
        actions.style.display = 'flex';
        
        const newText = wordEl.textContent.trim();
        if (newText) {
            if (!slotData.words.includes(newText)) {
                slotData.words.push(newText);
                pushHistory(slotData.key, slotData.words.length - 1);
            }
            setSelection(slotData, wrap, newText);
        }
    }
    
    function changeWord(slotData, delta, wordEl) {
        if (!slotData.words || !slotData.words.length) return;
        
        wordEl.classList.add('is-changing');

        setTimeout(() => {
            const currentIndex = slotData.words.indexOf(wordEl.textContent);
            const nextIndex = (currentIndex + delta + slotData.words.length) % slotData.words.length;
            wordEl.textContent = slotData.words[nextIndex];
            pushHistory(slotData.key, nextIndex);
            wordEl.classList.remove('is-changing');
        }, 200);
    }
    
    function undoLast(slotData, wordEl) {
        const historyStack = histories.get(slotData.key) || [];
        if (historyStack.length <= 1) return;
        
        wordEl.classList.add('is-changing');

        setTimeout(() => {
            historyStack.pop();
            const previousIndex = historyStack[historyStack.length - 1];
            wordEl.textContent = slotData.words[previousIndex];
            wordEl.classList.remove('is-changing');
        }, 200);
    }
    
    function pushHistory(key, index) {
        const historyStack = histories.get(key) || [];
        historyStack.push(index);
        histories.set(key, historyStack);
    }

    function renderUpTo(targetIndex) {
        for (let i = scroller.children.length; i <= targetIndex && i < slots.length; i++) {
            scroller.appendChild(createSlot(slots[i], i));
        }
    }
    
    function centerOnIndex(index) {
        const el = document.querySelector(`.slot[data-index="${index}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function buildSentence() {
        return slots.map(s => chosen[s.key] || '...').join(' ');
    }

    function updateFullSentence() {
        if (setComposedText) {
            setComposedText(buildSentence());
        }
    }

    // --- Modal Logic ---
    function openPreview() {
        const sentenceEl = document.getElementById('previewSentence');
        if (sentenceEl) sentenceEl.textContent = buildSentence();
        const modal = document.getElementById('previewModal');
        // This class is defined in builder.module.css and is globally available
        if (modal) modal.classList.add('isOpen');
    }

    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) closePreviewBtn.onclick = () => {
        const modal = document.getElementById('previewModal');
        if (modal) modal.classList.remove('isOpen');
    };

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) previewBtn.onclick = openPreview;

    // --- Start the Builder ---
    renderUpTo(0);
});

