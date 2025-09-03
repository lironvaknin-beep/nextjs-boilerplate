// --- Builder Logic v2.0: Inline Editing & React State Sync ---

// Wait for the DOM and the React component to be ready
document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Setup ---
    const seed = (window as any).__builderSeed;
    if (!seed) {
        console.error("Builder seed data not found!");
        return;
    }

    const { setComposedText } = seed;
    const scroller = document.getElementById('scroller');
    if (!scroller) return;

    const slots = [
        { key: 'subject', words: ['I', 'You', 'The cat', 'The artist', 'We'] },
        { key: 'verb', words: ['love', 'create', 'design', 'write', 'explore'] },
        { key: 'object', words: ['art', 'music', 'stories', 'code', 'the future'] }
    ];

    const chosen = {};
    const histories = new Map();

    // --- Core Functions ---

    /**
     * Creates a button with consistent styling and behavior.
     * @param {string} cls - CSS class for styling (e.g., 'like', 'edit').
     * @param {string} text - The text/icon for the button.
     * @param {Function} fn - The function to call on click.
     * @returns {HTMLButtonElement}
     */
    function createActionButton(cls, text, fn) {
        const btn = document.createElement('button');
        btn.className = `actionBtn ${cls}`;
        btn.innerHTML = text; // Use innerHTML to support SVG icons later
        btn.onclick = fn;
        return btn;
    }

    /**
     * Creates a new content slot/card in the scroller.
     * @param {object} slotData - The data for the slot.
     * @param {number} index - The index of the slot.
     * @returns {HTMLElement}
     */
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

        // --- Action Buttons ---
        const likeBtn = createActionButton('like', '✓', () => setSelection(slotData, wrap, wordEl.textContent));
        const editBtn = createActionButton('edit', '✎', () => enterEditMode(slotData, wrap, wordEl, actions));
        const dislikeBtn = createActionButton('dislike', '✕', () => changeWord(slotData, 1, wordEl));
        const undoBtn = createActionButton('undo', '↺', () => undoLast(slotData, wordEl));

        actions.append(likeBtn, editBtn, dislikeBtn, undoBtn);
        card.append(wordEl, actions);
        wrap.append(card);

        histories.set(slotData.key, [0]); // Initialize history
        return wrap;
    }

    /**
     * Locks in a word selection, updates state, and reveals the next slot.
     */
    function setSelection(slotData, wrap, text) {
        chosen[slotData.key] = text;
        wrap.classList.add('is-selected'); // Visual feedback for selection
        
        updateFullSentence(); // Sync with React state

        const currentIndex = Number(wrap.dataset.index);
        const nextIndex = currentIndex + 1;

        if (nextIndex < slots.length) {
            renderUpTo(nextIndex);
            centerOnIndex(nextIndex);
        } else {
            // Last word selected, maybe show a "Done" message or pulse the preview button
            document.getElementById('previewBtn')?.focus();
        }
    }

    /**
     * Enters inline-editing mode for a word.
     */
    function enterEditMode(slotData, wrap, wordEl, actions) {
        actions.style.display = 'none';
        wordEl.contentEditable = 'true';
        wordEl.focus();
        
        // Select all text in the div for easy replacement
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(wordEl);
        selection.removeAllRanges();
        selection.addRange(range);

        const saveBtn = createActionButton('saveBtn', '✓', () => exitEditMode(slotData, wrap, wordEl, actions, saveBtn));
        
        const card = wrap.querySelector('.card');
        card.append(saveBtn);

        // Save on Enter key press
        wordEl.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                exitEditMode(slotData, wrap, wordEl, actions, saveBtn);
            }
        };
    }

    /**
     * Exits inline-editing mode and saves the new word.
     */
    function exitEditMode(slotData, wrap, wordEl, actions, saveBtn) {
        wordEl.contentEditable = 'false';
        wordEl.onkeydown = null;
        saveBtn.remove();
        actions.style.display = 'flex';
        
        const newText = wordEl.textContent.trim();
        if (newText) {
            // Add new word to the list if it's unique
            if (!slotData.words.includes(newText)) {
                slotData.words.push(newText);
                pushHistory(slotData.key, slotData.words.length - 1);
            }
            setSelection(slotData, wrap, newText);
        }
    }
    
    /**
     * Cycles to the next word in the list.
     */
    function changeWord(slotData, delta, wordEl) {
        if (!slotData.words || !slotData.words.length) return;
        const currentIndex = slotData.words.indexOf(wordEl.textContent);
        const nextIndex = (currentIndex + delta + slotData.words.length) % slotData.words.length;
        wordEl.textContent = slotData.words[nextIndex];
        pushHistory(slotData.key, nextIndex);
    }
    
    /**
     * Reverts to the previously used word for a slot.
     */
    function undoLast(slotData, wordEl) {
        const historyStack = histories.get(slotData.key) || [];
        if (historyStack.length <= 1) return; // Can't undo the first word
        historyStack.pop();
        const previousIndex = historyStack[historyStack.length - 1];
        wordEl.textContent = slotData.words[previousIndex];
    }
    
    function pushHistory(key, index) {
        const historyStack = histories.get(key) || [];
        historyStack.push(index);
        histories.set(key, historyStack);
    }

    /**
     * Renders slots up to a specific index.
     */
    function renderUpTo(targetIndex) {
        for (let i = scroller.children.length; i <= targetIndex && i < slots.length; i++) {
            scroller.appendChild(createSlot(slots[i], i));
        }
    }
    
    /**
     * Smoothly scrolls the viewport to center on a specific slot.
     */
    function centerOnIndex(index) {
        const el = document.querySelector(`.slot[data-index="${index}"]`);
        if (!el) return;
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    /**
     * Builds the complete sentence from chosen words.
     * @returns {string}
     */
    function buildSentence() {
        return slots.map(s => chosen[s.key] || '...').join(' ');
    }

    /**
     * Updates the React state with the current sentence.
     */
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
        if (modal) modal.classList.add(styles.isOpen);
    }

    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) closePreviewBtn.onclick = () => {
        const modal = document.getElementById('previewModal');
        if (modal) modal.classList.remove(styles.isOpen);
    };

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) previewBtn.onclick = openPreview;


    // --- Start the Builder ---
    renderUpTo(0);
});
