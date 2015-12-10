(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {
    var Calendar = function (container, options) {
        var me = this; 
        me.container = $(container);  
        me.moment = moment();
        me.current = {
            year: me.moment.get('year'),
            month: me.moment.get('month')
        };
        me.options = $.extend(true, {}, Calendar.defaults, options);
        me.init();
    };

    Calendar.prototype = {       

        init: function () {
            var me = this;
            me.createWrap();
                      
            me.render(me.moment);
            
            me.goPrevMon();
            me.goNextMon();
            me.onDateClickHandle();
        },

        createWrap: function () {
            var htmlStr = [
                    '<div class="calendar">',
                        '<header>',
                            '<h2 class="year-month"><span class="year"></span>/<span class="month"></span></h2>',
                            '<a class="btn-prev" href="javascript:;"></a>',
                            '<a class="btn-next" href="javascript:;"></a>',
                        '</header>',
                        '<div class="week">',
                            '<span>一</span>',
                            '<span>二</span>',
                            '<span>三</span>',
                            '<span>四</span>',
                            '<span>五</span>',
                            '<span>六</span>',
                            '<span>日</span>',
                        '</div>',
                        '<ul class="date clearfix"></ul>',
                    '</div>'
            ].join("");

            $('.calendar-container').html(htmlStr);
        },

        render: function (moment) {
            var me = this;
            var year = moment.get('year');
            var month = moment.get('month');

            me.eventDateListPromise = me.getEventDateList({
                year: year,
                month: month
            });
            me.eventDateListPromise.then(function (eventDateList) {
                
                $('.year-month .year').text(year);
                $('.year-month .month').text(month+1);
                
                var firstday = moment.clone().startOf('month').day();
                if(firstday == 0) {
                    firstday = 7;
                }
                var curMonDays = moment.daysInMonth();
                var arr = [];

                for(var i=0, len=firstday-1; i<len; i++) {
                    arr.push('<li></li>');
                }

                for(var i=1, len=curMonDays+1; i<len; i++) {
                    if (i == moment.date() && year == me.current.year && month == me.current.month) {
                        arr.push('<li class="day current-day" data-year="'+year
                                +'" data-month="'+(month+1)
                                +'" data-day="'+i+'">'+i+'</li>');
                    }
                    else {
                        arr.push('<li class="day" data-year="'+year
                                +'" data-month="'+(month+1)
                                +'" data-day="'+i+'">'+i+'</li>');
                    }
                }

                $('.date').html(arr.join(''));

                $.each(eventDateList, function(index, val) {
                    $('.date [data-day]').eq(val-1).addClass('event');
                });
                
            });          
        },

        goNextMon: function () {
            var me = this;

            me.container.on('click', '.btn-next', function () {
                me.render(me.moment.add(1, 'month'));
            });
        },

        goPrevMon: function () {
            var me = this;

            me.container.on('click', '.btn-prev', function () {
                me.render(me.moment.subtract(1, 'month'));
            });
        },

        onDateClickHandle: function () {
            var me = this;

            me.container.on('click', '[data-day]', function () {
                var _this = $(this);
                var date = {
                    year: _this.data('year'),
                    month: _this.data('month'),
                    day: _this.data('day')
                };

                me.date = date;
                if(_this.hasClass('event')) {
                    _this.addClass('active');
                    _this.siblings('.event').removeClass('active');
                }
                me.options.onDateClick(date);
            });
        },

        /**
        * 如果设置了eventDateListAPI则从该url获取城市列表, 设置dataType为jsonp可跨域
        * 如果没设置, 则使用eventDateList, 返回Promise保证调用正常
        * @return {Promise} 返回默认event的Promise对象
        **/
        getEventDateList: function (yearMonth) {
            var me = this;
            if (me.options.eventDateListAPI) {
                return $.ajax({
                    url: me.options.eventDateListAPI,
                    dataType:　me.options.dataType,
                    data: yearMonth
                })
            } 
            else {
                var dfd = $.Deferred();
                dfd.resolve(me.options.eventDateList);
                return dfd.promise();
            }
        }
    };

    Calendar.defaults = {
        eventDateListAPI: '',
        dataType: 'json',
        eventDateList: [1,2,10],
        onDateClick: $.noop
    }

    // plugin definition
    // 在元素上绑定组件对象
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var calendar = $this.data('calendar.xi');
            var options = typeof option === 'object' && option;

            if (!calendar) {
                $this.data('calendar.xi', (calendar = new Calendar(this, options)));
            }
        });
    }

    var old = $.fn.calendar;

    $.fn.calendar = Plugin;
    $.fn.calendar.Constructor = Calendar;
    $.fn.calendar.noConflict = function () {
        $.fn.calendar = old;
        return this;
    };
}));