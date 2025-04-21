class User {
  constructor(userId, username, email, password, profilePic) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePic = profilePic;
  };
};

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
    alert("Missing info!");
    return;
    //

    // Check for Unchecked Terms Of Use Checkbox:
  } else if (!$("#termsOfUse").is(":checked")) {
    alert("Checkbox is NOT checked");
    return;
  }
  //

  // Verify that both passwords match:
  else {
    if (passwordInput.val() != repeatPasswordInput.val()) {
      alert("Oops! The passwords don’t match. Please double-check");
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
            $('#dynamic-popup .modal-title').text('User Already Exists!');
            $('#dynamic-popup .modal-body p').html('The provided <b>Email Address</b> is already in use');
            $('#dynamic-popup .modal-footer .btn-primary').text('Login');
            $('#dynamic-popup .modal-footer .btn-primary').attr('onclick', 'navigateToLoginPage()');
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

    alert("user created successfully!");

    // Clear Form:
    emailInput.val("");
    usernameInput.val("");
    passwordInput.val("");
    repeatPasswordInput.val("");
    $("#termsOfUse").prop('checked', false);
    // 

    navigateToLoginPage();
  }
});

// Closes Bootstrap pop-ups dynamically:
function closeModal(e) {
  let modal = bootstrap.Modal.getInstance(e.target.closest(".modal"));
  modal.hide();
};
//

function navigateToLoginPage() {
  window.location.href = "./login_page.html";
};