export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  if (input === null) return;

  const openBtn = document.createElement('button');
  openBtn.classList.add('btn');
  openBtn.textContent = 'Open';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', openBtn);

  function triggerInputFile() {
    input.click();
  }

  function inputChangeHandler(event) {
    if (!event.target.files.length) return;

    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (!file.type.match('image')) return;

      const reader = new FileReader(file);

      reader.onload = event => {
        input.insertAdjacentHTML('afterend', `<img src="${event.target.result}"></img>`)
      }

      reader.readAsDataURL(file);
    });
    
  }

  openBtn.addEventListener('click', triggerInputFile);
  input.addEventListener('change', inputChangeHandler);
}