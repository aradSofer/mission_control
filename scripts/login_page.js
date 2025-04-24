document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
  
    toggleBtn.addEventListener("click", function () {
      const currentType = passwordInput.getAttribute("type");
      passwordInput.setAttribute("type", currentType === "password" ? "text" : "password");

    });
  });
  
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");
  
    loginButton.addEventListener("click", function () {
      const email = emailInput.value.trim();
      const password = passwordInput.value;
  
      const users = JSON.parse(localStorage.getItem("missionControl_users"));
  
      if (!users) {
        alert("המשתמש לא נמצא במערכת");
        return;
      }
  
      const foundUser = users.find(user => user.email === email);
  
      if (!foundUser) {
        alert("המשתמש לא נמצא במערכת");
      } else if (foundUser.password !== password) {
        alert("סיסמה שגויה");
      } else {
        alert("התחברת בהצלחה!");
        // ניתוב לעמוד הראשי
        window.location.href = "../main_deshboard.js";
      }
    });
  });

  document.getElementById('registerButton').addEventListener("click", function () 
  {
    window.location.href = "../pages/register.html";
  })