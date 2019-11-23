
let fan = require('./functions/fan');
module.exports = function (io, fs, db, child_process, logs) {
    let users = 0;
    let rooms;
    io.sockets.on('connection', (socket) => {
        logs("Устройство подключено!", 1);
        users++;
        io.sockets.emit('usersCount', users)
        socket.on('disconnect', data => {
            logs('Устройство отключено!', 4);
            users--;
            io.sockets.emit('usersCount', users);
        });
        socket.on('sendMess', data => {
            let x = db.get('posts').size().value();
            db.get('posts')
                .push({ id: x.toString(), name: data.name, text_mess: data.text_mess })
                .write();
            io.sockets.emit('addMess', data);
        });
        socket.on('remoteFan', data => {
            fan(data);
        });
        socket.on('roomListServer', data => {
            rooms = Object.keys(socket.adapter.rooms);
            let y = [];
            rooms.forEach((item, index) => {
                if (item.length != 20) {
                    y[index] = { rooms: item, clients: socket.adapter.rooms[item].length }; //FIXME пустые объекты,отфильтровать NULL
                }
            });
            console.log("Список комнат,отправляемых на клиент: ",y);
            io.sockets.emit("roomList", y.filter(item=>{return item!=null}));
        });
        socket.on('userJoin', data => {
            socket.join(data.room);
            console.log(`Пользователь зашел в ${data.room} комнату`);
            io.in(data.room).emit('newJoin', "Зашел новый пользователь");
            // socket.broadcast.to(data.room).emit('newJoin', "заше нловый пользователь");
        });
        socket.on('userLeave', data => {
            socket.leave(data.room);
            console.log(`Пользователь покинул ${data.room} комнату`);
            console.log(rooms);
        });
        socket.on('sendMessRoom', data => {
            io.in(data.room).emit('addMessRoom', { name: data.message.name, text_mess: data.message.text_mess });
        })
        socket.on('statistic', data => {
            let timer = setInterval(function () {
                let stat = {
                    temp: null,
                    mem: {
                        allMem: null,
                        usedMem: null,
                        freeMem: null,
                        buffMem: null,
                        sharedMem: null
                    },
                    CPU: null,
                    fan: null
                };
                let temp = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
                let temp_c = (temp / 1000).toFixed(2);
                stat.temp = temp_c;
                child_process.exec('free -m', (error, stdout, stderr) => {
                    var line = stdout.split('\n')[1];
                    line = line.match(/\d+/gm);
                    stat.mem.allMem = +line[0];
                    stat.mem.usedMem = +line[1];
                    stat.mem.freeMem = +line[2];
                    stat.mem.buffMem = +line[4];
                    stat.mem.sharedMem = +line[3];
                    child_process.exec(`ps aux | awk '{s += $3} END {print s "%"}'`, (error, stdout, stderr) => {
                        console.log(stdout.slice(0, -1));
                        stat.CPU = stdout.slice(0, -1);
                        stat.fan = fan();
                        send();
                    })

                });
                function send() {
                    io.sockets.emit('statisticServer', stat);
                }
            }, 1000);
            setTimeout(() => {
                clearInterval(timer);
            }, 200000);
        });
    });
}