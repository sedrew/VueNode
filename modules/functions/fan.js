const GPIO = require('onoff').Gpio;
const fan = new GPIO(14, 'out');
const fs = require('fs');
let x=1;
console.log(x);
module.exports = function (remote) {
    let temp = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
    let temp_c = (temp / 1000).toFixed(2);
    if (remote == 'start') {
        x = remote;
        console.log(x);
        fan.writeSync(1);
        return fan.readSync();;
    }
    else if (remote == 'stop') {
        x = remote;
        fan.writeSync(0);
        return fan.readSync();;
    }
    else if (remote == 'auto' || x == undefined) {
        x = undefined;
        console.log('Запущено из сервер js');
        if (fan.readSync() !=null && temp_c >= 60) {
            fan.writeSync(1);
            console.log('Вентилятор включен');
            return "auto";
        } else if (fan.readSync() == 1 && temp_c <= 40) {
            fan.writeSync(0);
            console.log('Вентилятор выключен');
            return "auto";
        } else return "auto";
    }
    else return fan.readSync();
}
