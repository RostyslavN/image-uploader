export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  if (input === null) return;

  const preview = document.createElement('div');
  preview.classList.add('preview');


  const openBtn = document.createElement('button');
  openBtn.classList.add('btn');
  openBtn.textContent = 'Open';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', openBtn);

  function triggerInputFile() {
    input.click();
  }

  function inputChangeHandler(event) {
    if (!event.target.files.length) return;

    const files = Array.from(event.target.files);

    preview.textContent = '';
    files.forEach(file => {
      if (!file.type.match('image')) return;

      const reader = new FileReader(file);

      reader.onload = event => {
        const src = event.target.result;
        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-item">
            <img src="${src}" alt="${file.name}"> </img>
          </div>
        `);
      }

      reader.readAsDataURL(file);
    });
    
  }

  openBtn.addEventListener('click', triggerInputFile);
  input.addEventListener('change', inputChangeHandler);
}