window.$ = window.jQuery = require('jquery');
window.eval = global.eval = function() {
    throw new Error('Sorry, this app does not support window.eval().');
};
const displayControl = require('display-control'),
    moment = require('moment'),
    schedule = require('node-schedule'),
    settings = require('./settings.json'),
    jobs = [{
        time: settings.times.dawn,
        action: () => {
            selectLight(1);
        }
    }, {
        time: settings.times.morning,
        action: () => {
            selectLight(2);
        }
    }, {
        time: settings.times.day,
        action: displayControl.sleep
    }, {
        time: settings.times.night,
        action: () => {
            selectLight(0);
        }
    }, {
        time: '0:00',
        action: checkAge
    }];
let age, currentLight = -1,
    interval,
    timeout = null;
checkAge();
for (let i in jobs) {
    schedule.scheduleJob(jobs[i].time.split(':').reverse().join(' ') + ' * * *', jobs[i].action);
}
$(document).on('keypress', (key) => {
    switch (key.code) {
        case 'Enter':
            if (timeout === null) {
                currentLight++;
            }
            clearInterval(interval);
            clearTimeout(timeout);
            timeout = null;
            selectLight(currentLight < 3 ? currentLight : -1);
            break;
        case 'KeyQ':
            displayControl.sleep();
            break;
        case 'Space':
            if (timeout === null) {
                $('#redMask, #greenMask').show();
                pulse();
                interval = setInterval(pulse, 1000);
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                clearInterval(interval);
                timeout = null;
                selectLight(currentLight);
            }, age * 60000);
            break;
    }
});

function checkAge() {
    age = moment().diff(moment(settings.birthday), 'years');
}

function pulse() {
    $('#yellowMask').toggle();
}

function selectLight(i) {
    currentLight = i;
    if (timeout === null) {
        $('.mask').show();
        $(`#${['red', 'yellow', 'green'][i]}Mask`).hide();
        displayControl.wake();
    }
}