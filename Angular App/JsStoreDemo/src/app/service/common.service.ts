import { Instance } from 'JsStore';
import { Injectable } from '@angular/core';
declare var JsStore: any;

@Injectable()
export class CommonService {

  _connection;
  _db1Name: String = 'Students';
  _db2Name: String = 'Library';
  _isDbCreated = false;

  constructor() {
    this._connection = new JsStore.Instance();
    const That = this;
    JsStore.isDbExist(this._db1Name).then(isExist => {
      if (!isExist) {
        const DataBase = That.getDb1Schema();
        this._connection.createDb(DataBase, function () {
          return;
        });
      }
      else {
        return;
      }
    }).catch(err => {
      // this will be fired when indexedDB is not supported.
      alert(err.Message);
    }).then(() => {
      JsStore.isDbExist(this._db2Name).then(isExist => {
        if (!isExist) {
          const DataBase = That.getDb2Schema();
          this._connection.createDb(DataBase);
          this._isDbCreated = true;
        }
        else {
          this._isDbCreated = true;
        }
      });
    });
  }

  private getDb1Schema = function () {
    const TblStudent = {
      Name: 'Student',
      Columns: [{
        Name: 'Id',
        PrimaryKey: true,
        AutoIncrement: true
      }, {
        Name: 'Name',
        NotNull: true,
        DataType: 'string'
      }, {
        Name: 'Semester',
        NotNull: true,
        DataType: 'string'
      }, {
        Name: 'Course',
        NotNull: true,
        DataType: 'string'
      }]
    };
    const Db = {
      Name: this._db1Name,
      Tables: [TblStudent]
    }
    return Db as any;
  };

  private getDb2Schema = function () {
    const TblBooks = {
      Name: 'Books',
      Columns: [{
        Name: 'Id',
        PrimaryKey: true,
        AutoIncrement: true
      }, {
        Name: 'Name',
        NotNull: true,
        DataType: 'string'
      }, {
        Name: 'Author',
        NotNull: true,
        DataType: 'string'
      }, {
        Name: 'Quantity',
        NotNull: true,
        DataType: 'number'
      }]
    };
    const Db = {
      Name: this._db2Name,
      Tables: [TblBooks]
    }
    return Db as any;
  };
}