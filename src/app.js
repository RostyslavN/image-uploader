import firebase from 'firebase/app';
import 'firebase/storage';

import {firebaseConfig} from '../firebase.config';
import { upload } from './upload.js';

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('.file-uploader', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        const block = blocks[index].querySelector('.preview-info-progress');
        block.textContent = block.style.width = percentage + '%';
      }, error => {
        console.log(error);
      }, complete => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download URL', url);
        });
      });
    });
  }
});