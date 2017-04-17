/*GLOBAL VARIABLES FOR ANY BELOW SCRIPTS*/

//********VARIABLES FOR MAP********//
// dynamically loaded functions
var updateLayers;
var GetDirections;

// variables required for GetDirections
var directions = null;
var travelMode;
var oldFrom, oldTo, oldHTML, newHTML, directionTimer;

function redirectLanguage() {
    var bConfirm = confirm('The new version of VISITMALTA.COM is not yet available in the selected language.\nPlease click on CANCEL to stay on this page or click on OK to go to the previous version of the website.\nWe apologise for any inconvenience.');
    if (bConfirm == true) {
        // redirect
        return true;
    }
    else {
        // reset the selected dropdown option
        return false;
    }
}

$(function () {

    var myScrollBar;

    $('.showonmap div.menu_class h1').click(function () {
        $('.showonmap div.scroll').slideToggle('medium');
        $('.showonmap .the_menu').slideToggle('medium', function () { myScrollBar = this; fleXenv.fleXcrollMain(myScrollBar); });
        $('.showonmap h1').toggleClass("arrowup");
    });

    $(".showonmap div.menu_class a.checkuncheck").click(function () {

        if ($(this).hasClass('check')) {
            $(".showonmap div.scroll .LabelSelected").each(function () {
                $(this).toggleClass("LabelSelected");
                document.getElementById($(this).attr("for")).click();
            });

            $(this).removeClass('check').addClass('uncheck');
        }
        return false;
    });

    $(".showonmap div.the_menu > ul.menu > li:has(ul.subLayers)").each(function () {
        var sublayersContainers = $(this).children('.subLayers').addClass('hidden');
        $(this).find('.CheckBoxLabelClassexpandable').click(function () {
            $(this).toggleClass('arrowdown');
            $(this).parent().siblings('.subLayers').toggleClass('hidden');
            setTimeout(function () { updateScroll(myScrollBar); }, 500);
        });
    });

    /* MENU INITIALIZATION*/
    var totalMenuItems = $("#menu > ul > li").length;

    $("#menu > ul > li").mouseenter(function () {
        if ($(this).index() < Math.floor(totalMenuItems / 2)) {
            $(this).addClass("hoverOn left");
        } else { $(this).addClass("hoverOn right"); }
        $(this).mouseleave(function () {
            $(this).removeClass("hoverOn").unbind("mouseleave");
        });
    });

    //SELECT INITIALISATION
    $("select.visitmaltaSelect").each(function () {
        var firstOption = $(this).find("option:selected");
        var htmlString = "";
        if ($(this).hasClass("languagedropdown")) {
            htmlString = "<div class='visitmaltaSelect languagedropdown'><span class='select_optionset'><span>" + firstOption.text() + "</span><img src='file.aspx?f=" + firstOption.attr("class").replace('file', '') + "' /></span><div class='visitmaltaSelect_dropdown'><ul>";
        }
        var optionArray = new Array();
        $(this).children("option").each(function () {
            var x = new Array();
            x.push($(this).text());
            x.push($(this).val());

            if ($(this).attr("class") != null) {
                if ($(this).attr("class").search('file') != -1) {
                    x.push($(this).attr('class'));
                }
            }
            optionArray.push(x);
        });

        if ($(this).hasClass("languagedropdown")) {
            for (var i = 0; i < optionArray.length; i++) {
                if (i == 9) {
                    // if chinese (selected by index not ID)
                    htmlString += "<li><a  href='" + optionArray[i][1] + "' rel='" + optionArray[i][1] + "'><span>" + optionArray[i][0] + "</span>" + (optionArray[i][2] == null ? "<img src='imgs/" + optionArray[i][0] + "flag.png' />" : "<img src='file.aspx?f=" + optionArray[i][2].replace('file', '') + "' />") + "</a></li>";
                    //htmlString += "<li><a onclick=\"return redirectLanguage();\" href='" + optionArray[i][1] + "' rel='" + optionArray[i][1] + "'><span>" + optionArray[i][0] + "</span>" + (optionArray[i][2] == null ? "<img src='imgs/" + optionArray[i][0] + "flag.png' />" : "<img src='file.aspx?f=" + optionArray[i][2].replace('file', '') + "' />") + "</a></li>";
                }
                else {
                    htmlString += "<li><a href='" + optionArray[i][1] + "' rel='" + optionArray[i][1] + "'><span>" + optionArray[i][0] + "</span>" + (optionArray[i][2] == null ? "<img src='imgs/" + optionArray[i][0] + "flag.png' />" : "<img src='file.aspx?f=" + optionArray[i][2].replace('file', '') + "' />") + "</a></li>";
                }
            }
        }


        htmlString += "</ul></div></div>";
        $(this).after(htmlString).hide();
    });

    $("div.visitmaltaSelect").each(function () {
        var selectContainer = $(this);

        var leaveDropdown = function () {
            selectContainer.unbind("mouseleave");
            //selectContainer.click(bringDropdown);
        }

        var bringDropdown = function () {
            if (selectContainer.hasClass("down")) {
                // hide drop down if already extended
                selectContainer.removeClass("down");
                leaveDropdown();
            }
            else {
                // show drop down
                selectContainer.addClass("down");
                selectContainer.mouseleave(bringDropdown);
            }
            //selectContainer.unbind("click");
        }

        $(this).click(bringDropdown);

        if ($(this).hasClass("languagedropdown")) {
            $(this).find(".visitmaltaSelect_dropdown li a").click(function () {
                //                selectContainer.find("span img").attr("src", $(this).find("img").attr("src"));
                //                selectContainer.find("span span").text($(this).text());
                //                leaveDropdown();
            });
        }
    });

    emailModule = $("#photogallery_email");

    $(".datepicker").datepicker({
        showOn: "both",
        buttonImage: "imgs/icons/calendar.png",
        dateFormat: "dd/mm/yy",
        buttonImageOnly: true
    });

    //FAVOURITES PAGE
    if ($(".favourites").length > 0) {
        $("#sub-middle-panel .favourites > div").each(function () {
            var panelContainer = $(this);
            if (panelContainer.find('li.tab').length > 4) {
                panelContainer.jCarouselLite({
                    btnNext: panelContainer.find('.next'),
                    btnPrev: panelContainer.find('.prev'),
                    vertical: true,
                    visible: 4,
                    circular: false,
                    scroll: 4,
                    afterEnd: function (a) {
                        if (a.eq(0).index() != 0) {
                            panelContainer.find(".prev").slideDown(400, 'easeInOutCirc');
                        } else { panelContainer.find(".prev").slideUp(400, 'easeInOutCirc'); }
                        if (a.eq(3).index() == panelContainer.find(".dayContainer li").length - 1) {
                            panelContainer.find(".next").slideUp(400, 'easeInOutCirc');
                        } else { panelContainer.find(".next").slideDown(400, 'easeInOutCirc'); }
                    }
                });
            } else {
                panelContainer.children('.expand').remove();
            }
        });

        $("#sub-middle-panel > .favourites h2 a").click(function () {
            var status = $(this);
            var container = status.parent().siblings('div');

            if (status.hasClass("status_minus")) {
                status.removeClass("status_minus").addClass("status_plus");
                container.slideUp();
            } else {
                status.removeClass("status_plus").addClass("status_minus");
                container.slideDown();
            }


            return false;
        });
    }

    $(".360").click(function () {
        if ($("#malta360").length <= 0) {
            $('body').append('<div style="display: none;"><div id="malta360" style="width:800px;height:500px;overflow:auto;"><div id="panorama" style="background-color: #efefef; height: 500px"></div></div></div>');
        }

        if ($("#360Trigger").length <= 0) {
            $('body').append('<a style="display:none;" id="360Trigger" href="#malta360" title="' + $(this).attr('title') + ' ">Pano</a>');
        }

        loadPanorama('panorama', $(this).attr('href').replace("#", ""), 8, 1, 1);

        $("#360Trigger").fancybox({
            'titlePosition': 'inside',
            'transitionIn': 'none',
            'transitionOut': 'none'
        });
        $('#360Trigger').trigger('click');
    });

    $("#topcontainer .gis_map > .googleMap > .icons .icon-save:not(.notavailable), #topcontainer .gis_map > .googleMap > .icons .icon-email").fancybox({
        'showCloseButton': false,
        'transitionIn': 'none',
        'transitionOut': 'none',
        'overlayColor': '#FFF',
        'titleShow': false,
        'centerOnScroll': true
    });

    $(".opening_text").each(function () {
        if (($(this).html() == "") || ($(this).html() == "&nbsp;")) {
            $(this).hide();
        }
    });

    $("#allalerts").css("overflow", "hidden");

    $("ul#alerts").cycle({
        fx: 'scrollLeft',
        pause: 1
    });
    $(".blacknewsbox").each(function () {
        var buttonsContainer = $(this).next();
        $(this).cycle({
            fx: 'fade',
            speed: 'fast',
            timeout: 0,
            next: $(this).next().find('.blackbox_next'),
            prev: $(this).next().find('.blackbox_prev'),
            before: function (a, b, c) {
                var articleLink = $(b).find('input[type="hidden"]').val();
                if (articleLink != null) {
                    buttonsContainer.find('.blackbox_button').removeAttr('hidden');

                    if (articleLink.indexOf('LeavingWebsiteDialogue') == -1) {
                        buttonsContainer.find('.blackbox_button').attr('href', articleLink);
                    } else {
                        buttonsContainer.find('.blackbox_button').attr('href', 'javascript:' + articleLink);
                    }
                } else {
                    buttonsContainer.find('.blackbox_button').attr('hidden', 'hidden');
                }
            }
        });
    });
    $(".content_slider").each(function () {
        $(this).cycle({
            fx: 'fade',
            speed: 'fast',
            timeout: 0,
            next: $(this).next().find('.blackbox_next'),
            prev: $(this).next().find('.blackbox_prev')
        });
    });
    $(".blacknewsbox").each(function () {
        $(this).cycle({
            fx: 'fade',
            speed: 'fast',
            timeout: 0,
            next: $(this).next().find('.blackbox_next'),
            prev: $(this).next().find('.blackbox_prev')
        });
    });

    //if (navigator.appVersion.indexOf("MSIE") != -1) {
    if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
        $(".CheckBoxClass input:checkbox").each(function () {
            var theCheckbox = $(this);
            $(this).parentsUntil('li').last().siblings('div.layer').children('label').click(function () {

                var checkuncheck = $(this).parentsUntil('.gis_map').last().find('.checkuncheck');

                if (checkuncheck.hasClass('uncheck')) {
                    checkuncheck.removeClass('uncheck');
                    checkuncheck.addClass('check');
                }

                $(this).toggleClass("LabelSelected");
                document.getElementById($(this).attr("for")).click();

            });
        });
    } else {
        $(".CheckBoxClass input:checkbox").click(function () {

            var checkuncheck = $(this).parentsUntil('.gis_map').last().find('.checkuncheck');

            if (checkuncheck.hasClass('uncheck')) {
                checkuncheck.removeClass('uncheck');
                checkuncheck.addClass('check');
            }

            if ($(this).is(":checked")) {
                $(this).parents("div").next(".layer").find("label").addClass("LabelSelected");
            } else {
                $(this).parents("div").next(".layer").find("label").removeClass("LabelSelected");
            }
        });
    }

    $(".RadioClass").change(function () {
        if ($(this).is(":checked")) {
            $(".RadioSelected:not(:checked)").removeClass("RadioSelected");
            $(this).next("label").addClass("RadioSelected");
        }
    });


    /*$(".calendar_container").datepicker( //#mainpage_calendar removed selector to work on all pages
    {
    nextText: "<img src='imgs/arrow_next.gif' alt='Next' />",
    prevText: "<img src='imgs/arrow_prev.gif' alt='Previous' />",
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    dateFormat: "dd/mm/yy",
    firstDay: 1,
    showOtherMonths: true
    });*/

    var bannerUrl = $(".slider_wrapper .bannerUrl").text();
    var xmlPath = $(".slider_wrapper .xmlflashUrl").text();

    var flashvars = { 'xmlpath': encodeURIComponent(xmlPath) },
                params = { wmode: "transparent" },
                attributes = {};

    // get the width and height of the parent container
    width = "930";
    height = $(".slider_wrapper").height();

    if (bannerUrl != "") {
        swfobject.embedSWF(bannerUrl, "sliderContainer", width, height, "9.0.0", "http://www.visitmalta.com/swf/expressInstall.swf", flashvars, params, attributes);
    }

    //GMAP.JS
    // show the route area
    $(".infoWindow .infoWindowDirections").click(function () {
        // title contains the name of the destination
        var title = $(this).attr('title');
        $(this).parents(".gMap").find(".destination .txtDestination").val(title);

        // destination contains the GLatLng of the destination
        var destination = $(this).attr('href');
        $(this).parents(".gMap").find(".destination .hdnDestination").val(destination);

        // show/hide the div
        $(this).parents(".gMap").find(".route").show();
        $(this).parents(".gMap").find(".routeSteps").html('');

        if ($(this).parents(".gMap").find(".source .hdnSource").val() != "") {
            GetDirections($(this).parents(".gMap").find(".source .hdnSource").val(), $(this).parents(".gMap").find(".destination .hdnDestination").val());
        }

        fleXenv.fleXcrollMain($(this).parents(".gMap").find(".route .directions_info")[0]);

        return false;
    });

    // expand sub layers
    $(".layer").click(function () {
        if (!$(this).parent().children(".subLayers").is(":visible")) {
            $(this).children(".expandable").removeClass("expandable").addClass(" expanded");
        }
        else {
            $(this).children(".expanded").removeClass("expanded").addClass(" expandable");
        }
        //$(this).parent().children(".subLayers").slideToggle();
    });

    // search textbox focus
    $(".searchBox").focus(function () {
        if ($(this).val() == "Search") {
            $(this).val("");
        }

        toggleSearchIcon($(".search"), true);
    });

    // search textbox focus
    $(".searchBox").blur(function () {
        if ($(this).val() == "") {
            $(this).val("Search");
        }

        $(".search").click();
    });

    // search textbox 
    $(".searchBox").keyup(function (event) {
        // enter
        if (event.keyCode == 13) {
            $(".searchBox").blur();
        }
    });

    $(".source").keyup(function (event) {
        // enter
        if (event.keyCode == 13) {
            $(this).find(".hdnSource").val($(this).find(".txtSource").val());
            $(this).parent("div").next(".findButton").click();
        }
    });

    $(".destination").keyup(function (event) {
        // enter
        if (event.keyCode == 13) {
            $(this).find(".hdnDestination").val($(this).find(".txtDestination").val());
            $(this).parent("div").next(".findButton").click();
        }
    });

    // search button 
    $(".search").click(function () {
        toggleSearchIcon($(this), false);
        updateLayers($(this));
    });

    // check/uncheck a checkbox
    $(".layerCheckbox :checkbox").click(function () {

        updateLayers($(this));

        // check/uncheck all sublayer checkboxes
        var subLayerCheckboxes = $(this).parent().parent().parent().find(".subLayers .layerCheckbox :checkbox")
        subLayerCheckboxes.prop("checked", $(this).is(":checked"));

        for (var i = 0; i < subLayerCheckboxes.length; i++) {
            updateLayers(subLayerCheckboxes[i]);
        }
    });


    // get the route and directions
    $(".findButton").click(function () {
        if ($(this).siblings(".active").length == 0) {
            if (travelMode == google.maps.TravelMode.WALKING) {
                $(this).siblings('.directionsWalk').addClass('active');
            }
            else if (travelMode == google.maps.TravelMode.DRIVING) {
                $(this).siblings('.directionsCar').addClass('active');
            }
        }
        GetDirections($(this).parents(".gMap").find(".source .hdnSource").val(), $(this).parents(".gMap").find(".destination .hdnDestination").val());
    });

    // hide the info window on close
    $(".infoWindow .windowClose").click(function () {
        $(this).parents(".infoWindow").css('top', '-9999px').hide();
        return false;
    });

    // hide the directions
    $(".route .windowClose").click(function () {
        // remove the directions on close
        if (directionsDisplay != null) {
            directionsDisplay.setMap();
            directions = null;
        }
        $(".route").slideUp(500, "easeInOutSine");
        return false;
    });

    // travel mode
    $(".route .directionsWalk").click(function () {
        travelMode = google.maps.TravelMode.WALKING;
        GetDirections($(this).parents(".gMap").find(".source .hdnSource").val(), $(this).parents(".gMap").find(".destination .hdnDestination").val());
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    $(".route .directionsCar").click(function () {
        travelMode = google.maps.TravelMode.DRIVING;
        GetDirections($(this).parents(".gMap").find(".source .hdnSource").val(), $(this).parents(".gMap").find(".destination .hdnDestination").val());
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    // hide the images in the layer panel
    $(".layerImage").hide();

    // update the hidden variable on blur
    $(".destination .txtDestination").blur(function () {
        $(this).parents(".gMap").find(".destination .hdnDestination").val($(this).val());
    });

    // update the hidden variable on blur
    $(".source .txtSource").blur(function () {
        $(this).parents(".gMap").find(".source .hdnSource").val($(this).val());
    });

    // swap the from/to directions
    $(".directions_swap").click(function () {
        var destinationValue = $(this).parents(".gMap").find(".destination .hdnDestination").val();
        var destinationText = $(this).parents(".gMap").find(".destination .txtDestination").val();
        var sourceValue = $(this).parents(".gMap").find(".source .hdnSource").val();
        var sourceText = $(this).parents(".gMap").find(".source .txtSource").val();

        $(this).parents(".gMap").find(".destination .hdnDestination").val(sourceValue);
        $(this).parents(".gMap").find(".source .hdnSource").val(destinationValue);

        $(this).parents(".gMap").find(".destination .txtDestination").val(sourceText);
        $(this).parents(".gMap").find(".source .txtSource").val(destinationText);

        // swap read only
        if ($(this).parents(".gMap").find(".destination .txtDestination").prop('disabled')) {
            $(this).parents(".gMap").find(".destination .txtDestination").prop('disabled', false);
            $(this).parents(".gMap").find(".source .txtSource").prop('disabled', true);
        }
        else {
            $(this).parents(".gMap").find(".destination .txtDestination").prop('disabled', true);
            $(this).parents(".gMap").find(".source .txtSource").prop('disabled', false);
        }

        GetDirections($(this).parents(".gMap").find(".source .hdnSource").val(), $(this).parents(".gMap").find(".destination .hdnDestination").val());
        return false;
    });

    $("#topcontainer .icons .icon-close").click(function () {
        $("#topcontainer .gMapContainer").animate({
            opacity: 0
        }, 500, function () {
            $(this).addClass("startingPosition");
            $("#slider").css("opacity", 0).removeClass("hidden").animate({
                opacity: 1
            }, 500);
        });

        return false;
    });

    // if it is set to show the map first
    $(".hdnShowMap").each(function () {
        if ($(this).val() == "true") {
            $(".viewonmap").click();
        }
    });

    var inputContainer = $(".gis_map .gis_map_directions .directions_form .directions_inputs");
    inputContainer.children(".directions_from").val("From");
    inputContainer.children(".directions_to").val("To");

});

//FUNCTIONS
//GMAP.JS
// checks the layer checkbox with the given layerID
function checkLayer(layerID) {
    // check the checkbox
    var checkbox = $(".layers input[value=" + layerID + "]").parent().children(".layerCheckbox").children(":checkbox");
    checkbox.prop("checked", true);
    // update the label
    $(checkbox).parents("div").next(".layer").find("label").addClass("LabelSelected");
}

// success message
function successMessage(gMap, title, text) {
    var errorBox = $(gMap).parents(".gMap").find(".gis_maperror");

    errorBox.fadeIn();
    errorBox.find('.errorTitle').text(title);
    errorBox.find('.errorText').text(text);
    errorBox.find('.btn_close').focus();
    errorBox.find('.btn_close').unbind('click').click(function() {
        errorBox.fadeOut();
    });
}

// error message
function errorMessage(gMap, title, text) {
    var errorBox = $(gMap).parents(".gMap").find(".gis_maperror");

    errorBox.fadeIn();
    errorBox.find('.errorTitle').text(title);
    errorBox.find('.errorText').text(text);
    errorBox.find('.btn_close').focus();
    errorBox.find('.btn_close').unbind('click').click(function() {
        errorBox.fadeOut();
    });
}

// registers the map server events
function registerServerEvent(eventName, control, args) {
    var ev = new serverEvent(eventName, control);
    ev.addArg(args);
    ev.send();
}

// shows an info window
function showPhotoWindow(infoWindow, title, summary, howToGetThere, image, url, latlng) {
    $(infoWindow).addClass("photoLayer");
    showInfoWindow(infoWindow, title, summary, howToGetThere, image, url, latlng);
}



// shows the static info window
function showInfoWindow(infoWindow, title, summary, howToGetThere, image, url, latlng) {
    $(infoWindow).show();

    var img = new Image();

    $(img)
        .load(function() {
            $(this).addClass('infoWindowImage');
            $(this).removeAttr('width height');
            $(".infoWindowImage", infoWindow).remove();
            $('.infoWindowDescription', infoWindow).prepend($(this));

            $(infoWindow).find(".infoWindowSummary").text(summary);
            $(infoWindow).find(".infoWindowTitle").text(title);
            // how to get there
            if (howToGetThere == "") {
                $(infoWindow).find(".infoWindowHowTo").hide();
            }
            else {
                $(infoWindow).find(".infoWindowHowTo").show();
                $(infoWindow).find(".infoWindowHowToGetThere").text(howToGetThere);
            }
            $(infoWindow).find(".infoWindowReadMore").attr("href", url);
            $(infoWindow).find(".infoWindowDirections").attr("title", title);
            $(infoWindow).find(".infoWindowDirections").attr("href", latlng);


            //Calculation for Window Centering
            var infowindowHeight = $(infoWindow).height();
            var topCalculation = 176 - (infowindowHeight / 2);
            $(infoWindow).css('top', topCalculation);
        })
        .error(function() {
            $(".infoWindowImage", infoWindow).remove();
            $(infoWindow).find(".infoWindowSummary").text(summary);
            $(infoWindow).find(".infoWindowTitle").text(title);
            // how to get there
            if (howToGetThere == "") {
                $(infoWindow).find(".infoWindowHowTo").hide();
            }
            else {
                $(infoWindow).find(".infoWindowHowTo").show();
                $(infoWindow).find(".infoWindowHowToGetThere").text(howToGetThere);
            }
            $(infoWindow).find(".infoWindowReadMore").attr("href", url);
            $(infoWindow).find(".infoWindowDirections").attr("title", title);
            $(infoWindow).find(".infoWindowDirections").attr("href", latlng);

            //Calculation for Window Centering
            var infowindowHeight = $(infoWindow).height();
            var topCalculation = 176 - (infowindowHeight / 2);
            $(infoWindow).css('top', topCalculation);
        })
        .attr({ 'src': image, 'alt': title });

    //$(infoWindow).find(".infoWindowImage").attr("src", image);
    //$(infoWindow).find(".infoWindowImage").attr("alt", image);

}

// retrieves the JSON object representing the markers on the page
function getMarkers(markersObject) {
    var markers = $(markersObject).val();
    if (markers != "") {
        return JSON.parse(markers);
    }
    else {
        return [];
    }
}

// inserts the given marker into the JSON object on the page
function insertMarker(markersObject, marker) {
    var markers = getMarkers(markersObject);
    markers.push(marker);
    $(markersObject).val(JSON.stringify(markers));
}

// on marker hover
function markerHoverBubble(googleTitle) {

    var tooltip;

    if ($("body > form > .tooltip").length == 0) {
        tooltip = $(document.createElement('div')).addClass('tooltip').css({ 'display': 'none', opacity: 0 }).html('<span class="tooltipContent"></span>');
        $("body > form").append(tooltip);
    } else {
        tooltip = $("body > form > .tooltip");
    }

    tooltip.find('.tooltipContent').text(googleTitle);

    tooltip.show();
    tooltip.stop().animate({
        opacity: 1
    }, 300);

    if (($.data($('body').get(0), 'events') == null) || ($.data($('body').get(0), 'events').mousemove == null)) {
        $('body').mousemove(function(event) {
            tooltip.css({
                left: event.pageX + 15,
                top: event.pageY + 15
            });
        });
    }
}

// on marker mouse out
function markerOut() {
    var tooltip = $("body > form > .tooltip");
    tooltip.stop().animate({ opacity: 0 }, 300, function() {
        $('body').unbind('mousemove');
        $(this).hide();
    });

}

// on marker hover
function markerHover(coordinateID, markers) {
    // go through the markers
    for (var j = 0; j < markers.length; j++) {
        // if the coordinate ID matches 
        if (coordinateID == markers[j].ID) {
            // get the marker title
            var coordinate = {
                "ID": "Coordinate_" + markers[j].ID,
                "Title": markers[j].Title
                //"LayerID": markers[j].LayerID,
                //"ImageUrl": markers[j].ImageUrl,
                //"Summary": markers[j].Summary,
                //"Url": markers[j].Url,
                //"Points": markers[j].Points
            };
            break;
        }
    }
    markerHoverBubble(coordinate.Title);
}

// creates the static map
function updateImage(staticMapImg, staticMapUrl, gMap, markers, errorFunction, startPositionMarker) {
    var baseUrl = "http://maps.google.com/maps/api/staticmap?";

    var params = [];
    var markerParams = [];

    if (startPositionMarker == null) {
        params.push("center=" + gMap.getCenter().lat().toFixed(6) + "," + gMap.getCenter().lng().toFixed(6));
    } else {
        params.push("center=" + markers[startPositionMarker].Points[0].Latitude + "," + markers[startPositionMarker].Points[0].Longitude);
    }
    params.push("zoom=" + gMap.getZoom());

    // markers
    var staticMarkersArray = [];
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].Visible != false) {
            if (markers[i].Points.length > 0) {
                if (markers[i].Points.length > 1) {
                    // polygon
                    var fillColor = "fillcolor:0x0099FF";
                    var polyColor = "color:0x0033FF";
                    var polyWeight = "weight: 2";
                    var polyParams = fillColor + "|" + polyColor + "|" + polyWeight;
                    var polyLatLngs = [];

                    for (var j = 0; j < markers[i].Points.length; j++) {
                        polyLatLngs.push(markers[i].Points[j].Latitude + "," + markers[i].Points[j].Longitude);
                    }
                    polyLatLngs.push(markers[i].Points[0].Latitude + "," + markers[i].Points[0].Longitude);

                    params.push("path=" + polyParams + "|" + polyLatLngs.join("|"));
                }
                else {
                    // marker
                    //staticMarkersArray.push("icon:" + encodeURI("http://new.visitmalta2011.dev.alert.com.mt/layerImage.ashx?l=1&c=1&id=" + markers[i].LayerID ) + "%7C" + markers[i].Points[0].Latitude + "," + markers[i].Points[0].Longitude);
                    staticMarkersArray.push(markers[i].Points[0].Latitude + "," + markers[i].Points[0].Longitude);
                }
            }
        }
    }

    // create markers url
    if (staticMarkersArray.length) {
        var staticMarkersString = markerParams.join("|");
        if (markerParams.length) {
            staticMarkersString += "|";
        }
        staticMarkersString += staticMarkersArray.join("|");
        params.push("markers=" + staticMarkersString);
    }

    if (gMap.getMapTypeId() == 'SATELLITE') {
        params.push("maptype=satellite");
    }
    if (gMap.getMapTypeId() == 'HYBRID') {
        params.push("maptype=hybrid");
    }
    if (gMap.getMapTypeId() == 'TERRAIN') {
        params.push("maptype=terrain");
    }

    // path
    if (directions != null && false == true) {

        var route = new google.maps.Polyline({
			path: [],
			strokeColor: '0x0000FF80',
			strokeWeight: 5
		});

        var path = directionsDisplay.directions.routes[0].overview_path;
        for (var i = 0; i < path.length; i++) {
            route.getPath().push(new google.maps.LatLng(Number(path[i].lat().toFixed(6)), Number(path[i].lng().toFixed(6))));
        }
        if (route == null || route.getPath().length > 80) {
            errorFunction("route");
        }
        else {
            // complete route
            var pathColor = "color:0x0000FF80";
            var pathWeight = "weight: 5";
            var pathParams = pathColor + "|" + pathWeight;

            params.push("path=" + pathParams + "|" + route.getPath().getArray().join("|"));

            //        var extraParams = [];
            //        extraParams.push("center=" + route.getVertex(0).toUrlValue(5));
            //        extraParams.push("path=" + pathParams + "|" + pathLatLngs.join("|"));
            //        extraParams.push("zoom=" + 15);
            //        addImg(baseUrl + "&" + extraParams.join("&") + "&size=320x340&sensor=false", "staticMapStartIMG");

            //        var extraParams = [];
            //        extraParams.push("center=" + route.getVertex(route.getVertexCount() - 1).toUrlValue(5));
            //        extraParams.push("zoom=" + 15);
            //        extraParams.push("path=" + pathParams + "|" + pathLatLngs.join("|"));
            //        addImg(baseUrl + "&" + extraParams.join("&") + "&size=320x340&sensor=false", "staticMapEndIMG");
        }
    }

    params.push("size=" + "640" + "x" + "380");
    var img = document.createElement("img");
    var imgSrc = baseUrl + params.join("&") + "&sensor=false";

    if (imgSrc.length > 1900) {
        errorFunction("markers");
    }
    else {
        img.src = imgSrc;

        // image
        if (staticMapImg.length > 0) {
            $(staticMapImg)[0].innerHTML = "";
            $(staticMapImg)[0].appendChild(img);
        }

        // url
        if (staticMapUrl.length > 0) {
            $(staticMapUrl).val(baseUrl + params.join("&") + "&sensor=false");
        }
    }
}

// adds the img to the given ID
function addImg(url, id) {
    var img = document.createElement("img");
    img.src = url;
    document.getElementById(id).innerHTML = "";
    document.getElementById(id).appendChild(img);
}

// prints the node
function printSelection(node) {
    var content = ""

    for (var i = 0; i < node.length; i++) {
        content = content + node[i].innerHTML + "<br />";
    }

    $('body').append('<div class="printmap" />');

    var printmap = $('.printmap');
    printmap.append(content);

    /*
    var pwin = window.open('', 'print_content', 'width=930,height=640');
    pwin.document.open();
    pwin.document.write('<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html><head><link href="css/gismapcss.css" rel="stylesheet" type="text/css" /></head><body>' + content + '</body></html>');
    */

    // re-draw the dynamic canvas
    if ($("canvas", printmap).length > 0) {

        var canvasParents = $("div:has(> canvas)", printmap);
        $("canvas", printmap).remove();

        var canvasOriginal = $("div:has(> canvas)", node);

        canvasOriginal.each(function (index) {
            var myCanvas = $(this).children('canvas');
            var originalContext = myCanvas[0].getContext("2d");

            try {
                var newCanvas = myCanvas.clone();
                newCanvas[0].getContext('2d').drawImage(myCanvas[0], 0, 0);
                canvasParents.eq(index).append(newCanvas);
            } catch (ex) { alert(ex); }
            /*
            var attributes = myCanvas.prop("attributes");

            var canvasClone = $('<canvas/>');

            // loop through <select> attributes and apply them on <div>
            $.each(attributes, function () {
            canvasClone.attr(this.name, this.value);
            });
            */
            //var dataURL = myCanvas.clone()[0].toDataURL();

            //var imageData = originalContext.getImageData(0, 0, originalContext.canvas.width, originalContext.canvas.height);






            /*var img = new Image;
            img.onload = function () {
            canvasClone[0].getContext('2d').drawImage(img, 0, 0); // Or at whatever offset you like
            };
            img.src = dataURL;*/

            //canvasClone[0].getContext('2d').drawImage(myCanvas[0], 0, 0);
            //canvasClone.appendTo(canvasParents.eq(index));

            //canvasClone[0].getContext("2d").putImageData(imageData, 0, 0);
        });

        
        /*
        canvasOriginal.clone().appendTo(canvasParent);

        canvasOriginal.each(function() {
        var originalContext = $(this)[0].getContext("2d");
        var imageData = originalContext.getImageData(0, 0, originalContext.canvas.width, originalContext.canvas.height);
        var cloneContext = canvasParent.find('canvas').eq($(this).parent().index())[0].getContext("2d");

        cloneContext.putImageData(imageData, 0, 0);
        });*/
    } else {

    }

    setTimeout(function () { window.print(); printmap.remove(); }, 500);
    //pwin.document.close();
    //setTimeout(function () { pwin.close(); }, 1000);
}

function toggleLoader(mapNode) {
    var loaderObject = $(mapNode).parentsUntil('.gMap').find('.ajaxloader');
    if (loaderObject.is(':visible')) {
        loaderObject.stop().animate({
            'opacity': 0
        }, 300, function() { $(this).hide(); });
    } else {
        loaderObject.show().css('opacity', 0).stop().animate({
            opacity: 0.8
        }, 300);
    }
}



function toggleSearchIcon(searchBox, bShow) {
    if (bShow != true) {
        $(searchBox).removeClass("activesearch");
    }
    else {
        $(searchBox).addClass("activesearch");
    }
}

// Weather 

$.jmsajaxurl = function(options) {
    var url = options.url;
    url += "/" + options.method;
    if (options.data) {
        var data = ""; for (var i in options.data) {
            if (data != "")
                data += "&"; data += i + "=" +
                                                JSON.stringify(options.data[i]);
        }
        url += "?" + data; data = null; options.data = "{}";
    }
    return url;
};


function getCurrentConditions(lang) {

    if (lang == "EN") {

        var url = "https://apps.alert.com.mt/WeatherService/Service.svc/GetCurrentConditions/EN/Luqa/Malta.json?callback=?";
        var myData;
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                myData = data;
                var farenheit = Math.round((myData.TemperatureInCelsius * 2) - (myData.TemperatureInCelsius * 2 / 10) + 32);
                var imagecontainer = $('#header #loginArea .weather .weather_data');

                switch (myData.weatherConditionID) {
                    case 0:
                        break;

                    case 1:
                        imagecontainer.html('<img src="imgs/weather/icon.partlycloudy.png" title="Partly Cloudly" alt="Partly Cloudy" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p >' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 2:
                        imagecontainer.html('<img src="imgs/weather/icon.mostlycloudy.png" title="Mostly Cloudly" alt="partly cloudy" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 3:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Rainy" alt="Rainy" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 4:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Snow" alt="Snow" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p >' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 5:
                        imagecontainer.html('<img src="imgs/weather/icon.sunny.png" title="Sunny" alt=" Sunny" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 6:
                        imagecontainer.html('<img src="imgs/weather/icon.sunny.png" title="Clear" alt="Clear" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 7:
                        imagecontainer.html('<img src="imgs/weather/icon.fog.png" title="Fog" alt="Fog" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 8:
                        imagecontainer.html('<img src="imgs/weather/icon.thunderstorm.png" title="Thunderstorms" alt="Thunderstorms" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 9:
                        imagecontainer.html('<img src="imgs/weather/icon.windy.png" title="Windy" alt="Windy" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 10:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Chance Flurries" alt="Chance Flurries" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 11:
                        imagecontainer.html('<img src="imgs/weather/icon.drizzle.png" title="Chance Rain" alt="Chance Rain" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 12:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Chance Sleet" alt="Chance Sleet" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 13:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Chance Snow" alt="Chance Snow" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');

                        break;

                    case 14:
                        imagecontainer.html('<img src="imgs/weather/icon.thunderstorm.png" title="Chance ThunderStorms" alt="Chance ThunderStorms" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 15:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Flurries" alt="Flurries" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 16:
                        imagecontainer.html('<img src="imgs/weather/icon.fog.png" title="Fog" alt="Fog" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 17:
                        imagecontainer.html('<img src="imgs/weather/icon.sunny.png" title="Mostly Sunny" alt="Mostly Sunny" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 18:
                        imagecontainer.html('<img src="imgs/weather/icon.sunny.png" title="Partly Sunny" alt="Partly Sunny" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 19:
                        imagecontainer.html('<img src="imgs/weather/icon.rainy.png" title="Sleet" alt="Sleet" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p >' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;

                    case 20:
                        imagecontainer.html('<img src="imgs/weather/icon.cloudly.png" title="Cloudy" alt="Cloudy" width="45" height="21" style="margin:3px 5px 0 0;">' + '<p>' + myData.TemperatureInCelsius + '°c' + '/' + farenheit + '°F' + '</p>');
                        break;
                }
            },
            async: false
        });


    }

    if (lang == "MT") {
        var url2 = "https://apps.alert.com.mt/WeatherService/Service.svc/GetCurrentConditions/MT/Luqa/Malta.json?callback=?";
        $.getJSON(url2, null, function(data) {
            document.write(JSON.stringify(data));
        });
    }

    return myData;
}

$(document).ready(function() {
    var x = getCurrentConditions("EN");
});

$(document).ready(function() {

    var weather_container = $('#header #loginArea .weather');
    var animated = false;

    weather_container.click(function() {

        if (animated == false) {
            $(this).children('.logo_weather').fadeIn();
            animated = true;
        }
        else {
            $(this).children('.logo_weather').fadeOut();
            animated = false;

        }
    });

});


function pageLoad(){
    $(".search-filter").change(function () {
        $(this).next(".ajaxLoader").css('display', 'inline-block')
        $("select").attr("disabled", "disabled");
    });
}