module.exports = function (app,jsonParser,db,logs) {
    app.post('/allMess', jsonParser, function (req, res) {
        logs('Сервер отправляет клиенту сообщения!', 2);
        let arr = db.get('posts').value()
        res.json(arr);
        logs('Сервер отправил сообщения на клиент успешно', 1);
    });
}