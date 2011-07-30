@echo off

java -jar jsdoc-toolkit\jsrun.jar jsdoc-toolkit\app\run.js -d=Documentation\ -D="title:Estate Developer Tools" -t=jsdoc-toolkit\templates\codeview -p -v example\devtools\javascript\Estate.js example\devtools\javascript\Estate.Develop.js example\devtools\javascript\Estate.Develop.FormTester.js example\devtools\javascript\Estate.Develop.DesignTester.js

echo .
echo Batch is done.
pause
