var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')
var url = require('url')
var async = require('async')
var app = express()
var baseUrl = 'https://cnodejs.org/'

function output(arr) {
  for(var i = 0; i < arr.length; i++) {
    console.log(arr[i])
  }
}

superagent.get('https://cnodejs.org/').end(function (error, data) {
  if (error) {
    console.log('error exception occured !')
    return next(error)
  }
  var $ = cheerio.load(data.text)
  var arr = []
  $('#topic_list .topic_title').each(function (i, el) {
    var $el = $(el)
    var _url = url.resolve(baseUrl, $el.attr('href'))
    arr.push(_url)
  })
  // 验证得到的所有文章链接集合
  output(arr)
  // 遍历arr, 解析每个页面中需要的信息
  async.mapLimit(arr, 3, function (url, callback) {
    superagent.get(url).end(function (err, mes) {
      if (err) {
        console.log("get \""+url+"\" error !"+err);
        console.log("message info:"+JSON.stringify(mes));
      }
      console.log('fetch '+url+" succeful !")
      var $ = cheerio.load(mes.text)
      var jsonData = {
        title: $('.topic_full_title').text().trim(),
        href: url,
        firstcomment: $("#reply1 .markdown-text").text().trim()
      }
      console.log("aim data is :" + JSON.stringify(jsonData));
      callback(null,jsonData);
    })
  }, function (err, results) {
    console.log('result :')
    console.log(results)
  })
})

app.listen(3000, function (req, res) {
  console.log('server is running')
})