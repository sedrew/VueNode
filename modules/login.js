module.exports = function (app, jsonParser, db, crypto) {
    app.post('/login', jsonParser, function (req, res) {
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        db.get('user').value().forEach(element => {
            if (element.name == req.body.name && element.password == password) {
                res.json(200);
                return true;
            }
        })
        res.json(201);
    });
}