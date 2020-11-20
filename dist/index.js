"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 用于在webpack编译时自动往html模板里插入js和css代码
 */
var fs = require('fs');

var path = require('path');

var InsertHtmlWebpackPlugin = /*#__PURE__*/function () {
  function InsertHtmlWebpackPlugin(list, options) {
    _classCallCheck(this, InsertHtmlWebpackPlugin);

    this.list = list || {};
    this.options = options || {};
  }

  _createClass(InsertHtmlWebpackPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var jsList = this.list.js || [];
      var cssList = this.list.css || [];
      var jsNode = this.options.jsNode || '<body>';
      var jsSide = this.options.jsSide || 'after';
      var cssNode = this.options.cssNode || '</title>';
      var cssSide = this.options.cssSide || 'after'; // 定义要插入的script字符串

      var scriptCode = '';
      jsList.forEach(function (v) {
        if (v.url) {
          scriptCode += "<script src=\"".concat(v.url, "\"></script>");
        } else if (v.path) {
          var str = '';

          try {
            str = fs.readFileSync(path.join(process.cwd(), v.path), 'utf-8').toString();
          } catch (err) {
            console.log('js readFileSync error:', err);
          }

          scriptCode += "<script>".concat(str, "</script>");
        }
      }); // 定义要插入的link或style字符串

      var linkStyleCode = '';
      cssList.forEach(function (v) {
        if (v.url) {
          linkStyleCode += "<link rel=\"stylesheet\" href=\"".concat(v.url, "\"/>");
        } else if (v.path) {
          var str = '';

          try {
            str = fs.readFileSync(path.join(process.cwd(), v.path), 'utf-8').toString();
          } catch (err) {
            console.log('css readFileSync error:', err);
          }

          linkStyleCode += "<style>".concat(str, "</style>");
        }
      }); // 编译时注入

      compiler.hooks.compilation.tap('compilation', function (compilation) {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('htmlWebpackPluginAfterHtmlProcessing', function (htmlPluginData) {
          var htmlStr = htmlPluginData.html.toString(); // 合并js

          if (scriptCode) {
            var replaceStr = '';

            if (jsSide === 'before') {
              replaceStr = scriptCode + jsNode;
            } else {
              replaceStr = jsNode + scriptCode;
            }

            htmlStr = htmlStr.replace(new RegExp(jsNode), replaceStr);
          } // 合并css


          if (linkStyleCode) {
            var _replaceStr = '';

            if (cssSide === 'before') {
              _replaceStr = linkStyleCode + cssNode;
            } else {
              _replaceStr = cssNode + linkStyleCode;
            }

            htmlStr = htmlStr.replace(new RegExp(cssNode), _replaceStr);
          }

          htmlPluginData.html = htmlStr;
        });
      });
    }
  }]);

  return InsertHtmlWebpackPlugin;
}();

module.exports = InsertHtmlWebpackPlugin;