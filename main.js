// Query selectors

const uploadInput = document.getElementById('image-upload');
const saveBtn = document.getElementById('save-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const searchInput = document.querySelector('#search-input');
const titleInput = document.querySelector('#title-input');
const captionInput = document.querySelector('#caption-input');
const photoArea = document.querySelector('#photo-area .wrapper');
const photoTemplate = document.querySelector('template');
const seeMoreBtn = document.querySelector('.see-more-btn');

// Global variables

const photos = JSON.parse(localStorage.getItem('photos')) || [];
const reader = new FileReader();

// Event listeners

titleInput.addEventListener('keypress', saveOnEnter);
captionInput.addEventListener('keypress', saveOnEnter);
titleInput.addEventListener('input', disableSave);
captionInput.addEventListener('input', disableSave);
uploadInput.addEventListener('input', disableSave);

saveBtn.addEventListener('click', e => {
  e.preventDefault();
  reader.readAsDataURL(uploadInput.files[0]);
  reader.onload = e => {
    const newPhoto = addPhoto(e);
    photoArea.insertBefore(newPhoto, photoArea.firstChild);
  }
});

favoritesBtn.addEventListener('click', e => {
  e.preventDefault();
  if(favoritesBtn.innerText !== 'View All') {
    const favorites = filterFavortites();
    displayPhotos(favorites);
    favoritesBtn.innerText = 'View All';
  } else {
    displayPhotos(photos);
    favoritesBtn.innerText = `View ${countFavorites()} Favorite(s)`;
  }
});

searchInput.addEventListener('input', e => {
  const query = searchInput.value;
  const results = getSearchResults(photos, query);
  displayPhotos(results);
});

seeMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  if(seeMoreBtn.innerText === 'See More') {
    seeMoreBtn.innerText = 'See Less';
    displayPhotos(photos, photos.length);
  } else {
    seeMoreBtn.innerText = 'See More';
    displayPhotos(photos);
  }
});

window.addEventListener('DOMContentLoaded', e => {
  favoritesBtn.innerText = `View ${countFavorites()} Favorite(s)`;
  if(photos.length > 0) {
    displayPhotos(photos)
  }
});

// Functions

function getSearchResults(album, query) {
  return album.filter(photo => photo.title.toLowerCase().includes(query) || photo.caption.toLowerCase().includes(query));
}

function disableSave() {
  if(titleInput.value !== '' && captionInput.value !== '' && uploadInput.files[0]) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

function blurInput(e) {
  if(e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
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
    photoToEdit.updatePhoto(photos, i, editedContent, e.target.innerText);
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

function reinstantiatePhoto(album, i) {
  return new Photo(album[i].id, album[i].title, album[i].caption, album[i].file, album[i].favorite);
}

function createPhoto(photo) {
  const photoClone = photoTemplate.content.cloneNode(true);
  addCloneInfo(photoClone, photo);
  addCloneListeners(photoClone);
  return photoClone;
}

function addCloneInfo(clone, photo) {
  clone.querySelector('article').dataset.id = photo.id;
  clone.querySelector('.photo-title').innerText = photo.title;
  clone.querySelector('.uploaded-photo').src = `${photo.file}`;
  clone.querySelector('.photo-caption').innerText = photo.caption;
  clone.querySelector('.favorite-icon').src = photo.favorite ? "images/favorite-active.svg" : "images/favorite.svg";
}

function addCloneListeners(clone) {
  clone.querySelector('.photo-title').addEventListener('keypress', blurInput);
  clone.querySelector('.photo-caption').addEventListener('keypress', blurInput);
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

function toggleFavorite(e) {
  const i = getIndex(e);
  const photoToFavorite = reinstantiatePhoto(photos, i);
  photoToFavorite.updateFavorite(photos, i);
  toggleIcon(photoToFavorite, e);
}

function toggleIcon(photo, e) {
  if(photo.favorite) {
    e.target.src = 'images/favorite-active.svg';
  } else {
    e.target.src = 'images/favorite.svg';
  }
  favoritesBtn.innerText = `View ${countFavorites()} Favorite(s)`;
}

function countFavorites() {
  const favorites = photos.filter(photo => photo.favorite);
  favoritesBtn.innerText = `View ${favorites.length} Favorite(s)`;
  return favorites.length;
}

function displayPhotos(album, size = 10) {
  const photosToShow = toggleView(album, size);
  photoArea.innerHTML = '';
  photosToShow.forEach(photo => {
    photoArea.insertBefore(createPhoto(photo), photoArea.firstChild);
  });
}

function toggleView(album, size) {
  if(album.length < 10) {
    return album;
  } else {
    return album.slice(album.length - size, album.length);
  }
}

function filterFavortites() {
  return photos.filter(photo => photo.favorite);
}
