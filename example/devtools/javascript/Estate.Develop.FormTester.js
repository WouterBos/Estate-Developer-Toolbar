/**
 * @fileOverview Code for automatically filling in form fields with test data
 * 
 * @author Wouter Bos, web developer at www.estate.nl
 * @since 1.0 - 2008
 * @version 1.1 - 2010-12-21
 * @requires Estate.js
 * @requires Estate.Develop.js
 */





/**
 * @namespace Holds all FormTester code.
 */
Estate.Develop.FormTester = ( function() {
	var config = {
		test: {
			badHTML: true,
			jsInjection: true,
			lineBreak: true,
			sqlInjection: true,
			utf8: true
		},
		testStrings: {
			input: '',
			textarea: ''
		}
	}

	var menuButton
	var radioNamesCollection = new Array()
	var testStrings = {
		badHTML: '</div></td> < ',
		jsInjection: '<script>var alrt; if (typeof(alrt) == "undefined") { alert("javascript injection"); alrt = 1 }</script> ',
		lineBreak: 'Nullam nisi turpis, semper nec, dapibus quis, vestibulum ac. Metus sagittis non egestas sed, fermentum sit amet. \r\n\r\n Cras et massa.',
		main: '#REPLACE# Lorem ipsum dolor sit amet. ',
		sqlInjection: "' OR '1'='1 ",
		utf8: 'éالْعَرَبيّة汉语/漢語 '
	}



	function buildTestString() {
		// Create test string for input fields
		if (config.testStrings.input == '') {
			config.testStrings.input += testStrings.main
			if (config.test.utf8) {
				config.testStrings.input += testStrings.utf8
			}
			if (config.test.jsInjection) {
				config.testStrings.input += testStrings.jsInjection
			}
			if (config.test.badHTML) {
				config.testStrings.input += testStrings.badHTML
			}
			if (config.test.sqlInjection) {
				config.testStrings.input += testStrings.sqlInjection
			}
		}
		
		// Create test string for text areas
		if (config.testStrings.textarea == '') {
			config.testStrings.textarea += testStrings.main
			if (config.test.utf8) {
				config.testStrings.textarea += testStrings.utf8
			}
			if (config.test.lineBreak) {
				config.testStrings.textarea == testStrings.lineBreak
			}
			if (config.test.jsInjection) {
				config.testStrings.textarea += testStrings.jsInjection
			}
			if (config.test.badHTML) {
				config.testStrings.textarea += testStrings.badHTML
			}
			if (config.test.sqlInjection) {
				config.testStrings.textarea += testStrings.sqlInjection
			}
		}
	}

	// Fills in "text" form fields or equivalent
	function fillText( element ) {
		try {
			if (element.className.indexOf('tag_noAutofill') == -1) {
				element.value = config.testStrings.input.replace("#REPLACE#", '['+ element.name +']')
			}
		}
		catch (e) {}
	}

	// Fills in "number" and "range" form fields
	function fillNumber( element ) {
		var min = -1000000
		var max = 1000000
		try {
			if (element.min) {
				min = parseInt(element.min)
			}
			if (element.max) {
				max = parseInt(element.max)
			}
			
			if (min > max) {
				max = min + 1000
			}
			
			var difference = min - max
			if (difference < 0) {
				difference = difference * -1
			}
			
			var newValue = Math.ceil( (Math.random() * difference) + min )
			element.value = newValue
		}
		catch (e) {}
	}
	
	// Fills in textarea form fields or equivalent
	function fillTextarea( element ) {
		try {
			if (document.all) {
				element.innerText = config.testStrings.textarea.replace("#REPLACE#", element.name)
			} else {
				element.innerHTML = config.testStrings.textarea.replace("#REPLACE#", element.name)
			}
		}
		catch (e) {}
	}

	// Finds all radiobuttons that belong to one group and returns it as an array
	function getRadioNames( element, newRadioNamesCollection ) {
		try {
			var radioNameFound = false
			
			for ( var i=0; i < newRadioNamesCollection.length; i++ ) {
				if ( newRadioNamesCollection[i] == element.name ) {
					radioNameFound = true
				}
			}
			
			if ( element.name != "" ) {
				if ( radioNameFound == false ) {
					newRadioNamesCollection.push( element.name )
				}
			}
			return newRadioNamesCollection
		}
		catch (e) {}
	}

	// Checks one item in a radio button list at random
	function fillRadioByName( lRadioNamesCollection ) {
		try {
			var radioGroupCollection = new Array
			var randomElement
			
			for ( var i=0; i < lRadioNamesCollection.length; i++ ) {
				radioGroupCollection = document.getElementsByName( lRadioNamesCollection[i] )
				
				randomElement = Math.round( Math.random() * ( radioGroupCollection.length - 1 ) )
				radioGroupCollection[randomElement].checked = true
			}
		}
		catch (e) {}
	}

	// Checks a checkbos item at random 
	function fillCheckBox( element ) {
		try {
			var randomChecked = Math.round( Math.random() )

			if ( randomChecked == 0 ) {
				element.checked = ""
			} else {
				element.checked = "checked"
			}
		}
		catch (e) {}
	}

	// Selects an option in a select box at random
	function fillSelect( element ) {
		try {
			var randomOption = Math.floor( Math.random() * element.length )
			
			if ( randomOption == 0 && element.length > 1 && element.options[0].value == "" ) {
				randomOption = 1
			}
			
			element.options[randomOption].selected = true
		}
		catch (e) {}
	}
	
	
	
	/* START PUBLIC */
	return {
		/**
		 * Sets FormTester event and button
		 * 
		 * @param {Object} [newConfig] Configuration object.
		 * @param {Boolean} [newConfig.test.badHTML] Checks for bad HTML like tag closures without a tag start. Default value is true.
		 * @param {Boolean} [newConfig.test.jsInjection] Checks if form handles JavaScript injection. Default value is true.
		 * @param {Boolean} [newConfig.test.lineBreak] Adds a line break in a textarea. Default value is true.
		 * @param {Boolean} [newConfig.test.sqlInjection] Adds a sql injection in the input forms. Default value is true.
		 * @param {Boolean} [newConfig.test.utf8] Checks if the form handles foreign characters like Chinese and Arabic. Default value is true.
		 * @param {String} [newConfig.testStrings.input] Overrules the automatically generated test string for text input fields if the value is not empty.
		 * @param {String} [newConfig.testStrings.textarea] Overrules the automatically generated test string fortextareas if the value is not empty. 
		 * @example
		 * Estate.Events.AddEvent(
		 * 	window,
		 * 	function() {
		 * 		Estate.Develop.FormTester.Init({
		 * 			test: {
		 * 				badHTML: true,
		 * 				jsInjection: true,
		 * 				lineBreak: true,
		 * 				sqlInjection: true,
		 * 				utf8: true
		 * 			}
		 * 		})
		 * 	},
		 * 	"onload"
		 * )
		 */
		Init: function(newConfig) {
			var error
			error = Estate.Check.ArgumentsCount(arguments.length, [0,1]);
			if (error != "") throw new Error(error);
			if (newConfig != null) { // Make sure the variable exists
				if (newConfig.type == null) { // Make sure the variable is not an event object
					error = Estate.Check.LiteralUpdatable(config, newConfig);
					if (error != "") throw new Error(error);
					Estate.Check.UpdateLiteral(config, newConfig)
				}
			}
			
			buildTestString()
			menuButton = Estate.Develop.Menu.AddMenuItem('Form', 'Press "="')
			Estate.Events.AddEvent( menuButton, Estate.Develop.FormTester.AddDataToFormFields, "onclick")
			Estate.Events.AddEvent(
				document, 
				function(e) {
					var KeyID = (window.event) ? event.keyCode : e.which;
					if ( KeyID == 61 ) {
						// Fill forms if an "=" is pressed
						Estate.Develop.FormTester.AddDataToFormFields()
					}
				},
				"onkeypress"
			)
		},

		/**
		 * Fills in all form fields on the page. This method can be called
		 * without calling Estate.Develop.FormTester.Init() first.
		 * 
		 * @example
		 * Estate.Develop.FormTester.AddDataToFormFields()
		 */
		AddDataToFormFields: function() {
			var formFieldsCollection = document.getElementsByTagName( 'input' )
			
			for ( var i=0; i < formFieldsCollection.length; i++ ) {
				switch(formFieldsCollection[i].type) {
					case "email":
					case "password":
					case "search":
					case "text":
					case "url":
						fillText( formFieldsCollection[i] )
						break;
					case "date":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "1970-01-01"
						}
						break;
					case "month":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "1970-01"
						}
						break;
					case "week":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "1970-W01"
						}
						break;
					case "time":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "12:00"
						}
						break;
					case "datetime":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "1970-01-01T12:00Z"
						}
						break;
					case "datetime-local":
						fillText( formFieldsCollection[i] )
						if (formFieldsCollection[i].value == "") {
							formFieldsCollection[i].value = "1970-01-01T12:00"
						}
						break;
					case "number":
					case "range":
						fillNumber( formFieldsCollection[i] )
						break;
					case "radio":
						radioNamesCollection = getRadioNames( formFieldsCollection[i], radioNamesCollection )
						break;
					case "checkbox":
						fillCheckBox( formFieldsCollection[i] )
						break;
				}
			}
			fillRadioByName( radioNamesCollection )
			
			formFieldsCollection = document.getElementsByTagName( 'select' )
			for ( var i=0; i < formFieldsCollection.length; i++ ) {
				fillSelect( formFieldsCollection[i] )
			}

			formFieldsCollection = document.getElementsByTagName( 'textarea' )
			for ( var i=0; i < formFieldsCollection.length; i++ ) {
				fillTextarea( formFieldsCollection[i] )
			}
		}
	};
	/* END PUBLIC */
})();
