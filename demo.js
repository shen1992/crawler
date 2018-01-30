var async = require('async')
var currentCount = 0
console.log('will create a url list size 10')
var urls = []
for(var i = 0; i < 10; i++) {
  urls.push('http://www.example.com/'+i+".html")
}
async.mapLimit(urls, 2, function (url, callback) {
  var delay = parseInt(500)
  currentCount++
  console.log("currentCount is :"+currentCount+",current url is :"+url+",use time is :"+delay+" mm")
  setTimeout(function (args) {
    currentCount--
    callback(null, url + ' html content ')
  }, delay)
}, function (err, result) {
  console.log("result:");
  console.log(result);
})