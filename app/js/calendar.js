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
        me.init();
    };

    Calendar.prototype = {       

        init: function () {
            var me = this;
            me.createWrap();
                      
            me.render(me.moment);
            
            me.goPrevMon();
            me.goNextMon();
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
            $('.year-month .year').text(year);
            $('.year-month .month').text(month+1);
            

            var firstday = moment.startOf('month').day();
            if(firstday == 0) {
                firstday = 7;
            }
            var curMonDays = moment.daysInMonth();
            var arr = [];

            for(var i=0, len=firstday-1; i<len; i++) {
                arr.push('<li></li>');
            }

            for(var i=1, len=curMonDays+1; i<len; i++) {
                if(i == moment.date() && year == me.current.year && month == me.current.month) {
                    arr.push('<li class="day current-day">'+i+'</li>');
                }
                else {
                    arr.push('<li class="day">'+i+'</li>');
                }
            }

            $('.date').html(arr.join(''));
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
        }
    };

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