/*
 * Simple Chinamap visualization
 * This view is an example for a simple visualization based on search results
 */
define(function(require, module) {
    var _ = require('underscore'), $ = require('jquery');
    var d3 = require("../d3/d3.v3");
    var SimpleSplunkView = require('splunkjs/mvc/simplesplunkview');
    var Drilldown = require('splunkjs/mvc/drilldown');
    require('css!./chinamap.css');

    var ChinaMap = SimpleSplunkView.extend({
        moduleId: module.id,
        className: 'chinamap-viz',
        options: {
            labelField: 'label',
            valueField: 'count',
            longitudeField: 'longitude',
            latitudeField: 'latitude',
            data: 'preview'
        },
        output_mode: 'json',
        events: {
            'click a': function(e) {
                e.preventDefault();
                // Perform automatic drilldown on click on a tag
                Drilldown.handleDrilldown({
                    name: this.settings.get('labelField'),
                    value: $.trim($(e.target).text())
                }, 'row', this.manager);
            }
        },
        createView: function() {
            return true;
        },
        updateView: function(viz, data) {
            var labelField = this.settings.get('labelField');
            var valueField = this.settings.get('valueField');
            // Clear the current view
            this.$el.html("");

            var w = 1000;
            var h = 600;

            //Define map projection
            var projection = d3.geo.mercator()
                                   .translate([w/2, h/2])
                                   .scale(w*6)
                                   .center([115,30]);

            //Define path generator
            var path = d3.geo.path()
                             .projection(projection);

            //Create SVG element
            var svg = d3.select("#visualization")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            //Load in GeoJSON data
            d3.json("0.json", function(json) {

                //Bind data and create one path per GeoJSON feature
                svg.selectAll("path")
                   .data(json.features)
                   .enter()
                   .append("path")
                   .attr("d", path)
                   .style("fill", "grey"); //steelblue

            });



            _(data).chain().map(function(result) {
                // Extract and convert the magnitude field value
                var magnitude = parseFloat(result[valueField]);
                // Find the maximum and minimum of the magnitude field values
                return {
                    label: result[labelField],
                    magnitude: magnitude
                };
            }).each(function(result) {
                        // Calculate relative size of each tag
                        var size = minFontSize + ((result.magnitude - minMagnitude) / maxMagnitude * (maxFontSize - minFontSize));
                        // Render the tag
                        $('<a class="link" href="#" /> ').text(result.label + ' ').css({
                            'font-size': size
                        }).appendTo(el);
                    });
        }
    });

    return TagCloud;
});
