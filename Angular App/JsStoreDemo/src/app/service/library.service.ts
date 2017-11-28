import { Injectable } from '@angular/core';
import { CommonService } from '../service/common.service';

@Injectable()
export class LibraryService {
  _connection;
  _isDbCreated: Boolean = false;
  constructor(commonService: CommonService) {
    this._connection = commonService._connection;
  }

  addBook = function (book) {
    this._connection.openDb('Library'); 
    return this._connection.insert({
      Into: 'Books',
      Values: [book]
    });
  };

  getBooks = function () {
    this._connection.openDb('Library');
    return this._connection.select({
      From: 'Books'
    });
  };

  deleteStudent = function (bookId) {
    this._connection.openDb('Library');
    return this._connection.delete({
      From: 'Books',
      Where: {
        Id: bookId
      }
    });
  };

  updateStudent = function (bookId, updateValue) {
    this._connection.openDb('Library');
    return this._connection.update({
      In: 'Books',
      Where: {
        Id: bookId
      },
      Set: updateValue
    });
  };

  getStudent = function (bookId) {
    this._connection.openDb('Library');
    return this._connection.select({
      From: 'Books',
      Where: {
        Id: bookId
      }
    });
  };
}
