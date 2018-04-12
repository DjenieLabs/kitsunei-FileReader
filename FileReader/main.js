/*
 * Written by Alexander Agudelo < alex.agudelo@asurantech.com >, 2018
 * Date: 12/Apr/2018
 * Last Modified: 12/04/2018, 3:34:27 pm
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
  
  var inputs = ['Bytes', 'Offset', 'Finished'];
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
    return this.config;
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
    this.config = this.config || {_fileIndex: 0, filePath: false};

    if (this.storedSettings && this.storedSettings.fileIndex) {
      this.config._fileIndex = this.storedSettings.fileIndex
    }
    
    if (this.storedSettings && this.storedSettings.filePath) {
      this.config._filePath = this.storedSettings.filePath
    }


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
    console.log(event);
    if(event && event.action == 'Read'){
      
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

  BinaryReader.loadFile = function() {
    
  };

  BinaryReader.removeFile = function() {
    
  };


  BinaryReader.updateFromFile = function(index, file){
    if(index && index !== ''){
      var reader = new FileReader();
      var that = this;

      var binaryLoaded = function(e){
        var contents = e.target.result;
        console.log("Local file size: %d kb", contents.length/1024);
        
        var button = that.propertiesWindow.find("#btSelectFile");
        var icon = button.find("i");
        
      }

      // Disable the button while the user selects a file.
      this.propertiesWindow.find("#btSelectFile").addClass("disabled");
      // Disable the other buttons
      BinaryReader.toggleIconActive.call(this, 'file', true);

      reader.onload = binaryLoaded.bind(this);
      if(file){
        reader.readAsDataURL(file);  
      }else{
        BinaryReader.renderInterface.call(this);
      }
    }
  };
  

  BinaryReader.renderInterface = function(){
    var that = this;
    var that = this;
    if(!this.propTemplate) return;
    if(!PropertiesPanel.isVisible()) return;

    easy.clearAll();

    
    this.propertiesWindow = $(this.propTemplate(this.config));

    this.propertiesWindow.find("#btAdd").click(BinaryReader.loadFile.bind(this));
    this.propertiesWindow.find("#btRemove").click(BinaryReader.removeFile.bind(this));
    var file = this.propertiesWindow.find("#btRemove");

    this.propertiesWindow.find("#btSelectFile").click(function() {
      console.log("rendering");
      var index = $(this).attr("data-index");
      that.propertiesWindow.find(".openFile[data-index='"+index+"']").click();
    });

    

    // this.propertiesWindow.find("#txtSoundName").focusout(function(){
    //   var index = $(this).attr("data-index");
    //   if(index && index !== ''){
    //     index = Number(index);
    //     if(index < that.config.soundList.length-1){
    //       that.config.soundList[index].name = $(this).val();
    //     }
    //   }
    // });

    
    this.propertiesWindow.find(".openFile").on('change', function fileSelected(e){
      var index = $(this).attr("data-index");
      BinaryReader.updateFromFile.call(that, index, this.files[0]);
    });

    // Display elements
    var clearAll = true;
    var removeSaveButton = true;
    easy.displayCustomSettings(this.propertiesWindow, clearAll, removeSaveButton);
  }

  return BinaryReader;
});
