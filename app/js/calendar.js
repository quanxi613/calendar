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
        me.status = {
            year: moment().get('year'),
            month: moment().get('month')
        };
        me.init();
    };

    Calendar.prototype = {       

        init: function () {
            var me = this;
            me.createWrap();
            
            //moment.locale('en');
            var status = {
                year: moment().get('year'),
                month: moment().get('month')
            }
            me.render(status.year, status.month);
     

            //localLocale.locale('zh-cn');    
            //
            
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

        render: function (year, month) {
            var me = this;
            $('.year-month .year').text(year);
            $('.year-month .month').text(month+1);

            var firstday = me.getfirstday(year, month);
            var curMonDays = me.getdaysinonemonth(year, month);
            var arr = [];

            for(var i=0, len=firstday-1; i<len; i++) {
                arr.push('<li></li>');
            }

            for(var i=1, len=curMonDays+1; i<len; i++) {
                if(i == moment().date()) {
                    arr.push('<li class="current-day">'+i+'</li>');
                }
                else {
                    arr.push('<li>'+i+'</li>');
                }
            }

            $('.date').html(arr.join(''));
        },

        goNextMon: function () {
            var me = this;
            var year, month;

            me.container.on('click', '.btn-next', function () {

                if(me.status.month < 11) {
                    me.render(me.status.year, ++me.status.month);
                }
                else {
                    me.status.year =  me.status.year + 1;
                    me.status.month = 1;
                    me.render(me.status.year, me.status.month++);
                }
            });
        },

        goPrevMon: function () {
            var me = this;

            me.container.on('click', '.btn-prev', function () {
                var year, month;
                if(me.status.month > 0) {
                    me.render(me.status.year, --me.status.month);
                }
                else {
                    me.status.year =  me.status.year - 1;
                    me.status.month = 11;
                    me.render(me.status.year, me.status.month--);
                }
            });
        },

        //算某个月的第一天是星期几
        getfirstday: function (year, month) { 
            var d = new Date(year, month, 1);
            return d.getDay() == 0 ? 7 : d.getDay();
        },

        //算某个月的总天数
        getdaysinonemonth: function (year, month) {     
            month = parseInt(month, 10);
            var d = new Date(year, month, 0);
            return d.getDate();
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