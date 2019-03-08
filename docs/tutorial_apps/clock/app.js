/*global tizen, tau, window, console */
/*jslint browser: true, nomen: true */
(function (window, document, navigator, localStorage, tau) {
    "use strict";

    var appId,
        element,
        req,
        audio = document.querySelector("audio"),
        watchface = document.getElementById('main'),
        color_range = document.getElementById('cpicker'),
        tempColor = "#fff",
        alarm_page = document.getElementById('alarm'),
        am_pm = document.getElementById('am_pm_toggle'),
        am_pm_info = document.getElementById("ampm"),
        time = document.getElementById("time"),
        alarm_save = document.getElementById('alarm_save'),
        color_save = document.getElementById('color_save'),
        timer;

    /**
     * Clock initialize function.
     */

    function setTime() {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
            nextMove = 1000 - date.getMilliseconds(),
            ampm = hours >= 12 ? 'PM' : 'AM',
            timeString;
        // Displays proper format 12/24h.
        if (localStorage.timeFormat === '12') {
            hours = hours > 12 ? hours - 12 : hours;
            am_pm_info.innerHTML = '';
            am_pm_info.innerHTML = ampm;
            time.className = '';
        } else {
            am_pm_info.innerHTML = '';
            time.className = 'full';
        }

        time.style.color = localStorage.timeColor;

        hours = hours < 10 ? '0' + hours : hours;

        if (localStorage.timeSettings === 'show-seconds') {
            timeString = hours + ':' + minutes + ':' + seconds;
        } else {
            timeString = hours + ':' + minutes;
        }
        time.innerHTML = '';
        time.innerHTML = timeString;


        timer = window.setInterval(function () {
            clearInterval(timer);
            setTime();
        }, nextMove);
    }

    /**
     * Saves proper value of time format to local storage.
     */

    function getAndSetAmPm() {
        if (am_pm.checked === true) {
            localStorage.timeFormat = '24';
        } else {
            localStorage.timeFormat = '12';
        }
        setTime();
    }

    if (navigator.userAgent.search("Tizen") === -1) {
        element = document.getElementById("alarm_li");
        element.parentNode.removeChild(element);
    } else {
        appId = tizen.application.getCurrentApplication().appInfo.id;
        req = tizen.application.getCurrentApplication().getRequestedAppControl();
        audio.src = req.appControl.uri;

        /**
         * Displays popup with alarm.
         */
        if (req.appControl.uri !== null) {
            tau.openPopup('#1btnPopup');
            audio.play();
        }
    }

    if (localStorage.timeSettings === null) {
        localStorage.timeSettings = 'show-seconds';
    }

    if (localStorage.timeFormat === null) {
        localStorage.timeFormat = '12';
    }

    if (localStorage.timeColor === null) {
        localStorage.timeColor = tempColor;
    }
    
    color_range.value = localStorage.timeColor;

    setTime();

    /**
     * Registers listener for back key.
     */
    window.addEventListener('tizenhwkey', function (ev) {
        if (ev.keyName === 'back') {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : '';
            if (pageid === 'main') {
                tizen.application.getCurrentApplication().exit();
            } else {
                window.history.back();
            }
        }
    });

    /**
     * Registers listener for entering settings.
     */
    watchface.addEventListener('vclick', function (ev) {
        var original = ev._originalEvent;
        if (!original || original.type.indexOf("touch") < 0 || original.touches.length > 1) {
            tau.changePage('#settings');
        }
    });

    /**
     * Registers listener for clock color change.
     */
    color_range.addEventListener('change', function () {
        tempColor = this.value;
    });

    /**
     * Registers listener for clock format change.
     */
    am_pm.addEventListener('change', function () {
        getAndSetAmPm();
    });

    /**
     * Registers listener for clock color save.
     */
    color_save.addEventListener('vclick', function () {
        localStorage.timeColor = tempColor;
        tau.changePage('#main');
    });

    /**
     * Registers listener for alarm settings save.
     */
    alarm_save.addEventListener('vclick', function () {
        var alarm_input = document.getElementById('input_webkitui_hiddentime'),
            alarmTime = new Date(),
            alarm,
            appControl;
        tizen.alarm.removeAll();
        alarmTime.setHours(alarm_input.value.split(':')[0]);
        alarmTime.setMinutes(alarm_input.value.split(':')[1]);
        alarmTime.setSeconds(0);
        localStorage.alarmTime =
            alarmTime.getTime() - (alarmTime.getTimezoneOffset() * 60 * 1000);

        alarm = new tizen.AlarmAbsolute(alarmTime);

        // creates ApplicationControl for alarm.
        appControl = new tizen.ApplicationControl(
            'http://tizen.org/appcontrol/operation/main',
            'sounds/sounds_alarm.mp3',
            'audio/*',
            null
        );
        try {
            tizen.alarm.add(alarm, appId, appControl);
        } catch (e) {
            if (console) {
                console.error(e.message, e.stack);
            }
        }
        tau.changePage('#main');
    });

    /**
     * Registers listener for hidden timepicker request.
     */
    alarm_page.addEventListener('pagecreate', function () {
        var btn = document.getElementById('button_webkitui_hiddendateopener'),
            itime = document.getElementById('input_webkitui_hiddentime'),
            val = document.getElementById('webkitui_hiddentime_value');
        btn.addEventListener('vclick', function () {
            itime.click();
        });
        itime.addEventListener('change', function () {
            val.innerText = itime.value;
        });
    });

    /**
     * Registers listener for closing popup.
     */
    document.getElementById('1btnPopup-cancel').addEventListener('vclick', function () {
        tau.closePopup('#1btnPopup');
        audio.pause();
        tizen.alarm.removeAll();
    });

}(window, window.document, window.navigator, window.localStorage, window.tau));
