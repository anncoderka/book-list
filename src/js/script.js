{
    'use strict';

    const select = {
        templateOf: {
            menuBook: '#template-book',
        },
        booksList: '.books-list',
        bookImage: 'book__image',
        filters: '.filters',
    };
    const templates = {
        menuBook: Handlebars.compile(document.querySelector(select.templateOf.menuBook).innerHTML),
    };

    class BooksList {

        constructor() {
            const thisBooksList = this;
            thisBooksList.favoriteBooks = [];
            thisBooksList.filters = [];
            thisBooksList.initData();
            thisBooksList.getElements();
            thisBooksList.render();
            thisBooksList.initActions();
        }

        initData() {
            const thisBooksList = this;
            thisBooksList.data = dataSource.books;
        }

        getElements() {
            const thisBooksList = this;
            thisBooksList.dom = {};
            thisBooksList.dom.booksListContainer = document.querySelector(select.booksList);
            thisBooksList.dom.filters = document.querySelector(select.filters);
        }

        render() {
            const thisBooksList = this;
            for (let book of thisBooksList.data) {
                book.ratingBgc = this.determineRatingBgc(book.rating);
                book.ratingWidth = book.rating * 10;
                // console.log(book);
                const generatedHTML = templates.menuBook(book);
                const element = utils.createDOMFromHTML(generatedHTML);
                thisBooksList.dom.booksListContainer.appendChild(element);
            }
        }

        initActions() {
            const thisBooksList = this;
            thisBooksList.dom.filters.addEventListener('click', function (event) {
                if (event.target.tagName === 'INPUT'
                    && event.target.type === 'checkbox'
                    && event.target.name === 'filter') {
                    // console.log(event.target.value)
                    // console.log('checked=',event.target.checked);
                    if (event.target.checked) {
                        thisBooksList.filters.push(event.target.value);
                    } else {
                        const index = thisBooksList.filters.indexOf(event.target.value);
                        if (index > -1) {
                            thisBooksList.filters.splice(index, 1);
                        }
                    }
                    console.log('filters=', thisBooksList.filters);
                    thisBooksList.filterBooks();
                }
            });

            thisBooksList.dom.booksListContainer.addEventListener('dblclick', function (event) {
                event.preventDefault();
                // console.log('event.target.offsetParent', event.target.offsetParent);
                const parent = event.target.offsetParent;
                const bookLinkClicked = parent.classList.contains(select.bookImage);
                if (bookLinkClicked) {
                    const id = parent.getAttribute('data-id');
                    if (thisBooksList.favoriteBooks.includes(id)) {
                        parent.classList.remove('favorite');
                        const index = thisBooksList.favoriteBooks.indexOf(id);
                        if (index > -1) {
                            thisBooksList.favoriteBooks.splice(index, 1);
                        }
                    } else {
                        parent.classList.add('favorite');
                        thisBooksList.favoriteBooks.push(id);
                    }
                }
                console.log('favoriteBooks', thisBooksList.favoriteBooks);
            });
        }

        filterBooks() {
            const thisBooksList = this;
            const booksListContainerEl = document.querySelector(select.booksList);
            for (let book of thisBooksList.data) {
                let shouldBeHidden = false;
                for (let filter of thisBooksList.filters) {
                    if (!book.details[filter]) {
                        shouldBeHidden = true;
                        break;
                    }
                }
                const bookEl = booksListContainerEl.querySelector('.book__image[data-id="' + book.id + '"]');
                if (shouldBeHidden) {
                    bookEl.classList.add('hidden');
                } else {
                    bookEl.classList.remove('hidden');
                }
            }
        }

        determineRatingBgc(rating) {
            let result = '';
            if (rating <= 6) {
                result = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
            } else if (rating > 6 && rating <= 8) {
                result = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
            } else if (rating > 8 && rating <= 9) {
                result = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
            } else if (rating > 9) {
                result = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
            }
            return result;
        }
    }

    const app = new BooksList();
}