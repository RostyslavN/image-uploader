import { upload } from './upload.js';

upload('.file-uploader', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif']
});