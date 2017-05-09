function a() {
    var isbn = '9781524261450';
    $.ajax({
        url: 'http://dap-rest-prod.mircloud.host/api/book/isbn/'+isbn,
        success: function(response) {
            if (response.error) {
                alert('error'+JSON.stringify(response.error));
            } else {
                var id = response.response;

                $.ajax({
                    url: 'http://dap-rest-prod.mircloud.host/api/book/'+id+'?fields=id,name,original_name,description',
                    success: function(response) {
                        alert(JSON.stringify(response));
                    },
                    error: function(xhr) {
                        alert('xhr'+JSON.stringify(xhr));
                    }
                });
            }
        }
    })
}
function barcodescanner(){
	cordova.plugins.barcodeScanner.scan(
      function (result) {
          /*alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);*/

          //var isbn = '9781524261450';
          $.ajax({
              url: 'http://dap-rest-prod.mircloud.host/api/book/isbn/'+result.text,
              success: function(response) {
                  if (response.error) {
                      alert('error'+JSON.stringify(response.error));
                  } else {
                      var id = response.response;

                      $.ajax({
                          url: 'http://dap-rest-prod.mircloud.host/api/book/'+id+'?fields=id,name,original_name,description',
                          success: function(response) {
                              alert(JSON.stringify(response));

                              var book = response.response;
                              if (book) {
                                  $('.name').text(book.name);
                                  $('.description').text(book.description);
                              }
                          },
                          error: function(xhr) {
                              alert('xhr'+JSON.stringify(xhr));
                          }
                      });
                  }
              }
          })
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "EAN_13,EAN_8,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS
      }
   );
}
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();