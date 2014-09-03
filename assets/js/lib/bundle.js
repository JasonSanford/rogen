(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ClassificationSet;

ClassificationSet = (function() {
  function ClassificationSet(classification_set_json) {
    this.classification_set_obj = classification_set_json.classification_set;
  }

  ClassificationSet.prototype.name = function() {
    return this.classification_set_obj.name;
  };

  ClassificationSet.prototype.id = function() {
    return this.classification_set_obj.id;
  };

  ClassificationSet.prototype.getValueByID = function(id) {
    var item, _i, _len, _ref;
    _ref = this.classification_set_obj.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.value === id) {
        return item.label;
      }
    }
    return '';
  };

  return ClassificationSet;

})();

module.exports = ClassificationSet;



},{}],2:[function(require,module,exports){
var ClassificationSet, Form, xhr;

xhr = require('xhr');

ClassificationSet = require('./classification_set');

Form = (function() {
  function Form(form_json) {
    this.form_obj = form_json.form;
    this.init();
  }

  Form.prototype.classification_sets = {};

  Form.prototype.init = function() {
    return this.findClassificationSets(this.form_obj.elements);
  };

  Form.prototype.findClassificationSets = function(elements) {
    var element, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      if (element.type === 'Section') {
        _results.push(this.findClassificationSets(element.elements));
      } else if (element.type === 'ClassificationField') {
        _results.push(this.fetchClassificationSet(element.classification_set_id));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Form.prototype.fetchClassificationSet = function(classification_set_id) {
    var xhr_callback, xhr_options;
    xhr_options = {
      uri: "/api/classification_sets/" + classification_set_id,
      json: true
    };
    xhr_callback = (function(_this) {
      return function(error, response, classification_set_obj) {
        var classification_set;
        if (error) {
          console.log(error);
          return;
        }
        classification_set = new ClassificationSet(classification_set_obj);
        return _this.classification_sets[classification_set_id] = classification_set;
      };
    })(this);
    return xhr(xhr_options, xhr_callback);
  };

  Form.prototype.name = function() {
    return this.form_obj.name;
  };

  Form.prototype.record_title_key = function() {
    return this.form_obj.record_title_key;
  };

  return Form;

})();

module.exports = Form;



},{"./classification_set":1,"xhr":14}],3:[function(require,module,exports){
var getForm, xhr;

xhr = require('xhr');

getForm = function(cb) {
  var xhr_callback, xhr_options;
  xhr_options = {
    uri: '/api/form',
    json: true
  };
  xhr_callback = function(error, response, records) {
    if (error) {
      return cb(error, null);
    } else {
      return cb(null, records);
    }
  };
  return xhr(xhr_options, xhr_callback);
};

module.exports = {
  getForm: getForm
};



},{"xhr":14}],4:[function(require,module,exports){
var Form, Record, RecordCreator, RecordViewer, async, formAndRecordsCallback, form_utils, getForm, getRecords, map, map_utils, nameApp, record_utils;

async = require('async');

Form = require('./form');

Record = require('./record');

map_utils = require('./map_utils');

form_utils = require('./form_utils');

record_utils = require('./records/utils');

RecordViewer = require('./records/viewer');

RecordCreator = require('./records/creator');

map = map_utils.createMap('map-container');

getForm = function(callback) {
  return form_utils.getForm(function(error, form) {
    if (error) {
      return callback(error);
    } else {
      return callback(null, form);
    }
  });
};

getRecords = function(callback) {
  return record_utils.getRecords(function(error, records) {
    if (error) {
      return callback(error);
    } else {
      return callback(null, records);
    }
  });
};

nameApp = function(app_name) {
  document.title = app_name;
  return $('#brand').text(app_name);
};

formAndRecordsCallback = function(error, results) {
  var features_layer, form, form_json, geojson_layer_options, records;
  if (error) {
    console.log(error);
    return;
  }
  form_json = results.form;
  records = results.records;
  form = new Form(form_json);
  nameApp(form.name());
  geojson_layer_options = {
    onEachFeature: function(feature, layer) {
      return layer.on('click', function() {
        var record, record_display;
        record = new Record(feature, form);
        return record_display = new RecordViewer(form, record);
      });
    }
  };
  features_layer = map_utils.createGeoJSONLayer(geojson_layer_options);
  map.addLayer(features_layer);
  features_layer.addData(records);
  map.fitBounds(features_layer.getBounds());
  return $('#new-record-a').on('click', function(event) {
    var record_creator;
    event.preventDefault();
    return record_creator = new RecordCreator(form);
  });
};

async.parallel({
  form: getForm,
  records: getRecords
}, formAndRecordsCallback);



},{"./form":2,"./form_utils":3,"./map_utils":5,"./record":8,"./records/creator":9,"./records/utils":10,"./records/viewer":11,"async":13}],5:[function(require,module,exports){
var createGeoJSONLayer, createMap, layer_configs, utils;

layer_configs = require('./layer_configs');

utils = require('../utils');

createMap = function(div_id, options) {
  var base_layers, layersControl, map, map_options, satellite_layer, streets_layer;
  if (options && 'layersControl' in options) {
    layersControl = options.layersControl;
    delete options.layersControl;
  }
  map_options = {
    center: [0, 0],
    zoom: 4,
    attributionControl: false
  };
  utils.extend(map_options, options);
  map = new L.Map(div_id, map_options);
  streets_layer = new L.TileLayer(layer_configs.mapbox_streets.url, layer_configs.mapbox_streets.options);
  satellite_layer = new L.TileLayer(layer_configs.mapbox_satellite.url, layer_configs.mapbox_satellite.options);
  map.addLayer(streets_layer);
  if (layersControl === void 0 || layersControl) {
    base_layers = {
      'Street': streets_layer,
      'Satellite': satellite_layer
    };
    L.control.layers(base_layers, null).addTo(map);
  }
  return map;
};

createGeoJSONLayer = function(geojson_options) {
  var layer;
  layer = new L.GeoJSON(null, geojson_options);
  return layer;
};

module.exports = {
  createMap: createMap,
  createGeoJSONLayer: createGeoJSONLayer
};



},{"../utils":12,"./layer_configs":6}],6:[function(require,module,exports){
var layer_configs;

layer_configs = {
  mapbox_streets: {
    name: 'MapBox Streets',
    url: 'https://{s}.tiles.mapbox.com/v3/spatialnetworks.map-6l9yntw9/{z}/{x}/{y}.png',
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a> &mdash; <a target='_blank' href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a> 2014 <a target='_blank' href='http://openstreetmap.org'>OpenStreetMap.org</a> contributors",
      minZoom: 2,
      maxZoom: 19
    }
  },
  mapbox_satellite: {
    name: 'MapBox Satellite',
    url: 'https://api.tiles.mapbox.com/v3/spatialnetworks.map-xkumo5oi/{z}/{x}/{y}.png',
    options: {
      attribution: "Tiles Courtesy of <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>",
      minZoom: 2,
      maxZoom: 19
    }
  }
};

module.exports = layer_configs;



},{}],7:[function(require,module,exports){
var PhotoDisplay, xhr;

xhr = require('xhr');

PhotoDisplay = (function() {
  function PhotoDisplay(photo_obj) {
    this.photo_obj = photo_obj;
  }

  PhotoDisplay.prototype.render = function() {
    var xhr_callback, xhr_options;
    xhr_options = {
      uri: "/api/photos/" + this.photo_obj.photo_id,
      json: true
    };
    xhr_callback = (function(_this) {
      return function(error, response, photo_obj) {
        var photo_html_parts;
        if (error) {
          console.log(error);
          return;
        }
        photo_html_parts = ["<a href='" + photo_obj.photo.large + "' target='_blank'>", "<img src='" + photo_obj.photo.thumbnail + "' />", "</a>"];
        return $("#photo-" + _this.photo_obj.photo_id).html(photo_html_parts.join(''));
      };
    })(this);
    return xhr(xhr_options, xhr_callback);
  };

  return PhotoDisplay;

})();

module.exports = PhotoDisplay;



},{"xhr":14}],8:[function(require,module,exports){
var Record;

Record = (function() {
  function Record(record_geojson, form) {
    this.record_geojson = record_geojson;
    this.form = form;
  }

  Record.prototype.title = function() {
    var title_key;
    title_key = this.form.record_title_key();
    if (this.record_geojson.properties[title_key]) {
      return this.record_geojson.properties[title_key];
    } else {
      return '&nbsp;';
    }
  };

  return Record;

})();

module.exports = Record;



},{}],9:[function(require,module,exports){
var Creator, form, formGroup, map_utils, panel, panelBody, xhr,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

xhr = require('xhr');

map_utils = require('../map_utils');

panelBody = function(panel_body_html) {
  return "<div class='panel-body'>" + panel_body_html + "</div>";
};

panel = function(panel_html) {
  return "<div class='panel panel-default'>" + panel_html + "</div>";
};

form = function(form_html) {
  return "";
};

formGroup = function(form_group_html) {
  return "<div class='form-group'>" + form_group_html + "</div>";
};

Creator = (function() {
  function Creator(form) {
    this.form = form;
    this.mapMove = __bind(this.mapMove, this);
    this.$modal_container = $('#new-record-modal');
    this.$map_container = this.$modal_container.find('.new-record-map-container');
    this.$html_form = this.$modal_container.find('form');
    this.init();
  }

  Creator.prototype.createMap = function() {
    var locate_control;
    this.map = map_utils.createMap(this.$map_container[0], {
      zoomControl: false
    });
    this.map.on('moveend', this.mapMove);
    locate_control = L.control.locate({
      follow: true,
      stopFollowingOnDrag: true
    });
    locate_control.addTo(this.map);
    return locate_control.locate();
  };

  Creator.prototype.mapMove = function() {
    var center;
    center = this.map.getCenter();
    $('#latitude').val(center.lat);
    return $('#longitude').val(center.lng);
  };

  Creator.prototype.formSubmit = function() {
    var xhr_callback, xhr_options;
    xhr_options = {
      uri: '/api/records',
      method: 'POST',
      body: this.$html_form.serialize(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    xhr_callback = (function(_this) {
      return function(error, response, record_obj) {
        if (error) {
          window.alert(error);
          return;
        }
        console.log(record_obj);
        window.alert('saved!');
        return _this.destroy();
      };
    })(this);
    return xhr(xhr_options, xhr_callback);
  };

  Creator.prototype.initBeforeEvents = function() {
    this.$html_form.on('submit', (function(_this) {
      return function(event) {
        event.preventDefault();
        event.stopPropagation();
        return _this.formSubmit();
      };
    })(this));
    return this.$modal_container.on('shown.bs.modal', (function(_this) {
      return function(event) {
        return _this.createMap();
      };
    })(this));
  };

  Creator.prototype.initAfterEvents = function() {
    return $('.yes-no').on('click', (function(_this) {
      return function(event) {
        var $button;
        event.preventDefault();
        $button = $(event.target);
        $button.siblings('a.yes-no').removeClass('active');
        $button.addClass('active');
        return $("#" + ($button.data('input-id'))).val($button.data('yes-no-val'));
      };
    })(this));
  };

  Creator.prototype.generateLabel = function(element) {
    return "<div class='alert alert-info'>" + element.label + "</div>";
  };

  Creator.prototype.generateSection = function(element) {
    var html, html_parts, inner_element, inner_element_html, _i, _len, _ref;
    html_parts = [];
    _ref = element.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inner_element = _ref[_i];
      inner_element_html = this.generateElement(inner_element);
      html_parts.push(panelBody(inner_element_html));
      html = panel(html_parts.join(''));
    }
    return panel("<div class='panel-heading'><h3 class='panel-title'>" + element.label + "</h3></div>" + (panelBody(html)));
  };

  Creator.prototype.generateTextField = function(element) {
    var input_type;
    input_type = element.numeric ? 'number' : 'text';
    return panel(panelBody(formGroup("<label>" + element.label + "</label><input type='" + input_type + "' class='form-control' data-fulcrum-field-type='" + element.type + "' id='" + element.key + "' name='" + element.key + "'>")));
  };

  Creator.prototype.generateDateTimeField = function(element) {
    return panel(panelBody(formGroup("<label>" + element.label + "</label><input type='date' class='form-control' data-fulcrum-field-type='" + element.type + "' id='" + element.key + "' name='" + element.key + "'>")));
  };

  Creator.prototype.generateTimeField = function(element) {
    return panel(panelBody(formGroup("<label>" + element.label + "</label><input type='time' class='form-control' data-fulcrum-field-type='" + element.type + "' id='" + element.key + "' name='" + element.key + "'>")));
  };

  Creator.prototype.generateYesNoField = function(element) {
    var buttons, input;
    buttons = "<a class='btn btn-default yes-no' data-input-id='" + element.key + "' data-yes-no-val='" + element.positive.value + "' role='button'>" + element.positive.label + "</a><a class='btn btn-default yes-no' data-input-id='" + element.key + "' data-yes-no-val='" + element.negative.value + "' role='button'>" + element.negative.label + "</a>";
    if (element.neutral_enabled) {
      buttons += "<a class='btn btn-default yes-no' data-input-id='" + element.key + "' data-yes-no-val='" + element.neutral.value + "' role='button'>" + element.neutral.label + "</a>";
    }
    input = "<input type='hidden' id='" + element.key + "' name='" + element.key + "'>";
    buttons = "<div class='btn-group btn-group-justified'>" + buttons + "</div>";
    return panel(panelBody(formGroup("<label>" + element.label + "</label>" + buttons + input)));
  };

  Creator.prototype.generateElement = function(element) {
    var html;
    if (this["generate" + element.type]) {
      html = this["generate" + element.type](element);
    } else {
      console.log("Could not render element " + element.type);
      html = '';
    }
    return html;
  };

  Creator.prototype.generateHTMLContent = function() {
    var element, parts, _i, _len, _ref;
    parts = [];
    _ref = this.form.form_obj.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      parts.push(this.generateElement(element));
    }
    return this.html_content = parts.join('');
  };

  Creator.prototype.init = function() {
    this.initBeforeEvents();
    this.generateHTMLContent();
    this.$modal_container.find('.modal-body').find('.content').html(this.html_content);
    this.$modal_container.modal();
    return this.initAfterEvents();
  };

  Creator.prototype.destroy = function() {
    this.map.remove();
    this.$modal_container.find('.modal-body').find('.content').html('');
    return this.$modal_container.modal('hide');
  };

  return Creator;

})();

module.exports = Creator;



},{"../map_utils":5,"xhr":14}],10:[function(require,module,exports){
var getRecords, xhr;

xhr = require('xhr');

getRecords = function(cb) {
  var xhr_callback, xhr_options;
  xhr_options = {
    uri: '/api/records',
    json: true
  };
  xhr_callback = function(error, response, records) {
    if (error) {
      return cb(error, null);
    } else {
      return cb(null, records);
    }
  };
  return xhr(xhr_options, xhr_callback);
};

module.exports = {
  getRecords: getRecords
};



},{"xhr":14}],11:[function(require,module,exports){
var PhotoDisplay, Viewer, panel, panelBody;

PhotoDisplay = require('../photo_display');

panelBody = function(panel_body_html) {
  return "<div class='panel-body'>" + panel_body_html + "</div>";
};

panel = function(panel_html) {
  return "<div class='panel panel-default'>" + panel_html + "</div>";
};

Viewer = (function() {
  function Viewer(form, record) {
    this.form = form;
    this.record = record;
    this.$modal_container = $('#record-modal');
    this.init();
  }

  Viewer.prototype.photo_displays = [];

  Viewer.prototype.generateChoiceField = function(element) {
    var choice_values, display, other_values, values;
    if (choice_values = this.record.record_geojson.properties[element.key]) {
      choice_values = this.record.record_geojson.properties[element.key].choice_values;
      other_values = this.record.record_geojson.properties[element.key].other_values;
      if (element.multiple) {
        values = choice_values.concat(other_values);
      } else {
        values = [choice_values.length ? choice_values[0] : other_values[0]];
      }
      display = values.join(', ');
      if (!display) {
        display = '%nbsp;';
      }
    } else {
      display = '&nbsp;';
    }
    return panel(panelBody("<dl><dt>" + element.label + "</dt><dd>" + display + "</dd></dl>"));
  };

  Viewer.prototype.generateClassificationField = function(element) {
    var choice_values, display, other_values, values;
    if (choice_values = this.record.record_geojson.properties[element.key]) {
      choice_values = this.record.record_geojson.properties[element.key].choice_values;
      other_values = this.record.record_geojson.properties[element.key].other_values;
      if (element.multiple) {
        values = choice_values.concat(other_values);
      } else {
        values = [choice_values.length ? choice_values[0] : other_values[0]];
      }
      values = values.map((function(_this) {
        return function(value) {
          return _this.form.classification_sets[element.classification_set_id].getValueByID(value);
        };
      })(this));
      display = values.join(', ');
      if (!display) {
        display = '%nbsp;';
      }
    } else {
      display = '&nbsp;';
    }
    return panel(panelBody("<dl><dt>" + element.label + "</dt><dd>" + display + "</dd></dl>"));
  };

  Viewer.prototype.generateDateTimeField = function(element) {
    return this.generateTimeFieldAndDateTimeField(element);
  };

  Viewer.prototype.generateTimeField = function(element) {
    return this.generateTimeFieldAndDateTimeField(element);
  };

  Viewer.prototype.generateTimeFieldAndDateTimeField = function(element) {
    var value;
    value = this.record.record_geojson.properties[element.key];
    if (!value) {
      value = '%nbsp;';
    }
    return panel(panelBody("<dl><dt>" + element.label + "</dt><dd>" + value + "</dd></dl>"));
  };

  Viewer.prototype.generateHyperlinkField = function(element) {
    var link, url;
    url = this.record.record_geojson.properties[element.key] ? this.record.record_geojson.properties[element.key] : element.default_url;
    if (url) {
      link = "<a target='_blank' href='" + url + "'>" + url + "</a>";
    } else {
      link = '&nbsp;';
    }
    return panel(panelBody("<h4>" + element.label + "</h4><p>" + link + "</p>"));
  };

  Viewer.prototype.generateLabel = function(element) {
    return "<div class='alert alert-info'>" + element.label + "</div>";
  };

  Viewer.prototype.generatePhotoField = function(element) {
    var photo, photos_html_parts, _i, _len, _ref;
    photos_html_parts = [];
    if (this.record.record_geojson.properties[element.key]) {
      photos_html_parts.push('<div class="row photo-row">');
      _ref = this.record.record_geojson.properties[element.key];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        photo = _ref[_i];
        photos_html_parts.push("<div class='thumbnail col-xs-6 col-md-3' id='photo-" + photo.photo_id + "'></div>");
        this.photo_displays.push(new PhotoDisplay(photo));
      }
      photos_html_parts.push('</div>');
    }
    return panel("<div class='panel-heading'><h3 class='panel-title'>" + element.label + "</h3></div>" + (panelBody(photos_html_parts.join(''))));
  };

  Viewer.prototype.generateTextField = function(element) {
    var value;
    if (this.record.record_geojson.properties[element.key]) {
      value = this.record.record_geojson.properties[element.key];
    } else {
      value = '&nbsp;';
    }
    if (element.numeric) {
      return panel(panelBody("<dl><dt>" + element.label + "</dt><dd>" + value + "</dd></dl>"));
    } else {
      return panel(panelBody("<h4>" + element.label + "</h4><p>" + value + "</p>"));
    }
  };

  Viewer.prototype.generateYesNoField = function(element) {
    var alert_klass, glyphicon, label, pos_neg_neu, value;
    value = this.record.record_geojson.properties[element.key];
    if (value) {
      if (value === element.positive.value) {
        pos_neg_neu = 'positive';
        alert_klass = 'success';
        glyphicon = 'thumbs-up';
      } else if (value === element.negative.value) {
        pos_neg_neu = 'negative';
        alert_klass = 'danger';
        glyphicon = 'thumbs-down';
      } else {
        pos_neg_neu = 'neutral';
        alert_klass = 'warning';
        glyphicon = 'adjust';
      }
      label = element[pos_neg_neu].label;
      value = "<div class='alert alert-" + alert_klass + " yesno'><i class='glyphicon glyphicon-" + glyphicon + "' /> <strong>" + label + "</strong></div>";
    } else {
      value = '&nbsp;';
    }
    return panel(panelBody("<dl><dt>" + element.label + "</dt><dd>" + value + "</dd></dl>"));
  };

  Viewer.prototype.generateSection = function(element) {
    var html, html_parts, inner_element, inner_element_html, _i, _len, _ref;
    html_parts = [];
    _ref = element.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inner_element = _ref[_i];
      inner_element_html = this.generateElement(inner_element);
      html_parts.push(panelBody(inner_element_html));
      html = panel(html_parts.join(''));
    }
    return panel("<div class='panel-heading'><h3 class='panel-title'>" + element.label + "</h3></div>" + (panelBody(html)));
  };

  Viewer.prototype.generateElement = function(element) {
    var html;
    if (this["generate" + element.type]) {
      html = this["generate" + element.type](element);
    } else {
      console.log("Could not render element " + element.type);
      html = '';
    }
    return html;
  };

  Viewer.prototype.generateHTMLContent = function() {
    var element, parts, _i, _len, _ref;
    parts = [];
    _ref = this.form.form_obj.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      parts.push(this.generateElement(element));
    }
    return this.html_content = parts.join('');
  };

  Viewer.prototype.init = function() {
    var photo_display, _i, _len, _ref, _results;
    this.generateHTMLContent();
    this.$modal_container.find('.modal-title').html(this.record.title());
    this.$modal_container.find('.modal-body').html(this.html_content);
    this.$modal_container.modal();
    _ref = this.photo_displays;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      photo_display = _ref[_i];
      _results.push(photo_display.render());
    }
    return _results;
  };

  return Viewer;

})();

module.exports = Viewer;



},{"../photo_display":7}],12:[function(require,module,exports){
var extend;

extend = function(object, properties) {
  var key, val;
  for (key in properties) {
    val = properties[key];
    object[key] = val;
  }
  return object;
};

module.exports = {
  extend: extend
};



},{}],13:[function(require,module,exports){
(function (process){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
                q.process();
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                q.process();
            }
        };
        return q;
    };
    
    async.priorityQueue = function (worker, concurrency) {
        
        function _compareTasks(a, b){
          return a.priority - b.priority;
        };
        
        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        
        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };
              
              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }
        
        // Start with a normal queue
        var q = async.queue(worker, concurrency);
        
        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        
        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require("UPikzY"))
},{"UPikzY":21}],14:[function(require,module,exports){
var window = require("global/window")
var once = require("once")
var parseHeaders = require('parse-headers')

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ? XHR : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new XDR()
        }else{
            xhr = new XHR()
        }
    }

    var uri = xhr.url = options.uri || options.url;
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var key
    var load = options.response ? loadResponse : loadXhr

    if ("json" in options) {
        isJson = true
        headers["Accept"] = "application/json"
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri, !sync)
                                    //backward compatibility
    if (options.withCredentials || (options.cors && options.withCredentials !== false)) {
        xhr.withCredentials = true
    }

    // Cannot set timeout with sync request
    if (!sync) {
        xhr.timeout = "timeout" in options ? options.timeout : 5000
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers) {
        throw new Error("Headers cannot be set on an XDomainRequest object");
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = null

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === 'text' || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function getStatusCode() {
        return xhr.status === 1223 ? 204 : xhr.status
    }

    // if we're getting a none-ok statusCode, build & return an error
    function errorFromStatusCode(status) {
        var error = null
        if (status === 0 || (status >= 400 && status < 600)) {
            var message = (typeof body === "string" ? body : false) ||
                messages[String(status).charAt(0)]
            error = new Error(message)
            error.statusCode = status
        };

        return error;
    }

    // will load the data & process the response in a special response object
    function loadResponse() {
        var status = getStatusCode();
        var error = errorFromStatusCode(status);
        var response = {
            body: getBody(),
            statusCode: status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders())
        };

        callback(error, response, response.body);
    }

    // will load the data and add some response properties to the source xhr
    // and then respond with that
    function loadXhr() {
        var status = getStatusCode()
        var error = errorFromStatusCode(status)

        xhr.status = xhr.statusCode = status;
        xhr.body = getBody();

        callback(error, xhr, xhr.body);
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":15,"once":16,"parse-headers":20}],15:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],17:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":18}],18:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],19:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],20:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')

        result[trim(row.slice(0, index)).toLowerCase()] =
          trim(row.slice(index + 1))
      }
  )

  return result
}
},{"for-each":17,"trim":19}],21:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[4])