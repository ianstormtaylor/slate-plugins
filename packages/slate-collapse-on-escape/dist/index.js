'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toPascalCase = require('to-pascal-case');

var _toPascalCase2 = _interopRequireDefault(_toPascalCase);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {String} toEdge
 * @return {Object}
 */

function CollapseOnEscape() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return {
    onKeyDown: function onKeyDown(e, data, change) {
      var state = change.state;

      if (data.key != 'esc') return;
      if (state.isCollapsed) return;
      var edge = (0, _toPascalCase2.default)(options.toEdge || 'start');
      return change['collapseTo' + edge]();
    }
  };
}

/**
 * Export.
 */

exports.default = CollapseOnEscape;