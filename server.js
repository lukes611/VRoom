var e = require('express')
var os = require('os')

//returns a list of ip-addresses for the server
//ipv4Only -> if set true, only return ipv4 addresses
var getIpAddresses = function(ipv4Only){
    var os = require('os');
    ipv4Only = ipv4Only || false;
    var ret = [];
    var interfaces = os.networkInterfaces();
    for(var interface in interfaces){
        var addresses = interfaces[interface];
        addresses.forEach(function(addr){
            if(!ipv4Only || addr.family != 'IPv6')
            ret.push({
                type    : addr.family,
                ip      : addr.address,
                mac     : addr.mac
            });
        });
        
    }
    return ret;
};

_ = e()
var p = 3000
_.use(e.static('static'))
_.listen(p, function(){
    console.log('listening on port:', p)
    getIpAddresses(true).forEach(x => console.log(x.ip));
})