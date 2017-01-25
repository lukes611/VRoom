var e = require('express')
_ = e()
_.use(e.static('static'))
_.listen(8142, function(){
    console.log('listening on port: 8142')
})