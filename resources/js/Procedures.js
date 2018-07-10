// Inicializar a pagina com o custo do personagem
window.onload = function() {
    $("[type='number']").keypress(function(evt) {evt.preventDefault();});
    var sheet = new SheetController();
    $('#advButton').click(function() {sheet.newAdvRow();});
    $('#disadvButton').click(function() {sheet.newDisadvRow();});
    $('#skillButton').click(function() {sheet.newSkillRow();});

    $('#advList').load('resources/html/advList.html');
    $('#disadvList').load('resources/html/disadvList.html');
    $('#skillList').load('resources/html/skillList.html');
}

function sendEmail() {
    if($('#emailTitle').val() == '' || $('#emailBody').val() == '') {
        $('#emailAlert').html('No one of the inputs can be empty!');
    }
    else {
        window.open('douglaasdd@gmail.com?subject='
        +encodeURIComponent($('#emailTitle').val())
        +'&body=' + encodeURIComponent($('#emailBody').val()));

        $('#bugModal').modal('toggle');
        $('#emailTitle').val('');
        $('#emailBody').val('');
        $('#emailAlert').html('');
        $('#emailSent').fadeIn();
        //$('#emailError').fadeIn();
        sendMessage();
    }
}

function sendMessage() {
    var accessToken = $rootScope.accessToken;
    var deferred = $q.defer();
    var sender = 'douglaasdd@gmail.com';
    var receiver = 'douglaasdd@gmail.com';
    var subject = 'Example Subject';
    var smileyIconPng = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFf0lEQVRIx42WW2xcVxWGv7X3OTMe3+IotZu44WKbJCQpVdJSWrWCyE7rVuoDkAeHoEo0RWpLEwpPvCGBInERCCRqR30ILQIJWgNShURQ7QSBFCOgwU4aSHNxbDeO48vEscmMZzznnL0XD2cyTalCOdJ6OGuf8///3vvfa23hfzzjLz3do873mWzQm2lr6PAeQDAGonxp0q/GQ1gZ3PTcy3+8HYbcBninhGakaVtbrqFrA9nGOrxbhniu+otCsJ64GFKYmKV4bqmssXt401d+OvaBBBf69/fXd7UcuPPT2/B+Cb96jiS+ilELKtXQ6tdKkLkDCTYx/+YNSlP5gS3Pv3LwtgQXXnzq1XXdHXubOzbgy6dJogkgqIIaUN4NQFRr70FmHYX5Thb+cum1rV995QvvI3j7xaf627o7DjR/pJ24OIzzKxj+S7VKFZj3kqaTwQaWwpUmFk7LwLYDRw7WCM4f3r+z7qNrR9t3bSW6MQxaBjUIggioTwOtgiNYLKjiPai/KQBsoMydamIlH9677bkjYwZAQjNy166txKUz4FbAG0SFMFAmzyjL1yAQEC/gLYFY5mcc0+OeMDDpUnkBL7jI0Lq9iIiOAARnD+/vadzelvPJElq5CGSrSuDUCfjniOKcsucZSy5nQGBxwTH8a4cxUCooH78nJHE390MQoHFjlDt7+Ms9RmPf19zZjiufAw3BK3gwwPykcm1mgqW5Ca5cBGsNViyLV4XrsxNcm5lg/jKISG0GKYmhpS3Ge/oCk7W9dU11VBZna+pBEAyrkXnXbr6MVkoISvRvreULSwuwmkF9E8asqZkh2+CRQHuDbFtjh0+WQQMgwGBQXyReuYwsXWf8TIH8wgqfe3ycaDYlXJ30nDzhEIEtayzRtCVeBRKPybUg2WY0t4Yw19URoAbcMuIruNIZktIi4hJQw6OfhaACnZtz3LXFkFQAB/fttjxTsIBw/y6DiwRBQEBXSmhxBZEZFt4YJygvTpEUpokXTiOSpS4jzExZWjcKqvDIXvAeknLVqh4qBeHBRy04wcXpxgYCJhTiBNQJYgVvQkzhrVHElwiCLFlr+cV3lcHDDougDpIK+FVQBziBpJpfFZJI0ESwCkcHEwZ+HNFUJxhNhYBilqcqk9n6dk7+wdHXHTF0wvHCtwJ8opCkS4JPgbmFJM2l4z6GPXtC/nbJcej7FRZnIACWl2XSVMrJUGEuw/27hddPZHhoh/DS9zy5EMTfBKwqugl8S048ZAy88fuEzXcKn9lhWZj3FPOWOGLISCiDl4ffwWdaKFz3PPuNkKuznp/9wNNQbzA1EvMe1TgQB7mM8NbfHT8fTjj4xSwPPBhy9z2WK+cNYnVQAH73xPrSYz/sylWmxxBjiYvCd74d01QvvPC1kIY1hrii+CStR8ZDgCAJ9B+JePOi50dfz9K8VnARiCjHXs+WP390vt4C9HXmjhZn/LMb7jX4YoQNhN3dlsVp5dBPIhYmleQGBB6Ki8rUuOf48YRDL1e4+8OGbz6fJZMVfAxBCKN/DiiW5IHB8ZW5Wrke7Lmj/74vdR5Y334BV/IghtAIRDD614R/nfXMXlMQaMgJOz5m2LkjoLFRqJTT8mJDuHLeMHrKDOwbzh98X8P5Zfe6Vz/5eGbvxk+USMqpHUXBChhJ7YhLz0OSCC5WNElBggy887bhH2PmtSeP5WsNx95K8Nup8m8e0lxr8ar5VPtmhxVBk9SGLk7PRBILSQQ+Sh0U2HTNT/4p4PxFM/Dk8fzTH9j0f9XbujMQHenarLkPbfc0Nnu8A7xJ7erBiFK8bpi+JFyasOXE68P7hvNj/9etokb0SGuPd9KXydC7tkU7tNrsRWBp2UxGsQ4Zw+C+Y/nbXlv+A87dvr+Q/yt3AAAAAElFTkSuQmCC';
    var messageText = 'This is the messsage text';
    var message = [
      'Content-Type: multipart/mixed; boundary="foo_bar_baz"', '\r\n',
      'MIME-Version: 1.0', '\r\n',
      'From: ', sender, '\r\n',
      'To: ', receiver, '\r\n',
      'Subject: ', subject, '\r\n\r\n',
  
      '--foo_bar_baz', '\r\n',
      'Content-Type: text/html; charset="UTF-8"', '\r\n',
      'MIME-Version: 1.0', '\r\n',
      'Content-Transfer-Encoding: 7bit', '\r\n\r\n',
  
      '<div style="width:700px; height:55px; background:red;">', messageText, '</div>', '\r\n\r\n',
  
      '--foo_bar_baz', '\r\n',
      'Content-Type: image/png', '\r\n',
      'MIME-Version: 1.0', '\r\n',
      'Content-Transfer-Encoding: base64', '\r\n',
      'Content-Disposition: attachment; filename="example.png"', '\r\n\r\n',
  
      smileyIconPng, '\r\n\r\n',
  
      '--foo_bar_baz--'
    ].join('');
  
     $.ajax({
      type: "POST",
      url: "https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart",
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      contentType: "message/rfc822",
      data: message
    }).then(deferred.resolve);
  }