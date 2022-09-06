// Cross-browser JavaScript module for web pages.
// Used for communicating with the browser's Qworum extension.
// (I will make this available on GitHub.)
// 
// How it works: see https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage

class Qworum {
  static version = '1.0.0';
  static init() {
    // TODO remove this when the extension's content script can do window.history.forward() reliabl) 
    this._sendMessage(
      { type: '[Web page API v1] in session?' },
      function (response) {
        if (!response.inSession) return;
        window.history.forward();
      }
    );

  }

  static ping(callback) {
    this._sendMessage(
      { type: '[Web page API v1] ping' }, callback 
    )
  }

  static getData(pathOfVariable, callback) {
    this._log(`[getData] `);
    this._sendMessage(
      { type: '[Web page API v1] get data', path: pathOfVariable },
      callback
    )
  }

  // newValue: {type: 'JSONable', value: someValue} or {type: 'domain-specific', value: {type: 'namespace tag', value: xmlString} }
  static setData(pathOfVariable, newValue, callback) {
    this._log(`[setData] `);
    this._sendMessage(
      { type: '[Web page API v1] set data', path: pathOfVariable, value: newValue },
      callback
    )
  }

  static _sendMessage(message, callback) {
    const browserExtensionInfo = Qworum.getBrowserExtensionInfo();
    this._log(`Detected browser type: ${browserExtensionInfo.browserType}`);
    this._log(`web page -> extension: ${JSON.stringify(message)}`);
    
    if (browserExtensionInfo.browserType === 'chrome') {
      chrome.runtime.sendMessage(
        browserExtensionInfo.extensionId,
        message,
        
        function (response) {
          // this._log(`extension -> web page: ${JSON.stringify(response)}`); // BUG? use console.log instead ?
          console.log(`[Qworum library in Web page] extension -> web page: ${JSON.stringify(response)}`);
          if (typeof callback === 'function') callback(response);
        }
      );
    }
  }

  // Returns a non-null value if there is a Qworum extension for this browser.
  // WARNING A non-null value does not mean that 1) the Qworum extension is installed on this browser, or that 2) the browser extension is enabled for this website !!!
  static getBrowserExtensionInfo() {
    // extension ids for all supported browsers
    const browserExtensionIds = {
      // The following extension will be published on the Chrome Web Store (https://chrome.google.com/webstore/category/extensions).
      // Browsers that support Chrome Web Store: Google Chrome, Microsoft Edge, Brave, Opera ...
      chrome: 'lmikadfjgkcdcndneebdmkngidngaaab'
    };

    // extension info for this browser
    let browserExtensionInfo = null, browserType = null;
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      // this browser is compatible with Chrome Web Store
      browserType = 'chrome';
      browserExtensionInfo = {browserType, extensionId: browserExtensionIds[browserType]};
    }
    if(!browserExtensionInfo) throw new Error('Browser not supported by Qworum.');
    return browserExtensionInfo;
  }

  static _log(message) {
    console.log(`[Qworum for web page] ${message}`);
  }
}

// Qworum.init();

export {Qworum};
