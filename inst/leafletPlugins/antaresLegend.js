L.AntaresLegend = L.Control.extend({
  options: {
    position: "topright",
    htmlAreaColor: null,
    htmlAreaSize: null,
    htmlLinkColor: null,
    htmlLinkSize: null,
    collapsed: true
  },
  
  initialize: function(options) {
    var createEl = L.DomUtil.create;
    var container = createEl('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.backgroundColor = 'white';
    container.style.padding = "5px";
    
    var content = createEl("div", "", container);
    content.innerHTML = '\
      <div id = "legend-area" class="legend">\
        <h2>Areas</h2>\
        <div id="area-color" class="legend-section"></div>\
        <div id="area-size" class="legend-section"></div>\
        <div style="clear:both;"></div>\
      </div>\
      <div id = "legend-link" class="legend">\
        <h2>Links</h2>\
        <div id="link-color" class="legend-section"></div>\
        <div id="link-size" class="legend-section"></div>\
        <div style="clear:both;"></div>\
      </div>\
    ';
    
    var btn = createEl("button", "btn btn-link btn-xs pull-right", container);
    
    this._content = content;
    this._btn = btn;
    this._container = container;
    
    L.Control.prototype.initialize.call(this, options);
  },
  
  onAdd: function() {
    var self = this;
    
    this._btn.onclick = function() {
      self.options.collapsed = !self.options.collapsed;
      self.showHide();
    };
    
    this._reset();
    
    return this._container;
  },
  
  onRemove: function() {
    this._container.parentNode.removeChild(this._container);
  },
  
  _reset: function() {
    console.log(this._content.querySelector("#legend-area"));
    var legAreas = this._content.querySelector("#legend-area");
    var legLinks = this._content.querySelector("#legend-link");
    var o = this.options;
    
    // If the legend is empty, do not display it
    if (o.htmlAreaSize || o.htmlAreaColor || o.htmlLinkSize || o.htmlLinkColor) {
      this._container.style.display = "block";
      this.showHide();
    } else {
      this._container.style.display = "none";
      return;
    }
    
    // If one section is empty do not show this section
    legAreas.style.display = (!o.htmlAreaColor && !o.htmlAreaSize)?"none":"block";
    legLinks.style.display = (!o.htmlLinkColor && !o.htmlLinkSize)?"none":"block";
    
    // Update html of each section
    this._content.querySelector("#area-size").innerHTML = o.htmlAreaSize;
    this._content.querySelector("#area-color").innerHTML = o.htmlAreaColor;
    this._content.querySelector("#link-size").innerHTML = o.htmlLinkSize;
    this._content.querySelector("#link-color").innerHTML = o.htmlLinkColor;
  },
  
  showHide: function() {
    if (this.options.collapsed) {
      this._content.style.display = "none";
      this._btn.textContent = "Show legend";
    } else {
      this._content.style.display = "block";
      this._btn.textContent = "Hide legend";
    }
  },
  
  setOptions: function(options) {
    L.Util.setOptions(this, options);
    this._reset();
  }
});

L.antaresLegend = function (options) {
    return new L.AntaresLegend(options);
};

window.LeafletWidget.methods.addAntaresLegend = function(options) {
  var l = L.antaresLegend(options);
  this.controls.add(l, "antaresLegend");
};

window.LeafletWidget.methods.updateAntaresLegend = function(options) {
  var l = this.controls._controlsById.antaresLegend;
  l.setOptions(options);
};