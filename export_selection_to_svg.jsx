/*
 * Export selection to SVG - export_selection_as_SVG
 * (Adapted from Layers to SVG 0.1 - export_selection_as_SVG.jsx, by Rhys van der Waerden)
 *
 * @author SebCorbin
 */

// Variables
var ignoreHidden = true,
  svgExportOptions = (function () {
    var options = new ExportOptionsSVG();
    options.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
    options.embedRasterImages = false;
    options.fontType = SVGFontType.OUTLINEFONT;
    return options;
  }());

// Copy selection to a new document, and save it as an SVG file.
var saveSelection = function (file) {
  var objects = app.activeDocument.selection;
  if (objects.length > 0) {
    // Create temporary document and copy all selected objects.
    var doc = app.documents.add(DocumentColorSpace.RGB);
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
    copyObjectsTo(objects, doc);

    // Resize the artboard to the object
    selectAll(doc);
    doc.fitArtboardToSelectedArt(0); // Crashes without an index

    doc.exportFile(file, ExportType.SVG, svgExportOptions);

    // Remove everything
    doc.activeLayer.pageItems.removeAll();
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }
};

// Duplicate objects and add them to a document.
var copyObjectsTo = function (objects, destinationDocument) {
  for (var i = 0; i < objects.length; i++) {
    objects[i].duplicate(destinationDocument.activeLayer, ElementPlacement.PLACEATBEGINNING);
  }
};

// Selects all PageItems in the doc
var selectAll = function (doc) {
  var pageItems = doc.pageItems,
    numPageItems = doc.pageItems.length;
  for (var i = 0; i < numPageItems; i += 1) {
    pageItems[i].selected = true;
  }
};

// Init
(function () {
  var file = File.saveDialog('Add SVG file', 'SVG:*.svg');
  if (file) {
    saveSelection(file);
  }
}());
