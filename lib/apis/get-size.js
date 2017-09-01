'use strict';

var _smoothScrollbar = require('../smooth-scrollbar');

/**
 * @method
 * @api
 * Get container and content size
 *
 * @return {Object}: an object contains container and content's width and height
 */
_smoothScrollbar.SmoothScrollbar.prototype.getSize = function () {
    var container = this.targets.container;
    var content = this.targets.content;
    var styles = window.getComputedStyle(content);
    var marginX = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']);
    var marginY = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    return {
        container: {
            // requires `overflow: hidden`
            width: container.clientWidth,
            height: container.clientHeight
        },
        content: {
            // border width should be included
            width: content.offsetWidth - content.clientWidth + content.scrollWidth + marginX,
            height: content.offsetHeight - content.clientHeight + content.scrollHeight + marginY
        }
    };
}; /**
    * @module
    * @prototype {Function} getSize
    */