import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../service/library.service';
import { Book, IBook } from '../model/book';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  providers: [LibraryService]
})

export class LibraryComponent implements OnInit {

  _books: Array<Book> = [];
  _newBook: Book = new Book();
  private _service: LibraryService;
  _oldBook: Book = new Book();

  constructor(service: LibraryService) {
    this._service = service;
  }

  ngOnInit() {
    // give some time to create the db
    // otherwise you will call it before db created and will get the error
    const That = this;
    setTimeout(() => {
      That.getBooks();
    }, 500);
  }

  getBooks = function () {
    // if (this._service._isDbCreated) {
    this._service.getBooks().
      then(books => {
        this._books = books;
      }).catch(error => {
        console.error(error);
        alert(error.Message);
      });
    // }
  };

  addBook = function () {
    this._service.addBook(this._newBook).
      then(rowsAdded => {
        if (rowsAdded > 0) {
          this._books.push(this._newBook);
          this.clearNewBook();
          alert('Successfully added');
        }
      }).catch(error => {
        console.error(error);
        alert(error.Message);
      });
  };

  deleteBook = function (bookId) {
    this._service.deleteBook(bookId).
      then(rowsDeleted => {
        if (rowsDeleted > 0) {
          const Index = this._books.findIndex(book => book.Id === bookId);
          this._books.splice(Index, 1);
          alert('Successfully deleted');
        }
      }).catch(error => {
        console.error(error);
        alert(error.Message);
      });
  };

  clearNewBook = function () {
    this._newBook = new Book();
  };

  clearOldBook = function () {
    this._oldBook = new Book();
  };

  getBook = function (bookId) {
    this._service.getBook(bookId).
      then(books => {
        this._oldBook = books[0];
      }).catch(error => {
        console.error(error);
        alert(error.Message);
      });
  };

  updateBook = function () {
    const UpdatedValue = {
      Name: this._oldBook.Name,
      Author: this._oldBook.Author,
      Quantity: this._oldBook.Quantity
    };

    this._service.updateBook(this._oldBook.Id, UpdatedValue).
      then(rowsUpdated => {
        if (rowsUpdated > 0) {
          const Index = this._books.findIndex(book => book.Id === this._oldBook.Id);
          this._books[Index] = this._oldBook;
          this.clearOldBook();
          alert('Successfully updated');
        }
      }).catch(error => {
        console.error(error);
        alert(error.Message);
      });
  };
}
