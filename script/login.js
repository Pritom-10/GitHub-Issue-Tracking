document.getElementById("sign-btn").addEventListener("click", function () {
  const inputUser = document.getElementById("input-username");

  const Username = inputUser.value;

  const inputPassword = document.getElementById("input-password");

  const Password = inputPassword.value;

  if (Username === "admin" && Password === "admin123") {
    window.location.assign("/Homepage.html");
  } else {
    alert("login failed");
  }
});
