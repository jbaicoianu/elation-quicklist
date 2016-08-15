elation.require(["elation.collection", "ui.list", "ui.checklist", "ui.input", "ui.label", "ui.panel"], function() {
  elation.requireCSS('quicklist.quicklist');

  elation.component.add("quicklist.main", function() {
    this.init = function() {
      this.initData();
      this.initHTML();
      this.initEvents();
    }
    /**
     * Initialize the data collections involved in making our app go
     */
    this.initData = function() {
      // First create a single collection to hold a list of all lists
      this.listcollection = elation.collection.localindexed({
          index: "listname", 
          storagekey: "quicklist.lists"
        });

      // Then allocate an object to hold multiple ListItem collections, one for each list
      // These ListItem collections will be allocated as needed by this.getListItemCollection(listname)
      this.listitemcollections = {};
    }
    /**
     * Create HTML layout and components
     */
    this.initHTML = function() {
      // Layout panels
      this.panel_main = elation.ui.panel({
          orientation: 'horizontal',
          classname: 'quicklist',
          append: this
        });
      this.panel_sidebar = this.panel_main.add(elation.ui.panel({
          orientation: 'vertical',
          classname: 'quicklist_sidebar'
        }));
      this.panel_content = this.panel_main.add(elation.ui.panel({
          orientation: 'vertical',
          classname: 'quicklist_content'
        }));

      // UI elements
      this.listlabel = elation.ui.label({
          label: "Lists",
          containertag: 'h2',
          append: this.panel_sidebar
        });
      this.listinput = elation.ui.input({ 
          placeholder: "Add List",
          autofocus: true,
          append: this.panel_sidebar
        });
      this.listview = elation.ui.list({
          itemcollection: this.listcollection,
          append: this.panel_sidebar,
          attrs: { label: "listname" }
        });
      this.listitemlabel = elation.ui.label({
          label: "List Items",
          hidden: true,
          containertag: 'h2',
          classname: 'quicklist_listitemlabel',
          append: this.panel_content
        });
      this.listiteminput = elation.ui.input({ 
          placeholder: "Add Item",
          hidden: true,
          append: this.panel_content
        });
      this.listitemview = elation.ui.checklist({
          attrs: { label: "itemname", checked: "done" },
          hidden: true,
          classname: 'quicklist_list_items',
          append: this.panel_content
        });
    }
    /**
     * Attach event handlers to the components we've created above
     */
    this.initEvents = function() {
      elation.events.add(this.listinput, "ui_input_accept", elation.bind(this, this.handleListAdd));
      elation.events.add(this.listview, "ui_list_select", elation.bind(this, this.handleListSelect));
      elation.events.add(this.listiteminput, "ui_input_accept", elation.bind(this, this.handleListItemAdd));
      elation.events.add(this.listitemview, "ui_list_select", elation.bind(this, this.handleListItemSelect));
    }
    /**
     * Return the collection associated with the named listitem, creating it if it doesn't exist yet
     * @param name string listname
     */
    this.getListItemCollection = function(listname) {
      if (!this.listitemcollections[listname]) {
        this.listitemcollections[listname] = elation.collection.localindexed({
          index: "itemname",
          storagekey: "quicklist.lists." + listname,
          events: {
            'collection_load': elation.bind(this, function() { this.listitemview.sort(this.sortitemlist);  })
          }
        });
      }
      return this.listitemcollections[listname];
    }
    /**
     * Set the specified list as active
     * @param listname string Name of list to set as active
     */
    this.setActiveList = function(listname) {
      var list = this.listcollection.get(listname)
      if (list) {
        this.activelist = list;
console.log('set list', listname, list);
        this.listitemview.setItemCollection(this.getListItemCollection(listname));

        this.listitemlabel.setlabel(list.listname);
        this.listitemlabel.show();
        this.listitemview.show();
        //this.listitemview.sort(this.sortitemlist);
        this.listiteminput.show();
        this.listiteminput.clear(true);
      }
    }

    // Event handlers
    this.handleListAdd = function(ev) {
      var newvalue = this.listinput.value;
      if (newvalue != "") {
        this.listinput.clear();
        var newlist = new elation.quicklist.list(newvalue, false);
        this.listcollection.add(newlist, 0);
        this.setActiveList(newvalue);
      }
    }
    this.handleListItemAdd = function(ev) {
      var newvalue = this.listiteminput.value;
      if (newvalue != "") {
        var collection = this.getListItemCollection(this.activelist.listname);
console.log('newthing', newvalue);
        collection.add(new elation.quicklist.listitem(newvalue), 0);
      }
      this.listiteminput.clear(true);
      //this.listitemview.sort(this.sortitemlist);
    }
    this.handleListSelect = function(ev) {
      this.setActiveList(ev.data.listname);
    }
    this.handleListItemSelect = function(ev) {
      var collection = this.getListItemCollection(this.activelist.listname);
      //collection.remove(ev.data);
      console.log(ev.data, ev.target);
      ev.data.done = ev.target.checked;
      collection.save();

      this.listitemview.sort(this.sortitemlist);
    }
    this.sortitemlist = function(a, b) {
      // Push finished item to the bottom
      if (a.value.done && !b.value.done) {
        return 1; 
      } else if (b.value.done && !a.value.done) {
        return -1;
      } 
      // Then sort alphabetically
      return a.value.itemname.localeCompare(b.value.itemname);
    }
  });

  elation.extend("quicklist.list", function(name) {
    this.listname = name;
  });
  elation.extend("quicklist.listitem", function(name) {
    this.itemname = name;
    this.done = false;
  });
});
