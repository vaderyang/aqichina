// Calendar
// this displays information as events on a calendar



require.config({
    shim: {
        "./contrib/datav/charts/chinamap": {
            
            exports: "datachinamap"
        }
    }
});

define(function(require, exports, module) {
    var datav = require(['./contrib/datav/datav']);
    var _ = require('underscore');
    var fc = require(['./contrib/datav/charts/chinamap'], function (Chinamap) {});
    //var fcCSS = require("css!./contrib/fullcalendar.css");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    
    var EventChinaMap = SimpleSplunkView.extend({

        className: "custom-chinamap",

        options: {
            managerid: null,   
            data: "preview", 
            valueField: "count",
            groupField: "area",
            linkUrl: null,
            destFormField: null
        },

        output_mode: "json",

        initialize: function() {
            _.extend(this.options, {
                formatName: _.identity,
                formatTitle: function(d) {
                    return (d.source.name + ' -> ' + d.target.name +
                            ': ' + d.value); 
                }
            });
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },
        
        createView: function() {
            this.$el.html("");
            console.log(fc());
            var eventchinamap =fc("Chinamap");
            //chinamap.setOptions({'showWords': false});
            eventchinamap.setOptions({'mapId': 0});

            
            // The returned object gets passed to updateView as viz
            return { container: this.$el, eventchinamap: eventchinamap};
        },

        formatData: function(data) {
            var valueField = this.settings.get('valueField');
            var groupField = this.settings.get('groupField');
            var linkUrl = this.settings.get('linkUrl');
            var destFormField = this.settings.get('destFormField');
            var eventchinamap = {'events': [] };

            for (var i=0; i < data.length; i++) {
                var event = {
                    "title" : "Events: " + data[i][valueField],
                    "start" : data[i][groupField],
                    "url" : linkUrl + "?form." + destFormField + "=" + data[i][groupField]
                }
                
                eventchinamap.events.push(event);
            }
            return eventchinamap; // this is passed into updateView as 'data'
        },

        updateView: function(viz, data) {
            
            // we need to clear the HTML of the element because calling fullCalendar multiple times on the
            // same element will render multiple calendars.
            //this.$el.html("");
            console.log(viz);
        }
    });
    return EventChinaMap;
});