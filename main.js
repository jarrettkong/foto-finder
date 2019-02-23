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
      const newPhoto = addPhoto(e);
      photoArea.appendChild(newPhoto);
    }
  }
});

// Functions

function saveEdits(editedContent) {
  return function(e) {
    const i = getIndex(e);
    const photoToEdit = reinstantiatePhoto(photos, i);
    photoToEdit.updatePhoto(photos, editedContent, e.target.innerText);
    photos[i] = photoToEdit;
    localStorage.photos = JSON.stringify(photos);
  }
}

function getIndex(e) {
  const parent = e.target.closest('article');
  const parentID = parseInt(parent.dataset.id);
  return photos.findIndex(photo => photo.id === parentID);
}

function addPhoto(e) {
  const newPhoto = new Photo(Date.now(), titleInput.value, captionInput.value, e.target.result);
  newPhoto.saveToStorage(photos);
  const photoToAdd = createPhoto(newPhoto);
  return photoToAdd;
}

function reinstantiatePhoto(photos, i) {
  return new Photo(photos[i].id, photos[i].title, photos[i].caption, photos[i].file, photos[i].favorite);
}

function createPhoto(photo) {
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
  clone.querySelector('.photo-title').addEventListener('blur', saveEdits('title'));
  clone.querySelector('.photo-caption').addEventListener('blur', saveEdits('caption'));
  clone.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
  clone.querySelector('.delete-icon').addEventListener('click', removePhoto);
}

function removePhoto(e) {
  e.target.closest('article').remove();
  const i = getIndex(e);
  const photoToDelete = reinstantiatePhoto(photos, i);
  photoToDelete.deleteFromStorage(photos, i);
}

function toggleFavorite() {
  console.log('favorite');
}

function displayPhotos() {
  photos.forEach(photo => {
    photoArea.appendChild(createPhoto(photo));
  });
}

window.addEventListener('DOMContentLoaded', displayPhotos);
