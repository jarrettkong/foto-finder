class Photo {

  constructor(id, title, caption, file, favorite = false) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite;
  }

  saveToStorage(photos) {
    localStorage.photos = JSON.stringify(photos);
  }

  deleteFromStorage(photos, index) {
    photos.splice(index, 1);
    this.saveToStorage(photos);
  }

  updatePhoto(photos, index, editedContent, newText) {
    editedContent === 'title' ? this.title = newText : this.caption = newText;
    photos[index] = this;
    this.saveToStorage(photos);
  }

  updateFavorite(photos, index) {
    this.favorite = !this.favorite;
    photos[index] = this;
    this.saveToStorage(photos);
  }

}
