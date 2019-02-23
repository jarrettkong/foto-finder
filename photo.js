class Photo {

  constructor(id, title, caption, file, favorite = false) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite;
  }

  saveToStorage(photos) {
    photos.push(this);
    localStorage.photos = JSON.stringify(photos);
  }

  deleteFromStorage(photos, index) {
    photos.splice(index, 1);
    localStorage.photos = JSON.stringify(photos);
  }

  updatePhoto(photos, index, editedContent, newText) {
    editedContent === 'title' ? this.title = newText : this.caption = newText;
    photos[index] = this;
    localStorage.photos = JSON.stringify(photos);
  }

  updateFavorite(photos, index) {
    this.favorite = !this.favorite;
    photos[index] = this;
    localStorage.photos = JSON.stringify(photos);
  }

}
