/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @param {string} name The name of our DB we want to use
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		//Refator-START
		// cache property for faster memory access
		//callback.call(this, JSON.parse(localStorage[name])); -prev line of code
		this._cache = JSON.parse(localStorage[name]);
		callback.call(this, this._cache)
		//END
		
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		//Refator-START
		// get todo from cache

		//var todos = JSON.parse(localStorage[this._dbName]).todos;

		var todos = this._cache.todos;

		//END

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};

		//Refator-START
		// get todos from cache

		//callback.call(this, JSON.parse(localStorage[this._dbName]).todos);

		callback.call(this, this._cache.todos);
		//END
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	Store.prototype.save = function (updateData, callback, id) {
		//Refator-START
		// fetch from cache
		//var data = JSON.parse(localStorage[this._dbName]);
		var data = this._cache;
		//END
		var todos = data.todos;

		callback = callback || function () {};
		//Refator-START
		// generate an id only when needed - commentED out for loop

		// Generate an ID
	    // var newId = ""; 
	    // var charset = "0123456789";

        // for (var i = 0; i < 6; i++) {
     	// 	newId += charset.charAt(Math.floor(Math.random() * charset.length));
		// }

		//END



		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}
			//Refator-START
			//Moved to after if/else instead of having duplicate code.
			// It needs to run in both situations.
			//localStorage[this._dbName] = JSON.stringify(data);
			//END
			callback.call(this, todos);
		} else {
			//Refator-START
    		// Assign an ID
			// TODO: Can this be generated in a safer (unique) manner? Timestamp? Sequentially or auto increase somehow?
			var newId = '';
			var charset = '0123456789';
			for (var i = 0; i < 6; i++) {
			  newId += charset.charAt(Math.floor(Math.random() * charset.length));
			}
	  
			//END
			
			updateData.id = parseInt(newId);
			todos.push(updateData);

			//Refator-START
			//Moved to after if/else instead of having duplicate code.
			// It needs to run in both situations.
			//localStorage[this._dbName] = JSON.stringify(data);
			//END
			
			callback.call(this, [updateData]);
		}
		localStorage[this._dbName] = JSON.stringify(data);
	};

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	Store.prototype.remove = function (id, callback) {
		//START-refactor
		//fetch data from cache 
		//var data = JSON.parse(localStorage[this._dbName]);
		var data = this._cache;
		//END

		var todos = data.todos;
		//START-refactor
		// redundant variable declaration
		
		//var todoId;

		//END
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				//START-refactor
				// redundant variable declaration

				//todoId = todos[i].id;

				//END
				todos.splice(i, 1);
			}
		}

		//START-refactor
		// splice as been moved above, code is redundant

		// for (var i = 0; i < todos.length; i++) {
		// 	if (todos[i].id == todoId) {
		// 		todos.splice(i, 1);
		// 	}
		// }

		//END

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		//START- refactor
		//replce local storage with cache
		//var data = {todos: []};
		//localStorage[this._dbName] = JSON.stringify(data);
		//callback.call(this, data.todos);

		this._cache = {todos: [] };
		localStorage[this._dbName] = JSON.stringify(this._cache);
		callback.call(this, this._cache.todos);

		//END
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);