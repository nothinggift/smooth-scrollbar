'use strict';

var _smoothScrollbar = require('../smooth-scrollbar');

/**
 * @method
 * @api
 * Add scrolling listener
 *
 * @param {Function} cb: listener
 */
_smoothScrollbar.SmoothScrollbar.prototype.addOverscrollListener = function (cb) {
  if (typeof cb !== 'function') return;

  this.__overscrolllisteners.push(cb);
};

/**
 * @method
 * @api
 * Remove specific listener from all listeners
 * @param {type} param: description
 */
/**
 * @module
 * @prototype {Function} addListener
 *            {Function} removeListener
 */

_smoothScrollbar.SmoothScrollbar.prototype.removeOverscrollListener = function (cb) {
  if (typeof cb !== 'function') return;

  this.__overscrolllisteners.some(function (fn, idx, all) {
    return fn === cb && all.splice(idx, 1);
  });
};