module.exports = function (app, jsonParser, db, crypto, logs) {
    app.post('/registration', jsonParser, function (req, res) {
        logs(`Попытка Регистрации с ником ${req.body.name}`, 2);
        let users = db.get('user').value();
        users.forEach(element => {
            if (element.name == req.body.name) {
                res.json(201);
                logs(`Попытка Регистрации с ником ${req.body.name} завершилась неудачно. (201)`, 3);
                return false;
            }
        });
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        db.get('user').push({ name: req.body.name, password: password }).write();
        res.json(200);
        logs(`Попытка Регистрации с ником ${req.body.name} завершилась удачно. (200)`, 1);
    });
}