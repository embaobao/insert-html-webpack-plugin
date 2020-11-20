/**
 * 用于在webpack编译时自动往html模板里插入js和css代码
 */
const fs = require('fs')
const path = require('path')

class InsertHtmlWebpackPlugin {
  constructor (list, options) {
    this.list = list || {}
    this.options = options || {}
  }

  apply (compiler) {
    const jsList = this.list.js || []
    const cssList = this.list.css || []
    const jsNode = this.options.jsNode || '<body>'
    const jsSide = this.options.jsSide || 'after'
    const cssNode = this.options.cssNode || '</title>'
    const cssSide = this.options.cssSide || 'after'

    // 定义要插入的script字符串
    let scriptCode = ''
    jsList.forEach(v => {
      let jsPath = ''
      let srcUrl = ''
      if (typeof v === 'string') {
        jsPath = v
      } else if (v.path) {
        jsPath = v.path
      } else if (v.url) {
        srcUrl = v.url
      }
      if (srcUrl) {
        scriptCode += `<script src="${v.url}"></script>`
      } else if (jsPath) {
        let str = ''
        try {
          str = fs.readFileSync(path.join(process.cwd(), jsPath), 'utf-8').toString()
        } catch (err) {
          console.log('js readFileSync error:', err)
        }
        scriptCode += `<script>${str}</script>`
      }
    })

    // 定义要插入的link或style字符串
    let linkStyleCode = ''
    cssList.forEach(v => {
      let cssPath = ''
      let hrefUrl = ''
      if (typeof v === 'string') {
        cssPath = v
      } else if (v.path) {
        cssPath = v.path
      } else if (v.url) {
        hrefUrl = v.url
      }
      if (hrefUrl) {
        linkStyleCode += `<link rel="stylesheet" href="${v.url}"/>`
      } else if (cssPath) {
        let str = ''
        try {
          str = fs.readFileSync(path.join(process.cwd(), cssPath), 'utf-8').toString()
        } catch (err) {
          console.log('css readFileSync error:', err)
        }
        linkStyleCode += `<style>${str}</style>`
      }
    })

    // 编译时注入
    compiler.hooks.compilation.tap(
      'compilation',
      compilation => {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
          'htmlWebpackPluginAfterHtmlProcessing',
          htmlPluginData => {
            let htmlStr = htmlPluginData.html.toString()

            // 合并js
            if (scriptCode) {
              let replaceStr = ''
              if (jsSide === 'before') {
                replaceStr = scriptCode + jsNode
              } else {
                replaceStr = jsNode + scriptCode
              }
              htmlStr = htmlStr.replace(new RegExp(jsNode), replaceStr)
            }

            // 合并css
            if (linkStyleCode) {
              let replaceStr = ''
              if (cssSide === 'before') {
                replaceStr = linkStyleCode + cssNode
              } else {
                replaceStr = cssNode + linkStyleCode
              }
              htmlStr = htmlStr.replace(new RegExp(cssNode), replaceStr)
            }

            htmlPluginData.html = htmlStr
          })
      })
  }
}

module.exports = InsertHtmlWebpackPlugin
