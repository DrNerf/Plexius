const { remote } = require("electron");

const elements = [{
    tag: 'button',
    content: 'X',
    parentSelector: 'body',
    css: { position: 'absolute', right: '0px' },
    shouldInject: function () {
        return window.location.href.includes("auth");
    },
    click: function () {
        remote.getCurrentWindow().close();
    }
}, {
    tag: 'button',
    content: '_',
    parentSelector: 'body',
    css: { position: 'absolute', right: '25px' },
    shouldInject: function () {
        return window.location.href.includes("auth");
    },
    click: function () {
        remote.getCurrentWindow().minimize();
    }
}, {
    tag: 'button',
    content: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>',
    parentSelector: 'div[class*="NavBar-right"]',
    css: { '-webkit-app-region': 'no-drag' },
    shouldInject: function () {
        return window.location.href.includes('desktop');
    },
    click: function () {
        remote.getCurrentWindow().close();
    },
    onInjected: function ($self) {
        let $sibling = injector.getElementByUid('id-30');
        $self.addClass($sibling.prop('class'));
    }
}];

const injector = {
    inject: function (elements) {
        if (window.location.href.includes('desktop')) {
            if (!$('div[class*="NavBar-right"]').length) {
                // Wait for the navbar to get rendered.
                setTimeout(() => injector.inject(elements), 2000);
                return;
            }

            console.debug($('.nav-bar'));
            console.debug($('div[class*="NavBar-right"]'));
            let $navbar = $('.nav-bar');
            $navbar.prop('style', '-webkit-user-select: none;-webkit-app-region: drag;');
            $navbar.find('button').prop('style', '-webkit-app-region: no-drag;');
            $navbar.find('input').prop('style', '-webkit-app-region: no-drag;');
            $navbar.find('a').prop('style', '-webkit-app-region: no-drag;');
        }

        elements.forEach(element => {
            if (element.shouldInject()) {
                let $element = $(`<${element.tag}></${element.tag}>`)
                    .html(element.content)
                    .css(element.css)
                    .on('click', element.click);

                if (element.classes) {
                    $element.addClass(element.classes);
                }

                $(element.parentSelector).append($element);
                if (element.onInjected) {
                    element.onInjected($element);
                }
            }
        });
    },
    getElementByUid(uid) {
        return $(`[data-uid=${uid}]`).first();
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
            $('title').text('Plexius');
            injector.inject(elements);
        });
    });
})();