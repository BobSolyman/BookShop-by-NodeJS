var express = require('express');
var path = require('path');
var fs = require('fs');
const session = require('express-session');
var app = express();
const { ADDRCONFIG } = require('dns');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', function(req, res) {
    res.render('login', { alert: "" })
});
app.get('/home', function(req, res) {
    res.render('home')
});
app.get('/login', function(req, res) {
    var passedVariable = req.query.alert;
    res.render('login', { alert: passedVariable })
});


app.get('/registration', function(req, res) {
    res.render('registration', { alert: "" })
});
var usersdata = JSON.parse(fs.readFileSync("users.json"));


app.post('/register', function(req, res) {
    var found = false;
    var n = req.body.username;
    var p = req.body.password;
    var rlist = [];
    let x = { username: n, password: p, rlist };
    if (n == "" || p == "") {
        res.render('registration', { alert: "Username/password cannot be empty." })
    } else {
        for (var i = 0; i < usersdata.users.length; i++) {
            if (usersdata.users[i].username == n) {
                found = true
            }
        }
        if (found) {
            res.render('registration', { alert: "This Username is already taken." })
        } else {
            usersdata.users.push(x)
            res.redirect('/login?alert=Registration is Successful.');



        }
    }
    fs.writeFileSync("users.json", JSON.stringify(usersdata, null, 2));
});


app.post('/login', function(req, res) {
    var found = false;
    var n = req.body.username;
    var p = req.body.password;
    if (n == "" || p == "") {
        res.render('login', { alert: "Username/Password cannot be empty." })
    } else {
        for (var i = 0; i < usersdata.users.length; i++) {
            if (usersdata.users[i].username == n && usersdata.users[i].password == p) {
                found = true;
                req.session.userindex = i;
            }
        }
        if (found) {
            res.redirect('/home')
        } else {
            res.render('login', { alert: "Wrong Username/Password" })
        }
    }

});

app.get('/poetry', function(req, res) {
    res.render('poetry')
});
app.get('/fiction', function(req, res) {
    res.render('fiction')
});
app.get('/novel', function(req, res) {
    res.render('novel')
});
app.get('/readlist', function(req, res) {
    res.render('readlist', { userid: req.session.userindex, usid: usersdata.users[req.session.userindex].rlist });
});

app.get('/dune', function(req, res) {
    res.render('dune', { alert: "" });
});

app.post('/dune', function(req, res) {
    var f = adding('dune', req.session.userindex);
    if (f == true) {
        res.render('dune', { alert: "Book already added" });
    } else if (f == false) {
        res.render('dune', { alert: "" })
    }
});

app.get('/mockingbird', function(req, res) {
    res.render('mockingbird', { alert: "" })
});
app.post('/mockingbird', function(req, res) {
    var f = adding('mockingbird', req.session.userindex);
    if (f == true) {
        res.render('mockingbird', { alert: "Book already added" });
    } else if (f == false) {
        res.render('mockingbird', { alert: "" })
    }
});

app.get('/sun', function(req, res) {
    res.render('sun', { alert: "" })
});
app.post('/sun', function(req, res) {
    var f = adding('sun', req.session.userindex);
    if (f == true) {
        res.render('sun', { alert: "Book already added" });
    } else if (f == false) {
        res.render('sun', { alert: "" })
    }
});

app.get('/leaves', function(req, res) {
    res.render('leaves', { alert: "" })
});
app.post('/leaves', function(req, res) {
    var f = adding('leaves', req.session.userindex);
    if (f == true) {
        res.render('leaves', { alert: "Book already added" });
    } else if (f == false) {
        res.render('leaves', { alert: "" })
    }
});

app.get('/grapes', function(req, res) {
    res.render('grapes', { alert: "" })
});
app.post('/grapes', function(req, res) {
    var f = adding('grapes', req.session.userindex);
    if (f == true) {
        res.render('grapes', { alert: "Book already added" });
    } else if (f == false) {
        res.render('grapes', { alert: "" })
    }
});

app.get('/flies', function(req, res) {
    res.render('flies', { alert: "" })
});
app.post('/flies', function(req, res) {
    var f = adding('flies', req.session.userindex);
    if (f == true) {
        res.render('flies', { alert: "Book already added" });
    } else if (f == false) {
        res.render('flies', { alert: "" })
    }
});


function adding(s, v) {
    var flag = false;
    for (var i = 0; i < usersdata.users[v].rlist.length; i++) {
        if (usersdata.users[v].rlist[i] == s) {
            flag = true;
        }
    }
    if (flag == false) {
        usersdata.users[v].rlist.push(s);
    }
    fs.writeFileSync("users.json", JSON.stringify(usersdata, null, 2));
    return flag;
}

app.post('/search', function(req, res) {
    var x = '0,' + req.body.Search + ',1';
    res.render('searchresults', { alert: x })
});

app.get('/search', function(req, res) {
    res.render('searchresults', { alert: "" })
});

app.get('/searchresults', function(req, res) {
    res.render('searchresults', { alert: "" })
});

if (process.env.PORT) {
    app.listen(process.env.PORT, function() { console.log('Server started') });
} else {
    app.listen(3000, function() { console.log('Server started on port 3000') });
}