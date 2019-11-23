module.exports = function (app,jsonParser,fs,crypto,server,logs) {
    app.post('/adpanel', jsonParser, (req, res) => {
        logs('Попытка войти в админ панель под админом', 4);
        console.log(req.body.name);
        if (req.body.name == 'Danet') {
            logs('Пользователь зашел под админом', 1)
            app.post('/logs', jsonParser, (req, res) => {
                let log = fs.readFileSync('logs.log', 'utf8', () => { logs('Логи отправлены', 4) });
                res.json(log);
            });
            app.post('/logclear', jsonParser, (req, res) => {
                fs.writeFileSync('logs.log', '', () => {
                    console.clear();
                });
                logs('Логи очищены.', 4);
            });
            app.post('/stopserver', jsonParser, (req, res) => {
                let name = req.body.name;
                console.log(name);
                let password = req.body.password;
                console.log(password);
                console.log('попытка остановки сервера');
                let hashName = crypto.createHash('md5').update(name).digest('hex');
                let hashPass = crypto.createHash('md5').update(password).digest('hex');
                if (hashName == '21e6941d5fc34c995e9dfd2e7c2d2765' || hashPass == "760ca01802178d6d5ebdb056ab91dadd") {
                    logs('Сервер остановлен Администратором', 3);
                    server.close();
                    res.json(200);
                } else res.json(201);

            });
        }
    })
}