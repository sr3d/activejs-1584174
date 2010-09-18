ActiveRecord - Titanium Fork
============================
This fork from the ActiveJS allows ActiveRecord support for Titanium Database.


ActiveJS originally supported different adapters up until commit [a8cae9979b8caa01bc73](http://github.com/aptana/activejs/commit/a8cae9979b8caa01bc7324c68e529487d577dd94).  However, after this commit, the codebase was changed quite a bit, and the different adapters were removed.  Hence this particular fork begins at commit 1584174, and is modified to support [Titanium's Database](http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.Database-module) interface.

I was trying to patch the latest tree but gave up because internally the latest ActiveJS code was changed a lot, especially the ActiveSupport namespace (methods are now separated into ActiveSupport.Object, ActiveSupport.Array, etc. instead of just exposed via ActiveSupport namespace ).  I simply did not have the time to reverse-engineer all the changes to get everything working.  Since I already had the commit 1584174 patched up nicely, I decided to go with this older version instead.


Download & Usage
================
Copy the [active_record.js](http://github.com/sr3d/activejs-1584174/raw/master/dist/active_record.js) to your Titanium project and include it in your code.  You can now define the different models and their relationships.  Please refer to the [Titanium project](http://github.com/sr3d/titanium_activerecord) for more information.


The Titanium Adapter
====================
Since the iPhone's uses SQLite, the adapter was based on the gears.js adapter.  However, Titanium.Database.DB.execute function is a wrapper on top of another Objective C's SQLite wrapper, it is particular quite picky and does not support the apply() method.  In order for it to work, I had to resort to use eval() to construct the query params.  Here's the code excerpt:

    executeSQL: function executeSQL(sql)
    {
      var args = ActiveSupport.arrayFrom(arguments);
      ActiveRecord.connection.log("Adapters.Titanium: " + sql + " [" + args.slice(1).join(',') + "]");
  
      var response;
      if( args.length == 1 ) { 
        response = ActiveRecord.connection.db.execute(sql);
      } else {
        args = args.slice(1);
        var params= [];
        for( var i = 0; i < args.length; i++ ) { 
          if( typeof(args[i]) != 'undefined' )
            params.push('args[' + i + ']');
          else
            params.push("''");
        }
        var statement = 'response = ActiveRecord.connection.db.execute(sql,' + params.join(',') + ')';
        // ActiveRecord.connection.log('Eval Statement: ' + statement);
        eval( statement );
      }
      return response;
    },

Perfomance-wise the app will take a hit, but in exchange you'll have the power of ActiveRecord at your fingertips.



Test Coverage
=============
Since the code can only work inside a Titanium's environment, the test suite for this fork is located under another Github repository, which is a [Titanium project](http://github.com/sr3d/titanium_activerecord).  

The tests are almost a direct copy/paste of the test cases under /text/active_record/.  Most of them pass, except for the Finder's tests using callback.






Building
========
The files in the dist folder are the combined JSs, which can built using a rake task.

    rake dist
    
You will need to have the gem sprocket installed (gem install sprocket).



About
=====
This patch was done by Alex Le, single-founder of [Marrily.com](http://marrily.com), an online wedding planning service.


Disclaimer
==========
This code is provided as-is.  Please use it at your own risk.