@echo off

set folder=example\devtools\javascript
copy/b %folder%\Estate.js %folder%\estate-devtools.js
copy/b %folder%\estate-devtools.js + %folder%\Estate.Develop.js %folder%\estate-devtools.js
copy/b %folder%\estate-devtools.js + %folder%\Estate.Develop.FormTester.js %folder%\estate-devtools.js
copy/b %folder%\estate-devtools.js + %folder%\Estate.Develop.DesignTester.js %folder%\estate-devtools.js

java -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%\estate-devtools.js -o %folder%\estate-devtools.min.js

echo .
echo Estate Developer Tools are combined and minified.
pause