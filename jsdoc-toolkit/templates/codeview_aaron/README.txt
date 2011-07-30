Example usage:

java -jar ./jsrun.jar ./app/run.js \
  -t=templates/codeview \
  -D="noGlobal:true" \
  -D="title:foo.js Foo JS Library" \
  -D="index:files" \
  -d=~/myproject/jsdoc \
  ~/myproject/

Custom options applicable in this template:

noGlobal - set to "true" to suppress documentation of the "_global_" namespace.
title - set to the title you prefer in place of "JsDoc Reference".
index - set to "files" to use the files list as your index page.
