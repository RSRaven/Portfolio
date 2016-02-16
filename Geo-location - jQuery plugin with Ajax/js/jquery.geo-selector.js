(function($) {

    $.fn.geoSelector = function(options) {
        var defaults = {
            region: undefined
        };

        var settings = $.extend(defaults, options);

        function init (region) {

            var $html = $('<p id="cities"></p><div class="geo-inner"><input type="text" name="" id="regionSearch"><div id="regions"></div></div>');
            var $geoSelector =$('#geo-selector');
            $geoSelector.append($html);

            if (region) {

                settings = {

                    url: "http://evildevel.com/Test/City?region=",

                    success: function(data){

                        $cities.html('');
                        for (var i = data.length - 1; i >= 0; i--) {
                            $cities.prepend(data[i][1] + ', ');
                        }
                    }
                };

                settings.url += region;

                $.ajax(settings);
            }
        }

        init(settings.region);

        var $regionSearch = $('#regionSearch');
        var $regions = $('#regions');
        var $cities = $('#cities');

        var showRegions = function() { // отображаем регионы

            var regionText = this.value;

            if (regionText !== '') {

                var settings = {

                    url: "http://evildevel.com/Test/Region?name=",

                    success: function(data){

                        $regions.html('');
                        $cities.html('');
                        for (var i = data.length - 1; i >= 0; i--) {
                            $regions.prepend('<p><a href="#" data="' + data[i][0] + '">' + data[i][1] + '</a></p>');
                        }
                    }
                };

                var encRegion = encodeURIComponent('%' + regionText + '%');
                settings.url += encRegion;

                $.ajax(settings);

            } else {

                $regions.html('');
                $cities.html('');
            }
        };

        $regionSearch.on('input', showRegions);

        var showCities = function (e) { // отображаем города
            e.preventDefault();
            region = e.target.getAttribute('data');

            var settings = {

                url: "http://evildevel.com/Test/City?region=",

                success: function(data){

                    $cities.html('');
                    for (var i = data.length - 1; i >= 0; i--) {
                        $cities.prepend(data[i][1] + ', ');
                    }
                }
            };

            settings.url += region;

            $.ajax(settings);
        };

        $regions.on('click', showCities);

        return this;
    };

})(jQuery);