export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  if (input === null) return;

  let files = [];
  const onUpload = options.onUpload ?? noop;
  const preview = createElement('div', ['preview']);
  const openBtn = createElement('button', ['btn'], 'Open');
  const uploadBtn = createElement('button', ['btn', 'primary', 'invisible'], 'Upload');

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', uploadBtn);
  input.insertAdjacentElement('afterend', openBtn);

  function triggerInputFile() {
    input.click();
  }

  function inputChangeHandler(event) {
    if (!event.target.files.length) return;

    files = Array.from(event.target.files);

    preview.textContent = '';
    files.forEach(file => {
      if (!file.type.match('image')) return;

      const reader = new FileReader(file);

      reader.onload = event => {
        const src = event.target.result;
        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-item">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}"> </img>
            <div class="preview-info">
              <span title="${file.name}">${truncate(file.name, 15)}</span>
              <span>${formateBytes(file.size)}</span>
            </div>
          </div>
        `);
      }
      uploadBtn.classList.remove('invisible');
      reader.readAsDataURL(file);
    });
    
  }

  function removeImageHadler(event) {
    const targetName = event.target.dataset.name;
    if (!targetName) return;

    files = files.filter(file => file.name !== targetName);
    if (!files.length) uploadBtn.classList.add('invisible');
    const imageBlock = preview
      .querySelector(`[data-name="${targetName}"]`)
      .closest('.preview-item');

    imageBlock.classList.add('deleting');
    imageBlock.addEventListener('transitionend', () => {
      imageBlock.remove();
    });
  }

  function clearPreview(block) {
    block.style.bottom = 0;
    block.innerHTML = '<div class="preview-info-progress"></div>'
  }

  function uploadImagesHander() {
    preview.querySelectorAll('.preview-remove').forEach(remover => remover.remove());
    const previewInfoBlocks = preview.querySelectorAll('.preview-info');
    previewInfoBlocks.forEach(block => {
      clearPreview(block);
    });
    onUpload(files, previewInfoBlocks);
  }

  openBtn.addEventListener('click', triggerInputFile);
  input.addEventListener('change', inputChangeHandler);
  preview.addEventListener('click', removeImageHadler);
  uploadBtn.addEventListener('click', uploadImagesHander);
}

function truncate(string, maxAllowedNumber) {
  return (string.length > maxAllowedNumber)
    ? string.substr(0, maxAllowedNumber - 1) + '&hellip;'
    : string;
}

function formateBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const marker = 1024;
  const decimal = 2;
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(marker));
  return Math.round(bytes / Math.pow(marker, sizeIndex), decimal) + ' ' + sizes[sizeIndex];
}

function createElement(tag, classes = [], textContent) {
  const element = document.createElement(tag);

  if (classes.length) {
    element.classList.add(...classes);
  }
  element.textContent = textContent ? textContent : '';

  return element;
}

function noop() {}