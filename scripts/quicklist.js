elation.component.add("quicklist.main", function() {
  this.init = function() {
    this.initData();
    this.initHTML();
    this.initEvents();
  }
  /**
   * Initialize the data containers involved in making our app go
   */
  this.initData = function() {
    // First create a single container to hold a list of all lists
    this.listcontainer = elation.container.localindexed({
        index: "listname", 
        storagekey: "quicklist.lists"
      });

    // Then allocate an object to hold multiple ListItem containers, one for each list
    // These ListItem containers will be allocated as needed by this.getListItemContainer(listname)
    this.listitemcontainers = {};
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
        itemcontainer: this.listcontainer,
        append: this.panel_sidebar,
        attrs: { label: "listname" }
      });
    this.listitemlabel = elation.ui.label({
        label: "List Items",
        hidden: true,
        containertag: 'h2',
        append: this.panel_content
      });
    this.listiteminput = elation.ui.input({ 
        placeholder: "Add Item",
        hidden: true,
        append: this.panel_content
      });
    this.listitemview = elation.ui.list({
        attrs: { label: "itemname" },
        hidden: true,
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
   * Return the container associated with the named listitem, creating it if it doesn't exist yet
   * @param name string listname
   */
  this.getListItemContainer = function(listname) {
    if (!this.listitemcontainers[listname]) {
      this.listitemcontainers[listname] = elation.container.localindexed({
        index: "itemname",
        storagekey: "quicklist.lists." + listname
      });
    }
    return this.listitemcontainers[listname];
  }
  /**
   * Set the specified list as active
   * @param listname string Name of list to set as active
   */
  this.setActiveList = function(listname) {
    var list = this.listcontainer.get(listname)
    if (list) {
      this.activelist = list;
      this.listitemview.setItemContainer(this.getListItemContainer(listname));

      this.listitemlabel.setlabel(list.listname);
      this.listitemlabel.show();
      this.listitemview.show();
      this.listiteminput.show();
      this.listiteminput.clear(true);
    }
  }

  // Event handlers
  this.handleListAdd = function(ev) {
    var newvalue = this.listinput.value;
    if (newvalue != "") {
      this.listinput.clear();
      var newlist = new elation.quicklist.list(newvalue);
      this.listcontainer.add(newlist, 0);
      this.setActiveList(newvalue);
    }
  }
  this.handleListItemAdd = function(ev) {
    var newvalue = this.listiteminput.value;
    if (newvalue != "") {
      var container = this.getListItemContainer(this.activelist.listname);
      container.add(new elation.quicklist.listitem(newvalue), 0);
    }
    this.listiteminput.clear(true);
  }
  this.handleListSelect = function(ev) {
    this.setActiveList(ev.data.listname);
  }
  this.handleListItemSelect = function(ev) {
    var container = this.getListItemContainer(this.activelist.listname);
    container.remove(ev.data);
  }
});

elation.extend("quicklist.list", function(name) {
  this.listname = name;
});
elation.extend("quicklist.listitem", function(name) {
  this.itemname = name;
});
