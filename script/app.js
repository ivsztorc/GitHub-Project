$(function(){
  $('#ghsubmitbtn').on('click', function(e){
    e.preventDefault();
    $('#ghapidata').html('<div id="loader" class="loader"><img src="css/loader.gif" alt="loading..."></div>');
    
    var username = $('#ghusername').val();
    var requri   = 'https://api.github.com/users/'+username;
    var repouri  = 'https://api.github.com/users/'+username+'/repos';
    
    requestJSON(requri, function(json) {
      if(json.message == "Not Found" || username == '') {
        $('#ghapidata').html("<p class=\"error\">Does not exist</p>");
      }
      else {
        // else we have a user and we display their info
        var fullname   = json.name;
        var username   = json.login;
        var aviurl     = json.avatar_url;
        var profileurl = json.html_url;
        var bio        = json.bio;
        if(fullname == undefined) { fullname = username; }
        if(bio == null) { bio = "No Bio Found"; }
        
        var outhtml = '<div class="profile clearfix"><div class="avatar"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div><div class="details">@<a href="'+profileurl+'" target="_blank">'+username+'</a><h1>'+fullname+'</h1><p>'+bio+'</p></div></div>';
        outhtml += '<div class="ghcontent">';
        outhtml += '<h2>Repositories</h2>';
        outhtml += '<div class="repolist clearfix">';
        
        var repositories;
        $.getJSON(repouri, function(repo){
          repositories = repo;
          outputPageContent();                
        });          
        
        function outputPageContent() {
          if(repositories.length == 0) { outhtml += '<p class="error">No repositories for this user</p></div>'; }
          else {
            outhtml = outhtml + '<ul>';
            $.each(repositories, function(index) {
              outhtml += 
              '<li><a href="'
              +repositories[index].html_url+
              '" target="_blank"><div>'
              +repositories[index].name+
              '</div><span class="counters"><span class="stars"><span class="icon-star"></span>'
              +repositories[index].stargazers_count+
              '</span><span class="forks"><span class="icon-fork"></span>'
              +repositories[index].forks_count+
              '</span></span></a></li>';
            });
            outhtml += '</ul></div>'; 
          }
          $('#ghapidata').html(outhtml);
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
  }); // end click event handler
  
  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }
});