// Custom view tutorial
define(function(require, exports, module) {
    // Load requirements
    var _ = require('underscore');
    var mvc = require('splunkjs/mvc');
    var SimpleSplunkView = require('splunkjs/mvc/simplesplunkview');

    // Define the custom view class
    var DemoView = SimpleSplunkView.extend({
        className: "demoview",

        // Override the render function to make the view do something
        // In this example: print to the page and to the console
        render: function() {

            // Print to the page
            this.$el.html("Hello, world!");

            // Print to the console
            console.log("Hello, world!");

            return this;
        }
    });
    return DemoView;
});