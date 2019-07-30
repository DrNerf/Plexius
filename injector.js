const { remote } = require("electron");

const elements = [{
    tag: 'button',
    content: 'X',
    parentSelector: 'body',
    css: { position: 'absolute', right: '0px' },
    shouldInject: function(){
        return window.location.href.includes("auth");
    },
    click: function() {
        remote.getCurrentWindow().close();
    }
}, {
    tag: 'button',
    content: '_',
    parentSelector: 'body',
    css: { position: 'absolute', right: '25px' },
    shouldInject: function(){
        return window.location.href.includes("auth");
    },
    click: function() {
        remote.getCurrentWindow().minimize();
    }
}];

const injector = {
    inject: function (elements) {
        elements.forEach(element => {
            if (element.shouldInject()) {
                let $element = $(`<${element.tag}></${element.tag}>`)
                    .text(element.content)
                    .css(element.css)
                    .on('click', element.click);

                if (element.classes) {
                    $element.addClass(element.classes);
                }
    
                $(element.parentSelector).append($element);
            }
        });
    }
};

(function () {
    // Load the script
    var script = document.createElement("SCRIPT");
    
    // For some weird reason this won't work with newer jQuery versions.
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function (callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function () { checkReady(callback); }, 20);
        }
    };

    // Start polling...
    checkReady(function ($) {
        $(function () {
            injector.inject(elements);
        });
    });
})();