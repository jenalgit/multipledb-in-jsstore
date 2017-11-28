import { Injectable } from '@angular/core';
// import { BaseService } from '../service/base.service';
import { debug } from 'util';
import { CommonService } from '../service/common.service';

@Injectable()
export class StudentService {
  _dbName = 'Students';
  _connection;
  constructor(commonService: CommonService) {
    this._connection = commonService._connection;
  }

  addStudent = function (student) {
    this._connection.openDb(this._dbName);
    return this._connection.insert({
      Into: 'Student',
      Values: [student]
    });
  };

  getStudents = function () {
    this._connection.openDb(this._dbName);
    return this._connection.select({
      From: 'Student'
    });
  };

  deleteStudent = function (studentId) {
    this._connection.openDb(this._dbName);
    return this._connection.delete({
      From: 'Student',
      Where: {
        Id: studentId
      }
    });
  };

  updateStudent = function (studentId, updateValue) {
    this._connection.openDb(this._dbName);
    return this._connection.update({
      In: 'Student',
      Where: {
        Id: studentId
      },
      Set: updateValue
    });
  };

  getStudent = function (studentId) {
    this._connection.openDb(this._dbName);
    return this._connection.select({
      From: 'Student',
      Where: {
        Id: studentId
      }
    });
  };
}
