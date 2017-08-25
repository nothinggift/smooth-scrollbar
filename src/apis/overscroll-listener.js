/**
 * @module
 * @prototype {Function} addListener
 *            {Function} removeListener
 */

import { SmoothScrollbar } from '../smooth-scrollbar';

/**
 * @method
 * @api
 * Add scrolling listener
 *
 * @param {Function} cb: listener
 */
SmoothScrollbar.prototype.addOverscrollListener = function (cb) {
    if (typeof cb !== 'function') return;

    this.__overscrolllisteners.push(cb);
};

/**
 * @method
 * @api
 * Remove specific listener from all listeners
 * @param {type} param: description
 */
SmoothScrollbar.prototype.removeOverscrollListener = function (cb) {
    if (typeof cb !== 'function') return;

    this.__overscrolllisteners.some((fn, idx, all) => {
        return fn === cb && all.splice(idx, 1);
    });
};
