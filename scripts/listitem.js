elation.component.add("quicklist.listitem", function() {
  this.init = function() {
    console.log('really cool guy', this);
    this.container.innerHTML = this.args.label;
  }
});

