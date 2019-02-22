// Query selectors

const uploadInput = document.getElementById('image-upload');
const saveBtn = document.getElementById('save-button');
const searchInput = document.querySelector('#search-input');
const titleInput = document.querySelector('#title-input');
const captionInput = document.querySelector('#caption-input');
const photoArea = document.querySelector('#photo-area .wrapper');
const photoTemplate = document.querySelector('template');

// Global variables

const photos = JSON.parse(localStorage.getItem('photos')) || [];
const reader = new FileReader();

// Event listeners

saveBtn.addEventListener('click', e => {
  e.preventDefault();
  if (uploadInput.files[0]) {
    reader.readAsDataURL(uploadInput.files[0]);
    reader.onload = e => {
      let emptyPhoto = createPhoto(e);
      let newPhoto = addPhotoData(emptyPhoto);
      photoArea.appendChild(newPhoto);
    }
  }
});

function getIndex(e) {
  const parent = e.target.closest('article');
  const parentID = parent.dataset.id;
  return photos.findIndex(photo => {
    return photo.id === parentID;
  });
}

function createPhoto(e) {
  let newPhoto = new Photo(Date.now(), titleInput.value, captionInput.value, e.target.result);
  newPhoto.saveToStorage(photos);
  return newPhoto;
}

function addPhotoData(photo) {
  let photoClone = photoTemplate.content.cloneNode(true);
  addCloneInfo(photoClone, photo);
  addCloneListeners(photoClone);
  return photoClone;
}

function addCloneInfo(clone, photo) {
  clone.querySelector('article').dataset.id = photo.id;
  clone.querySelector('.photo-title').innerText = photo.title;
  clone.querySelector('.uploaded-photo').src = `${photo.file}`;
  clone.querySelector('.photo-caption').innerText = photo.caption;
}

function addCloneListeners(clone) {
  clone.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
  clone.querySelector('.delete-icon').addEventListener('click', removePhoto);
}

function removePhoto(e) {
  e.target.closest('article').remove();
}

function toggleFavorite() {
  console.log('favorite');
}
