const fs = require('fs');
module.exports = function logs(ev, id) {
    console.log(ev);
    let color = 'primary';
    if (id == 1) {
        color = 'success';
    } else if (id == 2) {
        color = 'primary';
    } else if (id == 3) {
        color = 'danger';
    } else if (id == 4) {
        color = 'warning';
    }
    let time = new Date().toString().slice(8, -24);
    ev = `<p>${ev} <span class="badge badge-pill badge-${color}">${time}</span></p>` + '\n';
    fs.appendFile('logs.log', ev, () => { console.log('Событие залогировалось.') });
}
