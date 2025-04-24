class User {
  constructor(userId, username, email, password, profilePic) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePic = profilePic;
  }
}

const sleepMode = (time) => new Promise((res) => setTimeout(res, time * 1000));

const usernameInput = $("#username");
const emailInput = $("#email");
const passwordInput = $("#password");
const repeatPasswordInput = $("#repeatPassword");

// Event Listeners for Show\Hide Password & Password Repeat:
$("#togglePassword").on("click", () => {
  const type = passwordInput.attr("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  if (type == "password") {
    document.getElementById("togglePassword").className = "bi bi-eye-slash";
  } else {
    document.getElementById("togglePassword").className = "bi bi-eye";
  }
});

$("#toggleRepeatPassword").on("click", () => {
  const type = passwordInput.attr("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  if (type == "password") {
    document.getElementById("toggleRepeatPassword").className =
      "bi bi-eye-slash";
  } else {
    document.getElementById("toggleRepeatPassword").className = "bi bi-eye";
  }
});
//

// Event Listener for Register Button:
$("#registerButton").on("click", () => {
  // Check for empty fields:
  if (
    usernameInput.val() === "" ||
    emailInput.val() === "" ||
    passwordInput.val() === "" ||
    repeatPasswordInput.val() === ""
  ) {
    errorPopupCallback(
      "Missing Fields",
      "Please Fill In All The Required Fields"
    );
    return;
    //

    // Check for Unchecked Terms Of Use Checkbox:
  } else if (!$("#termsOfUse").is(":checked")) {
    errorPopupCallback(
      "Missing Fields",
      "Please Accept The Terms Of Use"
    );
    return;
  }
  //

  // Verify that both passwords match:
  else {
    if (passwordInput.val() != repeatPasswordInput.val()) {
      errorPopupCallback(
        "Oops...",
        "The passwords don’t match <br> Please double-check"
      );
      return;
    }
    //

    let allUsers = JSON.parse(localStorage.getItem("missionControl_users"));
    const providedEmail = emailInput.val();
    const providedUsername = usernameInput.val();
    const providedPassword = passwordInput.val();
    const staticProfilePic = "https://www.flaticon.com/free-icons/user";
    let id;

    // Set conditions for the new User Object:
    if (!allUsers) {
      id = 1;
      allUsers = [];
    } else {
      for (let x in allUsers) {
        let user = allUsers[x];
        if (user.email === providedEmail) {
          // Initiate And Populate Dynamic Bootstrap Popup (while return):
          const userExistsModal = new bootstrap.Modal($("#dynamic-popup"));
          $("#dynamic-popup .modal-title").text("User Already Exists!");
          $("#dynamic-popup .modal-body p").html(
            "The provided <b>Email Address</b> is already in use"
          );
          $("#dynamic-popup .modal-footer .btn-primary").text("Login");
          $("#dynamic-popup .modal-footer .btn-primary").attr(
            "onclick",
            "navigateToLoginPage()"
          );
          userExistsModal.show();
          return;
        }
        //
      }
      id = allUsers[allUsers.length - 1].userId + 1;
    }
    // Create a new User object:
    const newUser = new User(
      id,
      providedUsername,
      providedEmail,
      providedPassword,
      staticProfilePic
    );
    //

    // Set Local Storage:
    allUsers.push(newUser);
    localStorage.setItem("missionControl_users", JSON.stringify(allUsers));
    //

    const welcomeModal = new bootstrap.Modal($("#dynamic-popup"));
    $("#dynamic-popup .modal-title").text("Welcome to Mission Control!");
    $("#dynamic-popup .modal-body p")
      .html(
        `Hi ${providedUsername},<br> Welcome on board! <br> Please log in to complete your registration`
      )
      .css({ "text-align": "center", width: "fit-content", margin: "auto" });
    $("#dynamic-popup .modal-footer .btn-primary").css("display", "none");
    $("#dynamic-popup .modal-footer .btn-secondary").css("display", "none");
    welcomeModal.show();
    sleepMode(2.5).then(() => {
      let modal = bootstrap.Modal.getInstance($("#dynamic-popup"));
      modal.hide();
      navigateToLoginPage();
    });
    // Clear Form:
    emailInput.val("");
    usernameInput.val("");
    passwordInput.val("");
    repeatPasswordInput.val("");
    $("#termsOfUse").prop("checked", false);
    //
  }
});

// Closes Bootstrap pop-ups:
function closeModal(e) {
  let modal = bootstrap.Modal.getInstance(e.target.closest(".modal"));
  modal.hide();
}
//

function navigateToLoginPage() {
  window.location.href = "./login_page.html";
}

function errorPopupCallback(title, body) {
  const errorModal = new bootstrap.Modal($("#dynamic-popup"));
  $("#dynamic-popup .modal-title").text(title);
  $("#dynamic-popup .modal-body p")
    .html(body)
    .css({ "text-align": "center", width: "fit-content", margin: "auto" });
  $("#dynamic-popup .modal-footer .btn-primary").css("display", "none");
  $("#dynamic-popup .modal-footer .btn-secondary").css("display", "none");
  errorModal.show();
  sleepMode(1.2).then(() => {
    let modal = bootstrap.Modal.getInstance($("#dynamic-popup"));
    modal.hide();
    return;
  });
}
