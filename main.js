// Query selectors

const captionCount = document.querySelector('#caption-count span');
const captionInput = document.querySelector('#caption-input');
const emptyText = document.querySelector('h3');
const favoritesBtn = document.getElementById('favorites-btn');
const photoArea = document.querySelector('#photo-area .wrapper');
const photoTemplate = document.querySelector('template');
const saveBtn = document.getElementById('save-btn');
const searchInput = document.querySelector('#search-input');
const seeMoreBtn = document.querySelector('.see-more-btn');
const titleCount = document.querySelector('#title-count span');
const titleInput = document.querySelector('#title-input');
const uploadInput = document.getElementById('image-upload');

// Global variables

const photos = JSON.parse(localStorage.getItem('photos')) || [];
const reader = new FileReader();
let photosToDisplay = photos;

// Event listeners

titleInput.addEventListener('keypress', saveOnEnter);
titleInput.addEventListener('input', disableSave);
titleInput.addEventListener('input', countCharacters(titleCount));
captionInput.addEventListener('keypress', saveOnEnter);
captionInput.addEventListener('input', disableSave);
captionInput.addEventListener('input', countCharacters(captionCount));
uploadInput.addEventListener('input', disableSave);
searchInput.addEventListener('input', search);
saveBtn.addEventListener('click', addNewPhoto);
favoritesBtn.addEventListener('click', showFavorites);
seeMoreBtn.addEventListener('click', seeMore);
window.addEventListener('DOMContentLoaded', start);

// Functions

function getPhotoData(e) {
  const newPhoto = new Photo(Date.now(), titleInput.value, captionInput.value, e.target.result);
  photos.push(newPhoto);
  newPhoto.saveToStorage(photos);
  const photoToAdd = createPhoto(newPhoto);
  return photoToAdd;
}

function addCloneInfo(clone, photo) {
  clone.querySelector('article').dataset.id = photo.id;
  clone.querySelector('.photo-title').value = photo.title;
  clone.querySelector('.uploaded-photo').src = photo.file;
  clone.querySelector('.photo-caption').value = photo.caption;
  clone.querySelector('.favorite-icon').src = photo.favorite ? "images/favorite-active.svg" : "images/favorite.svg";
}

function addCloneListeners(clone) {
  clone.querySelector('.photo-title').addEventListener('keypress', blurInput);
  clone.querySelector('.photo-caption').addEventListener('keypress', blurInput);
  clone.querySelector('.photo-title').addEventListener('blur', saveEdits('title'));
  clone.querySelector('.photo-caption').addEventListener('blur', saveEdits('caption'));
  clone.querySelector('.favorite-icon').addEventListener('click', toggleFavroiteStatus);
  clone.querySelector('.delete-icon').addEventListener('click', removePhoto);
}

function blurInput(e) {
  if(e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
}

function checkLength(album) {
  album.length <= 10 ? hideElement(seeMoreBtn, true) : hideElement(seeMoreBtn, false);
}

function countCharacters(element) {
  return function(e) {
    element.innerText = e.target.value.length;
  }
}

function createPhoto(photo) {
  const photoClone = photoTemplate.content.cloneNode(true);
  addCloneInfo(photoClone, photo);
  addCloneListeners(photoClone);
  return photoClone;
}

function disableSave() {
  if(titleInput.value && captionInput.value && uploadInput.files[0]) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

function displayPhotos(album, size = 10) {
  const photosToShow = toggleView(album, size);
  photoArea.innerHTML = '';
  photosToShow.forEach(photo => {
    photoArea.insertBefore(createPhoto(photo), photoArea.firstChild);
  });
  checkLength(album);
}

function filterFavortites(photos) {
  return photos.filter(photo => photo.favorite);
}

function filterSearch(album, query) {
  return album.filter(photo => photo.title.toLowerCase().includes(query) || photo.caption.toLowerCase().includes(query));
}

function showFavorites(e) {
  e.preventDefault();
  if(favoritesBtn.innerText !== 'View All') {
    photosToDisplay = filterFavortites(photos);
  } else {
    photosToDisplay = photos;
  }
  displayPhotos(photosToDisplay);
  toggleFavoriteButton();
  seeMoreBtn.innerText = 'See More'
}

function getIndex(e) {
  const parent = e.target.closest('article');
  const parentID = parseInt(parent.dataset.id);
  return photos.findIndex(photo => photo.id === parentID);
}

function addNewPhoto(e) {
  e.preventDefault();
  reader.readAsDataURL(uploadInput.files[0]);
  reader.onload = e => {
    const newPhoto = getPhotoData(e);
    photoArea.insertBefore(newPhoto, photoArea.firstChild);
    displayPhotos(photos);
    resetFields();
    hideElement(emptyText, true);
  }
}

function hideElement(element, status) {
    if(status) {
    element.classList.add('hidden');
  } else {
    element.classList.remove('hidden');
  }
}

function reinstantiatePhoto(album, i) {
  return new Photo(album[i].id, album[i].title, album[i].caption, album[i].file, album[i].favorite);
}

function removePhoto(e) {
  e.target.closest('article').remove();
  const i = getIndex(e);
  const photoToDelete = reinstantiatePhoto(photos, i);
  photoToDelete.deleteFromStorage(photos, i);
  photos.length > 0 ? hideElement(emptyText, true) : hideElement(emptyText, false);
  if (favoritesBtn.innerText !== 'View All') {
    favoritesBtn.innerText = `View ${filterFavortites(photos).length} Favorite(s)`;
    displayPhotos(photosToDisplay);
  } else {
    displayPhotos(filterFavortites(photos));
  }
}

function resetFields() {
  titleInput.value = '';
  titleCount.innerText = 0;
  captionInput.value = '';
  captionCount.innerText = 0;
  searchInput.value = '';
  seeMoreBtn.innerText = 'See More';
  saveBtn.disabled = true;
}

function saveOnEnter(e) {
  if(e.key === "Enter") {
    e.preventDefault();
    saveBtn.click();
  }
}

function saveEdits(editedContent) {
  return function(e) {
    const i = getIndex(e);
    const photoToEdit = reinstantiatePhoto(photos, i);
    photoToEdit.updatePhoto(photos, i, editedContent, e.target.value);
  }
}

function search() {
  const query = searchInput.value;
  const results = filterSearch(photosToDisplay, query);
  displayPhotos(results);
  seeMoreBtn.innerText = 'See More'
}

function seeMore(e) {
  e.preventDefault();
  if(seeMoreBtn.innerText === 'See More') {
    seeMoreBtn.innerText = 'See Less';
    displayPhotos(photosToDisplay, photosToDisplay.length);
  } else {
    seeMoreBtn.innerText = 'See More';
    displayPhotos(photosToDisplay);
  }
}

function start() {
  favoritesBtn.innerText = `View ${filterFavortites(photos).length} Favorite(s)`;
  if(photos.length > 0) {
    hideElement(emptyText, true);
    displayPhotos(photos)
  }
}

function toggleFavroiteStatus(e) {
  const i = getIndex(e);
  const photoToFavorite = reinstantiatePhoto(photos, i);
  photoToFavorite.updateFavorite(photos, i);
  toggleFavoriteIcon(photoToFavorite, e);
  if(favoritesBtn.innerText !== 'View All') {
    favoritesBtn.innerText = `View ${filterFavortites(photos).length} Favorite(s)`;
  }
}

function toggleFavoriteButton() {
  if(favoritesBtn.innerText === 'View All') {
    favoritesBtn.innerText = `View ${filterFavortites(photos).length} Favorite(s)`;
  } else {
    favoritesBtn.innerText = 'View All';
  }
}

function toggleFavoriteIcon(photo, e) {
  if(photo.favorite) {
    e.target.src = 'images/favorite-active.svg';
  } else {
    e.target.src = 'images/favorite.svg';
  }
  if (favoritesBtn.innerText === 'View All') {
    e.target.closest('article').remove();
  }
}

function toggleView(album, size) {
  if(album.length < size) {
    return album;
  } else {
    return album.slice(album.length - size, album.length);
  }
}
