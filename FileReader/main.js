/*
 * Written by Alexander Agudelo < alex.agudelo@asurantech.com >, 2018
 * Date: 12/Apr/2018
 * Last Modified: 13/04/2018, 1:14:43 pm
 * Modified By: Alexander Agudelo
 * Description:  Reads files from disks and makes the content available to the LM
 * 
 * ------
 * Copyright (C) 2018 Asuran Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

define(['HubLink', 'RIB', 'PropertiesPanel', 'Easy'], function(Hub, RIB, PropertiesPanel, easy) {
  var actions = [
    "Read",
    "Reset",
    "Move"
  ];
  
  var inputs = ['Bytes', 'Finished'];
  var BinaryReader = {};


  BinaryReader.isOutputBlock = false;

  // TODO: Review if this is a trully unique instance?

  BinaryReader.getActions = function() {
    return actions;
  };


  BinaryReader.getInputs = function() {
    return inputs;
  };

  BinaryReader.onBeforeSave = function() {
    return {};      // Nothing to store
  };

  /**
   * Triggered when added for the first time to the side bar.
   * This script should subscribe to all the events and broadcast
   * to all its copies the data.
   * NOTE: The call is bind to the block's instance, hence 'this'
   * does not refer to this module, for that use 'FileReader'
   */
  BinaryReader.onLoad = function(){
    var that = this;
    this.config = this.config || {};

    // if (this.storedSettings && this.storedSettings.fileIndex) {
    //   this.config._fileIndex = this.storedSettings.fileIndex
    // }
    

    this.loadTemplate('properties.html').then(function(template){
      that.propTemplate = template;
    });
  };

  /**
   * Parent is asking me to execute my logic.
   * This block only initiate processing with
   * actions from the hardware.
   */
  BinaryReader.onExecute = function(event) {
    var that = this;
    if(event){
      if(event.action == 'Read'){
        if(event.data === 0 || event.data === true){
          event.data = 1;
        }else{
          event.data = parseInt(Number(event.data));
        }
  
        BinaryReader.getBytes.call(this, event.data, function(bytes){
          that.processData({bytes: bytes});
          if(that._fileConfig._offset >= that._fileConfig._file.size){
            that.processData({finished: true});
            that._fileConfig._offset = 0;
          }
        });
      }else if(event.action == 'Reset'){
        this._fileConfig._offset = 0;
      }else if(event.action == 'Move'){
        if(!isNaN(event.data)){
          this._fileConfig._offset = parseInt(Number(event.data));
        }
      }
    }
  };

  /**
   * Triggered when the user clicks on a block.
   * The interface builder is automatically opened.
   * Here we must load the elements.
   * NOTE: This is called with the scope set to the
   * Block object, to call this modules properties
   * use FileReader or this.controller
   */
  BinaryReader.onClick = function(){
    BinaryReader.renderInterface.call(this);
  };

  /**
   * Reads the requested bytes from the
   * selected file.
   */
  BinaryReader.getBytes = function(total, callback){
    var reader = new FileReader();
    var CHUNK_SIZE = total;
    var that = this;
    
    var onData = function(e){
      var contents = new Uint8Array(e.target.result);
      this._fileConfig._offset += CHUNK_SIZE;
      if(typeof callback === 'function'){
        callback.call(that, contents);
      }
    }

    reader.onload = onData.bind(this);

    // Trim chunk if it overflows
    if( (this._fileConfig._offset + CHUNK_SIZE) > this.config.fileInfo.size){
      CHUNK_SIZE = this.config.fileInfo.size - this._fileConfig._offset;
    }

    var slice =  this._fileConfig._file.slice(this._fileConfig._offset, this._fileConfig._offset + CHUNK_SIZE);
    reader.readAsArrayBuffer(slice);  
    
  };

  BinaryReader.loadFile = function(file){
    var button = this.propertiesWindow.find("#btSelectFile");
    var size = file.size;
    if(size > 1024){
      if(size < 1048576){
        size = parseInt(size / 1024);
        size += " Kb"
      }else{
        if(size < 1073741824){
          size = parseInt(size / 1048576);
          size += " MB"
        }else{
          size = parseInt(size / 1073741824);
          size += " GB"
        }
      }
    }else{
      size += " bytes"
    }
    
    this.config.fileInfo = {
      fileName: file.name,
      size: size, 
    };

    this._fileConfig = {
      _offset: 0,
      _file: file
    };


    BinaryReader.renderInterface.call(this);
  };
  

  BinaryReader.renderInterface = function(){
    var that = this;
    var that = this;
    if(!this.propTemplate) return;
    if(!PropertiesPanel.isVisible()) return;

    easy.clearAll();

    
    this.propertiesWindow = $(this.propTemplate(this.config));

    var openFileBtn = this.propertiesWindow.find("#btSelectFile");
    var file = this.propertiesWindow.find(".openFile");
  
    
    openFileBtn.click(function() {
      file.click();
    });

    
    file.on('change', function fileSelected(e){
      BinaryReader.loadFile.call(that, this.files[0]);
    });

    // Display elements
    var clearAll = true;
    var removeSaveButton = true;
    easy.displayCustomSettings(this.propertiesWindow, clearAll, removeSaveButton);
  }

  return BinaryReader;
});
