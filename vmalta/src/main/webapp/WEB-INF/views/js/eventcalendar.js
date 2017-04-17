
function setLinks(currentYear, currentMonth, calendarObject) {
    calendarObject.find('table td:not(.ui-datepicker-other-month)').each(function () {
        var dayNumber = $(this).children('a').text();

        for (var year in dateArray) {
            //Check the year
            if (dateArray[year][0] == currentYear) {
                for (var days in dateArray[year][1][currentMonth][1]) {
                    if (dayNumber == dateArray[year][1][currentMonth][1][days][0]) {
                        $(this).children('a').attr('href', dateArray[year][1][currentMonth][1][days][1]);
                        $(this).removeAttr('onclick');
                    }
                }
            }
        }

    });
}

$(function () {

    daysShortArray = [];
    for (var x in daysArray) {
        daysShortArray.push(daysArray[x].charAt(0));
    }

    $("#event_calendar .calendar_container").datepicker({
        dateLinks: true,
        dateLng: $("#hdnLng input").val(),
        nextText: "Next",
        prevText: "Previous",
        dayNames: daysArray,
        dayNamesMin: daysShortArray,
        monthNames: monthsArray,
        firstDay: 1,
        showOtherMonths: true,
        beforeShowDay: function (date) {
            for (var year in dateArray) {
                //Check the year
                if (dateArray[year][0] == date.getFullYear()) {
                    for (var days in dateArray[year][1][date.getMonth()][1]) {
                        if (date.getDate() == dateArray[year][1][date.getMonth()][1][days][0]) {
                            return [true, 'hasEvent'];
                        }
                    }
                }
            }

            return [true, ""]; //enable all other days
        },
        onChangeMonthYear: function (a, b, c) {
            setTimeout(function () {
                setLinks(a, b - 1, c.dpDiv);
                //c.dpDiv.find('.ui-datepicker-month').wrap('<a href="search-events?pg=1&from=01-03-2012&to=31-03-2012">');
            }, 50);

        },
        onSelect: function (a, b, c) {
        }
    });

    //var datepickerYear = ($("#event_calendar .calendar_container").datepicker('getDate').getMonth());

    var datepickerYear = ($("#event_calendar .calendar_container").datepicker('getDate').getFullYear());
    var datepickerMonthNo = ($("#event_calendar .calendar_container").datepicker('getDate').getMonth());

    /* Commented by Kevin (2012-09-07) */
    //    var monthNames = ["January", "February", "March", "April", "May", "June",
    //    "July", "August", "September", "October", "November", "December"];

    //    var datepickerMonth = $("#event_calendar .ui-datepicker-month").text();
    //    var datepickerYear = $("#event_calendar .ui-datepicker-year").text();
    //    var datepickerMonthNo;

    //    for (var x in monthNames) {
    //        if (monthNames[x] == datepickerMonth) {
    //            datepickerMonthNo = x;
    //            break;
    //        }
    //    }

    setLinks(datepickerYear, datepickerMonthNo, $("#event_calendar"));
    //$("#event_calendar").find('.ui-datepicker-month').wrap('<a href="search-events?pg=1&from=01-03-2012&to=31-03-2012">');
});