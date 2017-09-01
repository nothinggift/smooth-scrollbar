/**
 * @module
 * @prototype {Function} getSize
 */

import { SmoothScrollbar } from '../smooth-scrollbar';

/**
 * @method
 * @api
 * Get container and content size
 *
 * @return {Object}: an object contains container and content's width and height
 */
SmoothScrollbar.prototype.getSize = function () {
    const container = this.targets.container;
    const content = this.targets.content;
    const styles = window.getComputedStyle(content);
    let marginX = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']);
    let marginY = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    return {
        container: {
            // requires `overflow: hidden`
            width: container.clientWidth,
            height: container.clientHeight,
        },
        content: {
            // border width should be included
            width: content.offsetWidth - content.clientWidth + content.scrollWidth + marginX,
            height: content.offsetHeight - content.clientHeight + content.scrollHeight + marginY,
        },
    };
};
