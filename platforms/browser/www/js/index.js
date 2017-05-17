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

   // $('.video').html('<iframe width="200" height="215" src="http://www.youtube.com/embed/PEfxz7PuI0g?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');

    cordova.plugins.barcodeScanner.scan(

      function (result) {
          /*alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);*/

          //var isbn = '9781524261450';

          var base_url = 'http://dap-rest-prod.mircloud.host/api';

          $.ajax({
              url: base_url+'/book/isbn/'+result.text,
              success: function(response) {
                  if (response.error) {
                      alert('Вибачте, немає інформації про дану книгу');
                  } else {
                      var id = response.response;

                      $.ajax({
                          url: base_url+'/book/'+id+'?fields=id,name,original_name,rating,video_type,video_link,authors_id',
                          success: function(response) {
                              var book = response.response;
                              if (book) {
                                  $('.name').text(book.name);
                                  $('.cover').attr('src', base_url + '/storage/book/'+book.id+'/cover');
                                  $('.rating').text(book.rating);

                                  $('.video').html('<iframe width="200" height="215" src="http://www.youtube.com/embed/'+book.video_link+'?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');

                                  $.ajax({
                                      url: base_url+'/author/?fields=name&restrict='+JSON.stringify({authors_id: book.authors_id}),
                                      success: function(response) {
                                          var authors = response.response;
                                          if (authors) {
                                              var result = '';
                                              authors.forEach(function(author){
                                                  result += author.name + ', ';
                                              });

                                              $('.authors').text(result);
                                          }
                                      }
                                  });

                                  $.ajax({
                                      url: base_url + '/book/'+book.id+'/comments?limit=20&fields=comment,name',
                                      success: function(response) {
                                          var comments = response.response;



                                          if (comments) {
                                              var result = '';
                                              comments.forEach(function(comment){
                                                  result += comment.name + '<br/>' + comment.comment + '<br /><hr/><br/>';
                                              });

                                              $('.comments').html(result);
                                          }
                                      }, error: function() {
                                              alert('error in comments');
                                      }
                                  })
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