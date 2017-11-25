var Db1Name = "Students";

function intiDb1(callBack) {
    var Connection = new JsStore.Instance();
    JsStore.isDbExist(Db1Name, function (isExist) {
        if (isExist) {
            callBack();
        } else {
            var Database = getDb1Structure();
            Connection.createDb(Database, callBack);
        }
    }, function (err) {
        console.error(err);
    })
}

function getDb1Structure() {
    var TblStudent = {
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
    var Db = {
        Name: Db1Name,
        Tables: [TblStudent]
    }
    return Db;
}

var Students = {
    initEvents: function () {
        $('#tblStudent tbody').
        on('click', '.btn-add', Students.addItem).
        on('click', '.btn-clear', Students.clearItem).
        on('click', '.btn-delete', Students.deleteItem).
        on('click', '.btn-edit', Students.editItem).
        on('click', '.btn-editCancel', Students.cancelEdit).
        on('click', '.btn-update', Students.updateItem)
    },
    addItem: function () {
        var Connection = new JsStore.Instance(Db1Name),
            TableFirstRow = $(this).parents().eq(1),
            Value = {
                Name: TableFirstRow.find('td:nth-child(1) input').val(),
                Semester: TableFirstRow.find('td:nth-child(2) input').val(),
                Course: TableFirstRow.find('td:nth-child(3) input').val()
            };
        Connection.insert({
            Into: 'Student',
            Values: [Value],
            Return: true, // return the inserted values
            OnSuccess: function (values) {
                if (values.length > 0) {
                    Students.addRows(values);
                    alert('successfully added');
                    Students.clearItem();
                }
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    addRows: function (values) {
        var Table = $('#tblStudent tbody'),
            TableRow;

        values.forEach(function (value) {
            TableRow = "<tr data-id=" + value.Id + "></td><td>" + value.Name + "</td><td>" + value.Semester +
                "</td><td>" + value.Course + "</td><td>" + "<button class='btn-edit'>Edit</button>" +
                "</td><td>" + "<button class='btn-delete'>Delete</button>" + "</td></tr>";
            Table.append(TableRow);
        })
    },
    clearItem: function () {
        var TableFirstRow = $('#tblStudent tbody tr:first-child');
        TableFirstRow.find('td:nth-child(1) input').val('');
        TableFirstRow.find('td:nth-child(2) input').val('');
        TableFirstRow.find('td:nth-child(3) input').val('');
    },
    selectAll: function () {
        var Connection = new JsStore.Instance(Db1Name);
        Connection.select({
            From: 'Student',
            OnSuccess: function (results) {
                Students.addRows(results);
            },
            OnError: function (err) {
                console.log(err);
                alert(err.Message);
            }
        });
    },
    deleteItem: function () {
        var Connection = new JsStore.Instance(Db1Name),
            Row = $(this).parents().eq(1),
            Id = Number(Row.attr('data-id'));

        Connection.delete({
            From: 'Student',
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
                Semester: Row.find('td:nth-child(2) input').val(),
                Course: Row.find('td:nth-child(3) input').val()
            };
        Row.html("<td>" + Value.Name +
            "</td><td>" + Value.Semester +
            "</td><td>" + Value.Course + "</td><td>" +
            "<button class='btn-edit'>Edit</button>" +
            "</td><td>" + "<button class='btn-delete'>Delete</button>" + "</td>");
    },
    editItem: function () {
        //here you can get the data from table directly but i am gonna use select api.
        var Connection = new JsStore.Instance(Db1Name),
            Row = $(this).parents().eq(1),
            Id = Number(Row.attr('data-id')),
            createTextBox = function (val) {
                return '<input type="text" value=' + val + '>';
            }
        Connection.select({
            From: 'Student',
            Where: {
                Id: Id
            },
            OnSuccess: function (results) {
                var Value = results[0];
                Row.html("<td>" + createTextBox(Value.Name) +
                    "</td><td>" + createTextBox(Value.Semester) +
                    "</td><td>" + createTextBox(Value.Course) + "</td><td>" +
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
        var Connection = new JsStore.Instance(Db1Name),
            Row = $(this).parents().eq(1),
            Value = {
                Id: Number(Row.attr('data-id')),
                Name: Row.find('td:nth-child(1) input').val(),
                Semester: Row.find('td:nth-child(2) input').val(),
                Course: Row.find('td:nth-child(3) input').val()
            };
        Connection.update({
            In: 'Student',
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
                        "</td><td>" + Value.Semester +
                        "</td><td>" + Value.Course + "</td><td>" +
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