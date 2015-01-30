var hash = require('./pass').hash,
    mongoose = require('mongoose');

/*
account model
*/
var accountSchema = new mongoose.Schema({
    account:String,
    password:String,
    salt:String
});

var Account = mongoose.model('account', accountSchema);

exports.Account = Account;

/*
*@param (String) the name of player.
*@param (String) the password of player.
*@param (Function) callback(err,account).
*/
exports.saveAccount = function(name,pass,fn){
    hash(pass,function(err,salt,hash){
        if(err) return fn(err);
        new Account({
                    account:name,
                    password:hash,
                    salt:salt
                    }).save(function(err, newAccount){
                        if(err) return fn(err);
                        fn(null, newAccount);
                    });
    });
}

/*
*@param (String) the name of player.
*@param (String) the password of player.
*@param (Function) callback(err,account).
*/
exports.authenticate = function (name,pass,fn){
    Account.findOne({account:name},
        function(err, account){
            if(account){
                console.log(account == null);
                if(err) return fn(new Erro('cannot find user'));
                hash(pass,account.salt,function(err,hash){
                    if(err) return fn(err);
                    if(hash == account.password) return fn(null,account);
                    fn(new Error('invalid password'));
                });
            }else{
                return fn(new Error('cannot find user')); 
            }
        });
}

/*
*@param (String) the name of player.
*@param (String) the password of player.
*@param (Function) callback(err,boolean).
*/
exports.userExist = function(name,fn){
    Account.count({account:name},
        function(err,count){
            if(err) return fn(err);
            fn(null, count > 0);
        }
    );
} 
