(() => {
  const recent = new Map();
  function freshProblem(key, generate) {
    const storageKey = 'classarcade.problem.' + key;
    let previous = recent.get(key);
    try { previous ??= localStorage.getItem(storageKey); } catch {}
    let value, encoded;
    for (let attempt = 0; attempt < 24; attempt++) {
      value = generate();
      encoded = JSON.stringify(value);
      if (encoded !== previous) break;
    }
    recent.set(key, encoded);
    try { localStorage.setItem(storageKey, encoded); } catch {}
    return value;
  }
  window.freshProblem = freshProblem;
  window.problemInteger = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
})();
