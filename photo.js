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
    photos.slice(index, 1);
  }

  updatePhoto() {

  }

}
