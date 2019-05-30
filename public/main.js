document.getElementById("btn-login").addEventListener("click", () => {
    $.ajax({
      url: '/api/user/login',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ "username": document.getElementById('username').value, "password": document.getElementById('password').value}),
      dataType: 'json',
      success: function(response) {   
        localStorage.setItem('userId', response.user);
        localStorage.setItem('token', response.token);
        window.location.href = "/cafe";
      },
      error: function (errormessage) {
        document.getElementById("error").innerHTML = errormessage.responseText; 
      }
    });
});

if (localStorage.getItem("token")) window.location.href = "/cafe";