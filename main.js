// Query selectors

var uploadInput = document.getElementById('image-upload');
var saveBtn = document.getElementById('save-button');
var searchInput = document.querySelector('#search-input');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var photoArea = document.querySelector('#photo-area .wrapper');
var photoTemplate = document.querySelector('template');

// Global variables

var photos = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();

// Event listeners

saveBtn.addEventListener('click', e => {
  e.preventDefault();
  if (uploadInput.files[0]) {
    reader.readAsDataURL(uploadInput.files[0]);
    reader.onload = e => {
      var emptyPhoto = createPhoto(e);
      var newPhoto = addPhoto(emptyPhoto);
      photoArea.appendChild(newPhoto);
    }
  }
});

function createPhoto(e) {
  var newPhoto = new Photo(Date.now(), titleInput.value, captionInput.value, e.target.result);
  newPhoto.saveToStorage(photos);
  return newPhoto;
}

function addPhoto(photo) {
  var photoClone = photoTemplate.content.cloneNode(true);
  addPhotoData(photoClone, photo);
  addPhotoListeners(photoClone);
  return photoClone;
}

function addPhotoData(clone, photo) {
  clone.querySelector('.photo-title').innerText = photo.title;
  clone.querySelector('.uploaded-photo').src = `${photo.file}`;
  clone.querySelector('.photo-caption').innerText = photo.caption;
}

function addPhotoListeners(clone) {
  clone.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
  clone.querySelector('.delete-icon').addEventListener('click', e => {
    e.target.closest('article').remove();
  });
}

function toggleFavorite() {
  console.log('favorite');
}
