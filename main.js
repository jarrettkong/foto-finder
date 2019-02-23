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

function getIndex(e) {
  const parent = e.target.closest('article');
  const parentID = parent.dataset.id;
  return photos.findIndex(photo => photo.id === parentID);
}

function addPhoto(e) {
  let newPhoto = createPhoto(emptyPhoto);
  return newPhoto;
}

function reinstantiatePhoto(photo) {
  return new Photo(photo.id, photo.title, photo.caption, photo.file, photo.favorite);
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
  clone.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
  clone.querySelector('.delete-icon').addEventListener('click', removePhoto);
}

function removePhoto(e) {
  e.target.closest('article').remove();
}

function toggleFavorite() {
  console.log('favorite');
}

function displayPhotos() {
  photos.forEach(photo => {
    newPhoto = reinstantiatePhoto(photo);
    photoArea.appendChild(createPhoto(newPhoto));
  });
}

window.addEventListener('DOMContentLoaded', displayPhotos);
