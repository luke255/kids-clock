let age, currentLight = -1,
    interval, jobs, settings, timeout = null;
$.getJSON('./settings.json', (data) => {
    settings = data,
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
        time: settings.times.night,
        action: () => {
            selectLight(0);
        }
    }, {
        time: '4:00',
        action: reschedule
    }];
    reschedule();
});
$(document).on('keypress', (key) => {
    switch (key.code) {
        case 'Enter':
            if (timeout === null) {
                currentLight++;
            } else {
                clearInterval(interval);
                clearTimeout(timeout);
                timeout = null;
            }
            selectLight(currentLight < 3 ? currentLight : -1);
            break;
        case 'Space':
            if (currentLight === 1) {
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
            }
            break;
    }
});

function reschedule() {
    age = moment().diff(moment(settings.birthday), 'years');
    let now = moment();
    let tomorrow = moment().add(1, 'day').startOf('day');
    for (let i in jobs) {
        let timeSplit = jobs[i].time.split(':');
        let schedule = getSchedule(now, timeSplit);
        if (now.diff(schedule) > 0) {
            schedule = getSchedule(tomorrow, timeSplit);
        }
        setTimeout(jobs[i].action, moment(schedule).diff());
    }
}

function getSchedule(day, timeSplit) {
    let schedule = day.toArray();
    schedule[5] = schedule[6] = 0;
    schedule[3] = parseInt(timeSplit[0]);
    schedule[4] = parseInt(timeSplit[1]);
    return schedule;
}

function pulse() {
    $('#yellowMask').toggle();
}

function selectLight(i) {
    currentLight = i;
    if (timeout === null) {
        $('.mask').show();
        $(`#${['red', 'yellow', 'green'][i]}Mask`).hide();
    }
}