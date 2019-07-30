const injector = {
    inject: function (elements) {
        let $body = $('body');
        elements.forEach(element => {
            let $element = $(`<${element.tag}></${element.tag}>`)
                .text(element.content)
                .css(element.css);
            
            $body.append($element);
        });
    }
};

const elements = [{
    tag: 'button',
    content: 'X',
    css: { position: 'absolute', right: '0px' }
}, {
    tag: 'button',
    content: '_',
    css: { position: 'absolute', right: '25px' }
}];

(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 20);
        }
    };

    // Start polling...
    checkReady(function($) {
        $(function() {
            injector.inject(elements);
        });
    });
})();