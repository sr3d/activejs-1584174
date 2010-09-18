ActiveRecord - Titanium Fork
============================
This fork from the ActiveJS allows ActiveRecord support for Titanium Database.


ActiveJS originally supported different adapters up until commit [a8cae9979b8caa01bc73](http://github.com/aptana/activejs/commit/a8cae9979b8caa01bc7324c68e529487d577dd94).  However, after this commit, the codebase was changed quite a bit, and the different adapters were removed.  Hence this particular fork begins at commit 1584174, and is modified to support [Titanium's Database](http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.Database-module) interface.

I was trying to patch the latest tree but gave up because internally the latest ActiveJS code was changed a lot, especially the ActiveSupport namespace (methods are now separated into ActiveSupport.Object, ActiveSupport.Array, etc. instead of just exposed via ActiveSupport namespace ).  I simply did not have the time to reverse-engineer all the changes to get everything working.  Since I already had the commit 1584174 patched up nicely, I decided to go with this older version instead.

Test Coverage
=============
Since the code can only work inside a Titanium's environment, the test suite for this fork is located under another Github repository, which is a [Titanium project](http://github.com/sr3d/titanium_activerecord).  

The tests are almost a direct copy/paste of the test cases under /text/active_record/.  Most of them pass, except for the Finder's tests using callback.

Download & Usage
================
Copy the [active_record.js](http://github.com/sr3d/activejs-1584174/raw/master/dist/active_record.js) to your Titanium project and include it in your code.  You can now define the different models and their relationships.  Please refer to the [Titanium project](http://github.com/sr3d/titanium_activerecord) for more information.


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