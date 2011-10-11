/** 
 * @fileOverview Base namespace for all development functionality
 * @author Wouter Bos, web developer at www.estate.nl
 * @since 1.0 - 2008
 * @version 1.1 - 2010-12-21
 * @requires Estate.js
 */






/**
 * @namespace Namespace for all code supporting the development of websites.
 * In its simplest form it wil only set up a root div in the page and load
 * some CSS files at startup. 
 */
Estate.Develop = ( function() {
	var config = {
		rootElement: null,
		devtoolsPath: '/devtools',
		cssDevelop: "css/develop.css",
		cssHighlight: "css/develop-highlightBadHTML.css"
	}
	if (document.location.protocol == "file:") {
		config.devtoolsPath = config.devtoolsPath.replace('/', '')
	}
	
	setup()
	
	function setup(){
		// Add root div
		config.rootElement = document.createElement("div");
		config.rootElement.className = "dev_root"
		config.rootElement.id = "dev_root"
		if (navigator.userAgent.indexOf('MSIE6.') > 0) {
			config.rootElement.className += " ua_msie6"	
		}
		document.body.appendChild(config.rootElement);
		
		// Add develop css files
		var css = document.createElement("link")
		css.rel = "stylesheet"
		css.type = "text/css"
		css.media = "screen, handheld"
		var cssPath = config.cssDevelop
		if (config.devtoolsPath != "") {
			cssPath = config.devtoolsPath +'/'+ cssPath
		}
		css.href = cssPath
		document.getElementsByTagName("head")[0].appendChild(css)

		var css2 = document.createElement("link")
		css2.rel = "stylesheet"
		css2.type = "text/css"
		css2.media = "screen, handheld"
		var css2Path = config.cssHighlight
		if (config.devtoolsPath != "") {
			css2Path = config.devtoolsPath +'/'+ css2Path
		}
		css2.href = css2Path
		document.getElementsByTagName("head")[0].appendChild(css2)
	}

	/* START PUBLIC */
	return {
		/**
		 * Returns root element that holds all development tools
		 * 
		 * @example
		 * Estate.Develop.GetRoot()
		 * @returns {Object} Root element that holds all development tools
		 */
		GetRoot: function() {
			return config.rootElement;
		},

		/**
		 * Return path to developers tool resources
		 * 
		 * @example
		 * Estate.Develop.GetDevtoolsPath()
		 * @returns {Object} Path to developers tool resources
		 */
		GetDevtoolsPath: function() {
			var path = config.devtoolsPath
			if (path != "") {
				path += "/"
			}
			return path
		},
		
		/**
		 * Creates a XmlHttpRequest
		 * 
		 * @example
		 * Estate.Develop.GetAjax()
		 * @returns {Object} Either XMLHttpRequest or ActiveXObject
		 */
		GetAjax: function() {
			if (window.XMLHttpRequest) {
				try {
					return new XMLHttpRequest();
				} catch(e) {
					return null;
				}
			} else if (window.ActiveXObject) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {
						return null;
					}
				}
			} else {
				return null
			}
		}
	}
	/* END PUBLIC */
})();





/**
 * @namespace Timer is a stopwatch to check how long some operation takes in the browser.
 * @constructor
 *
 * @param {String} [id] By giving the timer an id, you'll be able to distinguish different log results when using multiple timers
 * 
 * @example
 * var oTimer = new Estate.Develop.Timer('foo')
 * oTimer.Start()
 * oTimer.End()
 */
Estate.Develop.Timer = function(id) {
	this.timerID = "";
	if (typeof (id) == "string") {
		this.timerID = id;
	}

	/**
	 * Starts timer
	 *
	 * @example
	 * oTimer.Start()
	 * @returns {Null}
	 */
	this.Start = function() {
		var timeNow = new Date();
		this.timeStart = timeNow.getTime();
	}

	/**
	 * Ends timer
	 *
	 *
	 * @param [log] If false, the method will return its value as an object literal
	 *	like this: <code>{ id: 'foo', duration: 20}</code>. Any other value than
	 *	false will result in a message in the trace box of this developer tool.
	 * @example
	 * oTimer.End()
	 * @returns {Null|Object}
	 */
	this.End = function(log) {
		var timeNow = new Date();
		this.timeEnd = timeNow.getTime();

		if (log == undefined || log == true) {
			var logString = ""
			if (this.timerID != "") {
				logString += '"' + this.timerID + '" runs in <strong>'
			}
			logString += (this.timeEnd - this.timeStart)
			if (this.timerID != "") {
				logString += '</strong>'
			}
			logString += ' ms'
			dlog(logString);
			return null
		} else {
			return { id: this.timerID, duration: (this.timeEnd - this.timeStart) }
		}
	}
}






/**
 * @namespace TraceBox is an alternative for console.log: it wil show show debug
 * information on the webpage itself
 */
Estate.Develop.TraceBox = ( function() {
	var config = {
		traceBox: null,
		traceBoxClass: 'traceBox',
		traceBoxContent: null,
		traceBoxContentClass: 'traceBox_content',
		traceBoxToggle: null,
		traceBoxToggleClass: 'traceBox_toggle',
		consoleEnabled: false
	}
	
	if (typeof(console) == "object") {
		if (typeof(console.log) == "function") {
			config.consoleEnabled = true
		}
	}
	
	function createTraceBox() {
		if (config.traceBox == null) {
			var root = Estate.Develop.GetRoot()
			config.traceBox = document.createElement("div");
			config.traceBox.className = config.traceBoxClass;
			root.appendChild(config.traceBox);

			config.traceBoxContent = document.createElement("div");
			config.traceBoxContent.className = config.traceBoxContentClass;
			config.traceBox.appendChild(config.traceBoxContent);
			
			config.traceBoxToggle = document.createElement("div");
			config.traceBoxToggle.className = config.traceBoxToggleClass;
			config.traceBoxToggle.innerHTML = "&laquo;";
			config.traceBox.appendChild(config.traceBoxToggle);
			
			Estate.Events.AddEvent(config.traceBoxToggle, function() { showHide() }, "onclick")
		}
	}
	
	function showHide() {
		if (config.traceBox.className.indexOf('hidden') < 0) {
			config.traceBox.className += " traceBox_hidden"
			config.traceBoxToggle.innerHTML = "&raquo;"
		} else {
			config.traceBox.className = config.traceBox.className.replace(" traceBox_hidden", "")
			config.traceBoxToggle.innerHTML = "&laquo;"
		}
	}

	function traceAttributesElement(element) {
		var error;
		error = Estate.Check.Element( element );
		if ( error != "" ) throw new Error( error );

		var attributes

		attributes = "&lt;" + element.tagName + "&gt;: "
		for (var i = 0; i < element.attributes.length; i++) {
			var attr = element.attributes[i];
			attributes += " "+ attr.name +"='"+ attr.value +"'"
		}

		return attributes
	}
	
	// Documentation of this global function at the bottom of this document
	window.dlog = function(string) {
		Estate.Develop.TraceBox.Trace( string, false );
	}
	
	// Documentation of this global function at the bottom of this document
	window.clog = function(string) {
		Estate.Develop.TraceBox.Trace( string, true )
	}



	/* START PUBLIC */
	return {
		/**
		 * Prints a givenstring n the tracebox.
		 * 
		 * @param {String|Object} printThis Either string that will be printed on the screen or a DOM element
		 * @param {Boolean} doConsole Use console.log if that exists
		 * @example
		 * Estate.Develop.TraceBox.Trace( 'Showthis', false )
		 * @returns {Null}
		 */
		Trace: function( printThis, doConsole ) {
			var printString = printThis
			if (typeof(printThis) == "object") {
				if (typeof(printThis.tagName) == "string") {
					printString = traceAttributesElement(printThis)
				}
			}
			
			if (doConsole && config.consoleEnabled) {
				console.log(printString)
			} else {
				createTraceBox();
				config.traceBoxContent.innerHTML = '<span><em>&#8226;</em> ' + printString + '</span>' + config.traceBoxContent.innerHTML;
			}
		},
		
		/**
		 * Adds the tracebox to the DOM
		 * 
		 * @example
		 * Estate.Develop.TraceBox.CreateTraceBox()
		 * @returns {Null}
		 */
		CreateTraceBox: function() {
			createTraceBox()
		}		
	}
	/* END PUBLIC */
})();




/**
 * @namespace Creates and manages the developer menu
 */
Estate.Develop.Menu = ( function() {
	var config = {
		menu: null,
		menuClass: 'dev_menu',	
		buttons: null,
		buttonsClass: 'dev_buttons'	
	}
	var hideMenuTimeout

	var menuContainer = document.createElement('div');
	menuContainer.className = config.menuClass + "Container inactive";
	Estate.Develop.GetRoot().appendChild(menuContainer);
	
	var menu = document.createElement('div');
	menu.className = config.menuClass;
	menuContainer.appendChild(menu);

	setHoverEvents()
	
	var logo = document.createElement('a');
	logo.className = 'dev_logo';
	logo.href = 'http://www.thebrightlines.com/2010/12/16/estate-developer-tools'
	logo.target = '_blank'
	menu.appendChild(logo);
	
	var buttons = document.createElement("div");
	buttons.className = config.buttonsClass;
	menu.appendChild(buttons);
	
	var isOldIE = checkOldIE()
	
	function setHoverEvents() {
		Estate.Events.AddEvent(
			menuContainer,
			function() {
				clearTimeout(hideMenuTimeout)
				if (menuContainer.className.indexOf(" active") == -1) {
					menuContainer.className += " active"
					menuContainer.className = menuContainer.className.replace(" inactive", "")
				}					
			},
			"onmouseover"
		)
	
		Estate.Events.AddEvent(
			menuContainer,
			function() {
				hideMenuTimeout = setTimeout(
					function() {
						menuContainer.className = menuContainer.className.replace(" active", "")
						menuContainer.className += " inactive"
					},
					1000
				)
			},
			"onmouseout"
		)

		Estate.Events.AddEvent(
			menu,
			function() {
				clearTimeout(hideMenuTimeout)
			},
			"onmouseover"
		)
		
		Estate.Events.AddEvent(
			menu,
			function() {
				clearTimeout(hideMenuTimeout)
			},
			"onmouseout"
		)
	}

	function checkOldIE() {
		if (navigator.userAgent.indexOf('MSIE 7') > 0 || navigator.userAgent.indexOf('MSIE 6') > 0) {
			return true;
		}
		if (document.documentMode) {
			if (document.documentMode <= 7) {
				return true
			}
		}
		return false
	}
	
	function setMenuWidth() {
		var aButtons = buttons.childNodes
		var totalWidth = 0
		var totalWidthTrace = ""
		for (var i = 0; i < aButtons.length; i++) {
			if (aButtons[i].childNodes.length == 2) {
				aButtons[i].childNodes[1].style.display = "none"
			}
			if (isOldIE) {
				totalWidth += aButtons[i].scrollWidth
			} else {
				totalWidth += aButtons[i].offsetWidth
			}
			if (aButtons[i].childNodes.length == 2) {
				aButtons[i].childNodes[1].style.display = ""
			}
		}
		if (isOldIE) {
			totalWidth += 5
		}
		menu.style.width = totalWidth + "px"
	}

	/* START PUBLIC */
	return {
		/**
		 * Adds a button to the menu
		 * 
		 * @param {String} buttontext The text as it appears in the menu button
		 * @param {String} tooltipText The text that appears at mouseover
		 * @returns {Object} The created button element
		 * @example
		 * Estate.Develop.Menu.AddMenuItem('Button text', 'Tooltip text')
		 */
		AddMenuItem: function(buttontext, tooltipText) {
			var button = document.createElement("div");
			button.className = "dev_button"
			button.innerHTML = buttontext;
			buttons.appendChild(button);
			
			if (tooltipText != null) {
				var tooltip = document.createElement("div");
				tooltip.className = "dev_tooltip"
				tooltip.innerHTML = tooltipText;
				button.appendChild(tooltip);
			}
			
			setMenuWidth()
						
			return button;
		},
		
		/**
		 * Recalculates the menu width
		 * 
		 * @returns {Null}
		 * @example
		 * Estate.Develop.Menu.SetMenuWidth()
		 */
		SetMenuWidth: function() {
			setMenuWidth()
		}
	}
	/* END PUBLIC */
})();






/**
 * @namespace Adds button and keyboard shortcut to toggle the visibility of
 * the Estate developer tools, so you can see the website without the
 * developer tools floating around. This code runs automatically at startup
 */
Estate.Develop.ToggleVisibility = ( function() {
	var button
	
	// Toggles the visibility of the developer toos
	function showHide() {
		var devRoot = Estate.Develop.GetRoot()
		
		if (devRoot.style.display == '') {
			devRoot.style.display = 'none';
		} else {
			devRoot.style.display = '';
		}
	}
	
	return {
		/**
		 * Initializes events for showing and hiding the developer tools
		 * 
		 * @example
		 * Estate.Develop.ToggleVisibility.Init()
		 * @returns {Null}
		 */
		Init: function() {
			// Creates button in menu
			button = Estate.Develop.Menu.AddMenuItem('x', 'Press "~"')
			button.className += " close"
			
			// Adds click event to button
			Estate.Events.AddEvent(button, showHide, "onclick")
			
			// Adds keypress event that toggles the visibility
			Estate.Events.AddEvent(
				document,
				function(e) {
					var KeyID = (window.event) ? event.keyCode : e.which;
					if (KeyID == 126) {
						showHide()									
					}
				},
				"onkeypress"
			)
		}
	}
})();






/**
 * @namespace Enables user to see the HTML structure. It focuses on SEO. It shows
 * the HTML structure by disabling all active style sheets and enabling one that
 * will highlight all elements that are important in SEO and accessibility.
 */
Estate.Develop.Structure = ( function() {
	var config = {
		buttonName: "Structure",
		cssStructure: "css/structure.css",
		useColumns: false,
		columnSize: 800
	}
	var button
	var req
	var testWindow
	var columnClass
	
	
	
	function showStructure() {
		var showsStructure = false
		
		// Enabling or disabling styleSheets
		for (var i=0; i < document.styleSheets.length; i++) {
			if (typeof(document.styleSheets[i].href) != "null") {
				if (document.styleSheets[i].href.indexOf('devtools/') == -1 || document.styleSheets[i].href.indexOf(config.cssStructure) > -1) {
					if (document.styleSheets[i].disabled == true) {
						document.styleSheets[i].disabled = false
					} else {
						document.styleSheets[i].disabled = true
					}
				}
				if (document.styleSheets[i].href.indexOf(config.cssStructure) > -1) {
					if (document.styleSheets[i].disabled == false) {
						showsStructure = true
					}
				}
			}
		}
		
		// Set body class to enable columns in CSS (if enabled)
		if (showsStructure == true && config.useColumns == true) {
			document.body.className = document.body.className.replace(columnClass, "") 
			var pageWidth = (window.innerWidth) ? window.innerWidth : document.documentElement.clientWidth
			columnClass = "columns" + Math.ceil(pageWidth / config.columnSize)
			document.body.className += " "+ columnClass 
		}
	}
	
	
	
	return {
		/**
		 * Initializes HTML structure check
		 * 
		 * @param {Object} [newConfig Configuration] object.
		 * @param {Boolean} [newConfig.useColumns] If set to true, the page content
		 *	will be divided in columns if the window is wide enough (and if the browser
			supports CSS3 columns)
		 * @param {Number} [newConfig.columnSize] The minimum size of a column.
		 *
		 * @example
		 * Estate.Develop.Structure.Init( {useColumns: true, columnSize: 700} )
		 * @returns {Null}
		 */
		Init: function(newConfig) {
			// Update internal config
			var error = ""
			if (typeof(newConfig) == 'object' && typeof(newConfig.constructor) == 'object' && newConfig.constructor.toString().indexOf('Event') == -1) {
				if (newConfig) {
					error = Estate.Check.LiteralUpdatable(config, newConfig);
				}
				if (error != "") {
					throw new Error(error);
				}
				Estate.Check.UpdateLiteral(config, newConfig)
			}

			// Creates button in menu
			button = Estate.Develop.Menu.AddMenuItem(config.buttonName)
			
			// Adds click event to button
			Estate.Events.AddEvent(
				button,
				showStructure,
				"onclick"
			)
			
			// Add link to extra style sheet, but disable it for now
			var css = document.createElement("link")
			css.id = config.stylesheetID
			css.rel = "stylesheet"
			css.type = "text/css"
			css.media = "screen, handheld, print"
			var cssPath = Estate.Develop.GetDevtoolsPath() + config.cssStructure
			css.href = cssPath
			document.getElementsByTagName("head")[0].appendChild(css)
			css.disabled = true
		}
	}
})();






/**
 * @namespace Validates the unparsed HTML 
 */
Estate.Develop.Validate = ( function() {
	var config = {
		buttonName: "Validate"
	}
	var button
	var req
	var testWindow
	var validateService
	

	
	function validate() {
		button.firstChild.nodeValue = "Running test..."
		Estate.Develop.Menu.SetMenuWidth()

		req = Estate.Develop.GetAjax()
		req.open("GET", document.location.href, true)
		req.onreadystatechange = reqReadyStateChange
		req.send("")
	}
	
	function reqReadyStateChange() {
		if (req.readyState == 4 && req.status == 200) {
			pageHTML = req.responseText
			var pageHTML = pageHTML.replace(/</g, '&lt;')
			var pageHTML = pageHTML.replace(/>/g, '&gt;')
			var formHTML = ""
			
			testWindow = window.open(document.location.href)
			
			formHTML += "<html>"
			formHTML += "	<head>"
			formHTML += "		<title>Validating page...</title>"
			formHTML += "	</head>"
			formHTML += "	<body onload='document.forms[0].submit()'>"
			switch(true) {
				case (validateService == 'validator.nu'):
					formHTML += "		<form action='http://validator.nu' method='post' enctype='multipart/form-data'>"
					formHTML += "			<textarea name='content'>"+ pageHTML +"</textarea>"
					formHTML += "			<input type='checkbox' value='yes' id='showsource' name='showsource' checked>"
					formHTML += "			<input type='submit'>"
					formHTML += "		</form>"
					break;
				case (validateService == 'validator.w3.org'):
					formHTML += "		<form action='http://validator.w3.org/check' action='check' enctype='multipart/form-data' method='post'>"
					formHTML += "			<textarea name='fragment' id='fragment'>"+ pageHTML +"</textarea>"
					formHTML += "			<input type='checkbox' value='1' name='ss' id='direct-ss' checked>"
					formHTML += "			<input type='submit'>"
					formHTML += "		</form>"
					break;
			}
			formHTML += "	</body>"
			formHTML += "</html>"
			
			testWindow.document.write(formHTML)
			testWindow.document.close()
			
			button.firstChild.nodeValue = config.buttonName
			Estate.Develop.Menu.SetMenuWidth()
		}
	}
	
	function removeTagsByName(tag, string) {
		var re= new RegExp('<'+tag+'[^><]*>|<.'+tag+'[^><]*>','g')
		return string.replace(re,'');
	}
	

	
	return {
		/**
		 * Validates unparsed HTML of current page
		 * 
		 * @example
		 * Estate.Develop.Validate.Init()
		 * @returns {Null}
		 */
		Init: function(arg_validateService) {
			validateService = arg_validateService
			// Creates button in menu
			button = Estate.Develop.Menu.AddMenuItem(config.buttonName)
			
			// Adds click event to button
			Estate.Events.AddEvent(
				button,
				validate,
				"onclick"
			)
			
			/*
			Estate.Events.AddEvent(
				document,
				function(e) {
					var KeyID = (window.event) ? event.keyCode : e.which;
					toggleClasses(e)									
				},
				"onkeypress"
			)
			*/
		}
	}
})();






/**
 * @namespace Forces a CSS reload without reloading the whole page. Very
 * handy when the DOM is drastically changed by JavaScript. This code runs
 * automatically at startup
 */
Estate.Develop.ReloadCSS = ( function() {
	var button
	
	// Forcing CSS reload by changing the href
	function reload(event) {
		var links = document.getElementsByTagName('link')
		var devtoolsPath = Estate.Develop.GetDevtoolsPath()
		for ( CSSDoc = 0; CSSDoc < links.length; CSSDoc++ ) {
			if (links[CSSDoc].href && links[CSSDoc].disabled == false) {
				// The link has a href
				if (links[CSSDoc].href.indexOf('.css') > 0 && links[CSSDoc].href.indexOf(devtoolsPath) == -1) {
					var previousHref = links[CSSDoc].href
					links[CSSDoc].href = ""
					links[CSSDoc].href = reloadUrl(previousHref)
				}
			}
		}
	}
	
	function reloadUrl(href) {
		var newHref = href
		if (newHref.indexOf("reload=") < 0) {
			if (newHref.indexOf("?") < 0) {
				newHref += "?"
			} else {
				newHref += "&"
			}
			newHref += "reload=1"
		} else {
			var value = parseInt(Estate.StringTools.GetQueryString("reload", href))
			newHref = href
			newHref = newHref.substring(0, newHref.indexOf('?reload='))
			newHref += '?reload=' + (value + 1)
		}
		return newHref
	}
	
	return {
		/**
		 * Initializes CSS reload button and key button event
		 * 
		 * @example
		 * Estate.Develop.ReloadCSS.Init()
		 * @returns {Null}
		 */
		Init: function() {
			// Creates button in menu
			button = Estate.Develop.Menu.AddMenuItem('Reload CSS', 'Press "|"')
			
			// Adds click event to button
			Estate.Events.AddEvent(button, function(event) { reload(event) }, "onclick")
			
			// Adds keypress event that triggers CSS reload
			Estate.Events.AddEvent(
				document,
				function(e) {
					var KeyID = (window.event) ? event.keyCode : e.which;
					if (KeyID == 124) {
						reload(e)									
					}
				},
				"onkeypress"
			)
		},
		
		/**
		 * Force reload of all external CSS files. This method can be run
		 * without running Estate.Develop.ReloadCSS.Init() first. 
		 * 
		 * @example
		 * Estate.Develop.ReloadCss.Reload()
		 * @returns {Function} Returns internal reload function that in turn returns Null
		 */
		Reload: function(href) {
			return reload(href)
		}
	}
})();






/**
 * Prints the argument in the tracebox.
 * 
 * @param {String|Object} printThis The argument will always be printed in the tracebox
 * @example
 * dlog('Lorem ipsum dolor sit amet')
 * @returns {Null}
 */
/* The documentation above refers to a global function that is created in the
 * namespace Estate.Develop.TraceBox. The documentation is placed outside the 
 * namespace so that the documentation tool JSDoc-Toolkit can recognize it
 * as a global function
 */
function dlog() {}

/**
 * Prints the argument in the browsers' developer console if available. If not, it will print it in the tracebox in the page.
 * 
 * @param {String|Object} printThis The argument that will be printed in either the console or the tracebox
 * @example
 * clog('Lorem ipsum dolor sit amet')
 * @returns {Null}
 */
/* The documentation above refers to a global function that is created in the
 * namespace Estate.Develop.TraceBox. The documentation is placed outside the 
 * namespace so that the documentation tool JSDoc-Toolkit can recognize it
 * as a global function
 */
function clog() {}