# Foto finder

This goal of this project is additional practice using local storage, as well as creating a dynamic layout using flex and grid.

## Description
The project is created using HTML, CSS, and two JS files (`photo.js` and `main.js`). The `photo.js` file contains all relevant constructors and methods for `Photo` objects, and any functionality of the file is tied directly the `Photo` objects. All other functionality is handled by the `main.js` file.

Below is the completed webpage for Desktop:

![My completed webpage](https://i.imgur.com/N7UqTBF.png)

Mobile:

![Mobile version](https://i.imgur.com/aV3aOoB.png)

## Getting Started

Clone the repo at `github.com/jarrettkong/foto-finder` and open the ```index.html``` file in your web browser of choice or navigate to https://jarrettkong.github.io/foto-finder/ to view it in the browser.

Features:
- The 'Add to Album' button is disabled if at least one field is empty.
- You cannot add files other than image formats.
- Added cards are appended to the DOM in most recent order.
- Cards can be favorited, edited, or deleted. These changes persist on refresh.
- You can search for cards using the search bar, and it will also search the favorites only if in favorite view.
- Card interaction is handled with event delegation.
- Cards have a limited length for title and caption.


## Known Issues

- None
