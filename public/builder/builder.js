(function(){
  const scroller = document.getElementById('scroller');
  if (!scroller) return;

  const slots = [
    { key: 'subject', words: ['I','You','We','They'] },
    { key: 'verb',    words: ['love','write','cook','build'] },
    { key: 'object',  words: ['pizza','stories','apps','coffee'] }
  ];

  const chosen = {};

  function render() {
    scroller.innerHTML = '';
    slots.forEach(slot => {
      const section = document.createElement('section');
      section.className = 'slot';

      const label = document.createElement('label');
      label.textContent = slot.key.charAt(0).toUpperCase() + slot.key.slice(1);
      label.style.display = 'block';
      label.style.fontWeight = '600';
      label.style.margin = '8px 0';

      const select = document.createElement('select');
      select.className = 'slot-select';
      slot.words.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
      });
      select.onchange = () => { chosen[slot.key] = select.value; };

      section.appendChild(label);
      section.appendChild(select);
      scroller.appendChild(section);

      chosen[slot.key] = slot.words[0];
    });
  }

  function buildSentence() { return [chosen.subject, chosen.verb, chosen.object].filter(Boolean).join(' '); }
  function openPreview()    { document.getElementById('previewSentence')?.textContent = buildSentence(); document.getElementById('previewModal')?.classList.add('open'); }
  function closePreview()   { document.getElementById('previewModal')?.classList.remove('open'); }
  function saveContent()    { try { const text = buildSentence(); navigator.clipboard?.writeText(text); } catch(e) {} }

  document.getElementById('previewBtn')?.addEventListener('click', openPreview);
  document.getElementById('closePreview')?.addEventListener('click', closePreview);
  document.getElementById('saveBtn')?.addEventListener('click', saveContent);

  render();
})();
