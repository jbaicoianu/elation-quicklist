elation.component.add("quicklist.list", function() {
  this.init = function() {
    console.log('cool guy', this);
    this.container.innerHTML = this.args.label;
  }
});
