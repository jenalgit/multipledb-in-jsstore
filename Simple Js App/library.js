var Db2Name = "Library"

function intiDb2() {
    var Connection = new JsStore.Instance();
    JsStore.isDbExist(Db2Name, function (isExist) {
        if (isExist) {
            onDbCreated();
        } else {
            var Database = getDb2Structure();
            Connection.createDb(Database, onDbCreated);
        }
    }, function (err) {
        console.error(err);
    })
}

function getDb2Structure() {
    var TblBooks = {
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
    var Db = {
        Name: Db2Name,
        Tables: [TblBooks]
    }
    return Db;
}

var Book = {
    initEvents: function () {
        $('#tblBook tbody').
        on('click', '.btn-add', Book.addItem).
        on('click', '.btn-clear', Book.clearItem).
        on('click', '.btn-delete', Book.deleteItem).
        on('click', '.btn-edit', Book.editItem).
        on('click', '.btn-editCancel', Book.cancelEdit).
        on('click', '.btn-update', Book.updateItem)
    },
    addItem: function () {
        var Connection = new JsStore.Instance(Db2Name),
            TableFirstRow = $(this).parents().eq(1),
            Value = {
                Name: TableFirstRow.find('td:nth-child(1) input').val(),
                Author: TableFirstRow.find('td:nth-child(2) input').val(),
                Quantity: Number(TableFirstRow.find('td:nth-child(3) input').val())
            };
        Connection.insert({
            Into: 'Books',
            Values: [Value],
            Return: true, // return the inserted values
            OnSuccess: function (values) {
                if (values.length > 0) {
                    Book.addRows(values);
                    alert('successfully added');
                    Book.clearItem();
                }
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    addRows: function (values) {
        var Table = $('#tblBook tbody'),
            TableRow;

        values.forEach(function (value) {
            TableRow = "<tr data-id=" + value.Id + "></td><td>" + value.Name + "</td><td>" + value.Author +
                "</td><td>" + value.Quantity + "</td><td>" + "<button class='btn-edit'>Edit</button>" +
                "</td><td>" + "<button class='btn-delete'>Delete</button>" + "</td></tr>";
            Table.append(TableRow);
        })
    },
    clearItem: function () {
        var TableFirstRow = $('#tblBook tbody tr:first-child');
        TableFirstRow.find('td:nth-child(1) input').val('');
        TableFirstRow.find('td:nth-child(2) input').val('');
        TableFirstRow.find('td:nth-child(3) input').val('');
    },
    selectAll: function () {
        var Connection = new JsStore.Instance(Db2Name);
        Connection.select({
            From: 'Books',
            OnSuccess: function (results) {
                Book.addRows(results);
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    deleteItem: function () {
        var Connection = new JsStore.Instance(Db2Name),
            Row = $(this).parents().eq(1),
            Id = Number(Row.attr('data-id'));

        Connection.delete({
            From: 'Books',
            Where: {
                Id: Id
            },
            OnSuccess: function (rowsDeleted) {
                if (rowsDeleted > 0) {
                    //remove the row from table
                    Row.remove();
                }
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    cancelEdit: function () {
        var Row = $(this).parents().eq(1),
            Value = {
                Id: Number(Row.attr('data-id')),
                Name: Row.find('td:nth-child(1) input').val(),
                Author: Row.find('td:nth-child(2) input').val(),
                Quantity: Row.find('td:nth-child(3) input').val()
            };
        Row.html("<td>" + Value.Name +
            "</td><td>" + Value.Author +
            "</td><td>" + Value.Quantity + "</td><td>" +
            "<button class='btn-edit'>Edit</button>" +
            "</td><td>" + "<button class='btn-delete'>Delete</button>" + "</td>");
    },
    editItem: function () {
        //here you can get the data from table directly but i am gonna use select api.
        var Connection = new JsStore.Instance(Db2Name),
            Row = $(this).parents().eq(1),
            Id = Number(Row.attr('data-id')),
            createTextBox = function (val) {
                return '<input type="text" value=' + val + '>';
            }
        Connection.select({
            From: 'Books',
            Where: {
                Id: Id
            },
            OnSuccess: function (results) {
                var Value = results[0];
                Row.html("<td>" + createTextBox(Value.Name) +
                    "</td><td>" + createTextBox(Value.Author) +
                    "</td><td>" + createTextBox(Value.Quantity) + "</td><td>" +
                    "<button class='btn-update'>Update</button>" +
                    "</td><td>" + "<button class='btn-editCancel'>Cancel</button>" + "</td>"
                );
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    updateItem: function () {
        var Connection = new JsStore.Instance(Db2Name),
            Row = $(this).parents().eq(1),
            Value = {
                Id: Number(Row.attr('data-id')),
                Name: Row.find('td:nth-child(1) input').val(),
                Author: Row.find('td:nth-child(2) input').val(),
                Quantity: Row.find('td:nth-child(3) input').val()
            };
        Connection.update({
            In: 'Books',
            Where: {
                Id: Value.Id
            },
            Set: {
                Name: Value.Name,
                Semester: Value.Semester,
                Course: Value.Course
            },
            OnSuccess: function (rowsUpdated) {
                if (rowsUpdated > 0) {
                    Row.html("<td>" + Value.Name +
                        "</td><td>" + Value.Author +
                        "</td><td>" + Value.Quantity + "</td><td>" +
                        "<button class='btn-edit'>Edit</button>" +
                        "</td><td>" + "<button class='btn-delete'>Delete</button>" + "</td>");
                }
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    }
}