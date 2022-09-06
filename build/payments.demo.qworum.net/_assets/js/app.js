if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then((registration) => {
		if (registration.installing) {
			console.log('Service worker installing');
		} else if(registration.waiting) {
			console.log('Service worker installed');
		} else if(registration.active) {
			console.log('Service worker active');
			// registration.update();
		}
		
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve(`Direct message from SW: ${event.data}`);
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}
