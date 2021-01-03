// ==UserScript==
// @name         CodinGame Contribution IDE test additional info
// @namespace    https://lopidav.com/
// @version      0.1
// @description  Adds timer and code length counter to contribution testing IDE
// @author       lopidav
// @match        https://www.codingame.com/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    $(document).on('DOMNodeInserted', checkForIdeLoad);

    function checkForIdeLoad(event) {
        if (window.location.pathname.includes('ide/demo')) {
            let eventWrapped = $(event.target);

            if(eventWrapped.is('div.view-line'))
            {
                createCodeCounter();
            }

            if(eventWrapped.is('div.cg-ide'))
            {
                createTimer();
            }

        }
    }

    function createCodeCounter() {
        let code = $(`.lines-content`);
        let codeCount = $(`.codesize-value`);

        if(!$(`div.code-counter`).length) {
            $(`div.code-editor`).append(`<div class="code-counter"> <div class="cg-ide-codesize"> <span translate="ideCodesize.codeSize">Code size:</span><span class="codesize-value">0</span> </div> </div>`);
            codeCount = $(`.codesize-value`);
            $('.cg-ide-code').keypress(updateCount);
        }

        updateCount();

        function updateCount() {
            codeCount.html(code.text().trim().length);
        }
    }

    function createTimer() {
        if(!$(`div.cg-ide-countdown`).length) {
            let timer = $(`div.extra-infos`).append(`<div class="cg-ide-countdown">  <div class="countdown-container">   <span class="countdown-bloc"> <span class="countdown-value minutes">00</span><span class="countdown-unit">MN</span> </span> <span class="countdown-bloc"> <span class="countdown-value seconds">00</span><span class="countdown-unit">SC</span> </span> </div> </div>`);

            let timerSeconds = $(`span.countdown-value.seconds`);
            let timerMinutes = $(`span.countdown-value.minutes`);

            let seconds = 0;
            let stopped = false;

            let timerId;

            timer.css("cursor", "pointer");
            $('.countdown-bloc').css('color','');

            startTicking();

            timer.click(function() {
                if (timerId){
                    stopTicking();
                } else {
                    startTicking();
                }
            });

            timer.dblclick(function() {
                stopTicking();
                resetTimer();
            });

            function startTicking() {
                timerId = setInterval(tick, 1000);
            }

            function stopTicking() {
                clearInterval(timerId);
                timerId = 0;
            }

            function tick() {
                seconds++;
                timerSeconds.html(Math.abs(seconds%60).toString().padStart(2,0));
                timerMinutes.html(Math.floor(seconds/60).toString().padStart(2,0));
                switch (seconds) {
                    case 60*14:
                        timer.children().children().children().children().css('color', '#ed492d');
                        break;
                    case 60*15:
                        timer.children().children().children().children().css('color', '#c9b94b');
                        break;
                    case 0:
                        timer.children().children().children().children().css('color', '#1a99aa');
                        break;
                }
            }

            function resetTimer() {
                seconds = 0;
                timerSeconds.html('00');
                timerMinutes.html('00');
                timer.children().children().children().children().css('color', '#1a99aa');
            }
        }
    }

})()
