/**
 * @module
 * @prototype {Function} __renderOverscroll
 */

import { SmoothScrollbar } from '../smooth-scrollbar';

import { overscrollBounce, overscrollGlow } from '../overscroll/';
import { GLOBAL_ENV } from '../shared/';
import { pickInRange } from '../utils/';

// @this-binding
function calcNext(dir = '') {
    if (!dir) return;

    const {
        options,
        movement,
        overscrollRendered,
        MAX_OVERSCROLL,
        PULL_TO_REFRESH_MAX_OVERSCROLL,
    } = this;
    let maxOverscroll = options.pullToRefresh && dir === 'y' ? PULL_TO_REFRESH_MAX_OVERSCROLL : MAX_OVERSCROLL;
    const dest = movement[dir] = pickInRange(movement[dir], -maxOverscroll, maxOverscroll);
    const damping = options.overscrollDamping;

    let next = overscrollRendered[dir] + (dest - overscrollRendered[dir]) * damping;

    if (options.renderByPixels) {
        next |= 0;
    }
    if (!this.__isMovementLocked() && Math.abs(next - overscrollRendered[dir]) < 0.1) {
        next -= (dest / Math.abs(dest || 1));
    }

    if (Math.abs(next) < Math.abs(overscrollRendered[dir])) {
        this.__readonly('overscrollBack', true);
    }
    if (options.pullToRefresh && dir === 'y' && overscrollRendered[dir] < 0) {
        if (!this.__isMovementLocked() && this.overscrollBack && -overscrollRendered[dir] > options.pullToRefreshSize && -next <= options.pullToRefreshSize) {
            this.__putllToRefreshType = 'loading';
            let self = this;
            const complete = function () {
                self.__putllToRefreshType = 'none';
            };
            if (options.pullToRefreshCallback) { options.pullToRefreshCallback('loading', complete); }
        } else if (!this.overscrollBack && -overscrollRendered[dir] < options.pullToRefreshSize && -next >= options.pullToRefreshSize) {
            this.__putllToRefreshType = 'ready';
            if (options.pullToRefreshCallback) { options.pullToRefreshCallback('ready'); }
        } else if (this.__isMovementLocked() && this.overscrollBack && -overscrollRendered[dir] >= options.pullToRefreshSize && -next < options.pullToRefreshSize) {
            this.__putllToRefreshType = 'cancel';
            if (options.pullToRefreshCallback) { options.pullToRefreshCallback('cancel'); }
        }
    }
    if (this.__putllToRefreshType === 'loading' && this.__isMovementLocked()) {
        this.__putllToRefreshType = 'none';
    }

    if (this.__putllToRefreshType === 'loading') {
        next = -options.pullToRefreshSize;
    }

    if (next * overscrollRendered[dir] < 0 || Math.abs(next) <= 1) {
        next = 0;
        this.__readonly('overscrollBack', false);
    }
    overscrollRendered[dir] = next;
}

// @this-bind
function shouldUpdate(lastRendered) {
    const {
        __touchRecord,
        overscrollRendered,
    } = this;

    // has unrendered pixels?
    if (overscrollRendered.x !== lastRendered.x ||
        overscrollRendered.y !== lastRendered.y) return true;

    // is touch position updated?
    if (GLOBAL_ENV.TOUCH_SUPPORTED &&
        __touchRecord.updatedRecently()) return true;

    return false;
}

// @this-binding
function __renderOverscroll(dirs = []) {
    if (!dirs.length || (!this.options.overscrollEffect && !this.options.pullToRefresh)) return;
    const {
        options,
        overscrollRendered,
        __overscrolllisteners,
    } = this;

    const lastRendered = { ...overscrollRendered };

    dirs.forEach((dir) => this::calcNext(dir));

    if (!this::shouldUpdate(lastRendered)) return;
    var allDirection = ['top', 'bottom', 'left', 'right'];
    let difference = options.overscrollDirection.concat(allDirection).filter(v => !options.overscrollDirection.includes(v) || !allDirection.includes(v));
    difference.forEach((direction) => {
        switch (direction) {
        case 'top':
            overscrollRendered.y < 0 && (overscrollRendered.y = 0);
            break;
        case 'bottom':
            overscrollRendered.y > 0 && (overscrollRendered.y = 0);
            break;
        case 'left':
            overscrollRendered.x < 0 && (overscrollRendered.x = 0);
            break;
        case 'right':
            overscrollRendered.x > 0 && (overscrollRendered.x = 0);
            break;
        }
    }
    );
    __overscrolllisteners.forEach((fn) => {
        if (options.syncCallbacks) {
            fn(overscrollRendered);
        } else {
            requestAnimationFrame(() => {
                fn(overscrollRendered);
            });
        }
    });
    if (overscrollRendered.y < 0 && options.pullToRefresh) {
        return this::overscrollBounce(overscrollRendered.x, overscrollRendered.y);
    }
    // x,y is same direction as it's in `setPosition(x, y)`
    switch (options.overscrollEffect) {
    case 'bounce':
        return this::overscrollBounce(overscrollRendered.x, overscrollRendered.y);
    case 'glow':
        return this::overscrollGlow(overscrollRendered.x, overscrollRendered.y);
    default:
        return;
    }
}

Object.defineProperty(SmoothScrollbar.prototype, '__renderOverscroll', {
    value: __renderOverscroll,
    writable: true,
    configurable: true,
});
