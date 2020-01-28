"use strict";define(["HubLink","RIB","PropertiesPanel","Easy"],function(i,e,n,s){var t=["Read","Reset","Move"],f=["Bytes","Finished"],o={isOutputBlock:!1,getActions:function(){return t},getInputs:function(){return f},onBeforeSave:function(){return{}},onLoad:function(){var e=this;this.config=this.config||{},this.displayState("warning","Please select a file"),this.loadTemplate("properties.html").then(function(i){e.propTemplate=i})},hasMissingProperties:function(){return void 0===this._fileConfig},onExecute:function(i){var e=this;i&&this._fileConfig&&("Read"==i.action?(0===i.data||!0===i.data?i.data=1:i.data=parseInt(Number(i.data)),o.getBytes.call(this,i.data,function(i){e.processData({Bytes:i}),e._fileConfig._offset>=e._fileConfig._file.size&&(e.processData({Finished:!0}),e._fileConfig._offset=0)})):"Reset"==i.action?this._fileConfig._offset=0:"Move"==i.action&&(isNaN(i.data)||(this._fileConfig._offset=parseInt(Number(i.data)))))},onClick:function(){o.renderInterface.call(this)},getBytes:function(i,t){var e=new FileReader,n=i,s=this;e.onload=function(i){var e=new Uint8Array(i.target.result);this._fileConfig._offset+=n,"function"==typeof t&&t.call(s,e)}.bind(this),this._fileConfig._offset+n>this.config.fileInfo.size&&(n=this.config.fileInfo.size-this._fileConfig._offset);var f=this._fileConfig._file.slice(this._fileConfig._offset,this._fileConfig._offset+n);e.readAsArrayBuffer(f)},loadFile:function(i){this.propertiesWindow.find("#btSelectFile");var e=i.size;1024<e?e<1048576?(e=parseInt(e/1024),e+=" Kb"):e<1073741824?(e=parseInt(e/1048576),e+=" MB"):(e=parseInt(e/1073741824),e+=" GB"):e+=" bytes",this.config.fileInfo={fileName:i.name,size:e},this._fileConfig={_offset:0,_file:i},this.clearState(),o.renderInterface.call(this)},renderInterface:function(){var e=this;if(this.propTemplate&&n.isVisible()){s.clearAll(),this.propertiesWindow=$(this.propTemplate(this.config));var i=this.propertiesWindow.find("#btSelectFile"),t=this.propertiesWindow.find(".openFile");i.click(function(){t.click()}),t.on("change",function(i){o.loadFile.call(e,this.files[0])});s.displayCustomSettings(this.propertiesWindow,!0,!0)}}};return o});