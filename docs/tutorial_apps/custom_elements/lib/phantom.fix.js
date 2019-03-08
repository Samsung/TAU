if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

if (!CustomEvent) {
    function CustomEvent(type, data) {
        var evt = document.createEvent('Event');
        evt.initEvent(type, data.bubbles, data.cancelable);
        evt.detail = data.detail;
        return evt;
    }
}

var tizen = {
    systeminfo : {
        getPropertyValue: function(name, callback) {},
        addPropertyValueChangeListener : function () {}
    },
    application : {
        getAppContext : function () {
            return {
                appId : ''
            };
        },
        getCurrentApplication : function () {
            return {
                appInfo : {
                    version: "1.0"
                },
                exit: function () {
                }
            };
        },
        getAppSharedURI: function () {
            return "";
        }
    },
    alarm : {
        removeAll : function() {
        }
    },
    contact: {
        getDefaultAddressBook : function() {
        }
    },
    callhistory : {
        addChangeListener : function () {
        },
        find: function() {}
    },
    contact: {
        getDefaultAddressBook: function() {
            return {
                find: function () {}
            }
        }
    },
    SortMode: function() {
        return {};
    },
    time: {
        getCurrentDateTime: function() {
           return {
              toLocalTimezone: function() {}
           };
        },
        getDateFormat: function () {},
        getTimeFormat: function () {}
    },
    calendar: {
        getDefaultCalendar: function() {
            return {
                find: function() {}
            };
        }
    },
    TZDate: function () {
    },
    AttributeFilter: function () {
    },
    AttributeRangeFilter: function () {
    },
    CompositeFilter: function () {
    }
}
