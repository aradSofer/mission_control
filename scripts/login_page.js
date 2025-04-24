function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');

  if (!username || !password) {
    errorDiv.textContent = "אנא מלא את כל השדות.";
    return;
  }

  // בדיקת התחברות דמה
  if (username === "admin" && password === "1234") {
    alert("התחברת בהצלחה!");
    errorDiv.textContent = "";
  } else {
    errorDiv.textContent = "שם משתמש או סיסמה שגויים.";
  }
}
