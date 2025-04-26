const sleepMode = () => new Promise((res) => setTimeout(res, 2000));

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePassword");

  toggleBtn.addEventListener("click", function () {
    const currentType = passwordInput.getAttribute("type");
    passwordInput.setAttribute(
      "type",
      currentType === "password" ? "text" : "password"
    );
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");

  loginButton.addEventListener("click", async function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const users = JSON.parse(localStorage.getItem("missionControl_users"));

    if (!users) {
      alert("המשתמש לא נמצא במערכת");
      return;
    }

    const foundUser = users.find((user) => user.email === email);

    if (!foundUser || foundUser.password !== password) {
      const wrongCredentialsModal = new bootstrap.Modal($("#dynamic-popup"));
      $("#dynamic-popup .modal-title").text("Wrong Credentials!");
      $("#dynamic-popup .modal-body p").html(
        "Please check your email and password and try again."
      );
      $("#dynamic-popup .modal-footer .btn-primary").css("display", "none");

      wrongCredentialsModal.show();
    } else {
      let user = {
        userId:foundUser.userId,
        username: foundUser.username,
        email: foundUser.email,
      };
      localStorage.setItem("missionControl_currentUser", JSON.stringify(user));
      
      const welcomeModal = new bootstrap.Modal($("#dynamic-popup"));
      $("#dynamic-popup .modal-title").text("Welcome to Mission Control!");
      $("#dynamic-popup .modal-body p")
        .html("Launching in 3..2..1")
        .css({ "text-align": "center", width: "fit-content", margin: "auto" });
      $("#dynamic-popup .modal-footer .btn-primary").css("display", "none");
      $("#dynamic-popup .modal-footer .btn-secondary").css("display", "none");
      welcomeModal.show();
      sleepMode().then(() => {
        let modal = bootstrap.Modal.getInstance($("#dynamic-popup"));
        modal.hide();
        window.location.href = "../pages/main_dashboard.html";
      });
    }
  });
});

document
  .getElementById("registerButton")
  .addEventListener("click", function () {
    window.location.href = "../pages/register.html";
  });

// Closes Bootstrap pop-ups:
function closeModal(e) {
  let modal = bootstrap.Modal.getInstance(e.target.closest(".modal"));
  modal.hide();
}
//
