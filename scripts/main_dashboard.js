const scheduleTable = $("#main-table");

// --- Build the table structure ---
for (let i = 0; i < 11; i++) {
  scheduleTable.html(scheduleTable.html() + `<tr row-index="${i}"></tr>`);
  for (let j = 0; j < 6; j++) {
    scheduleTable.find(`tr[row-index="${i}"]`).html(
      scheduleTable.find(`tr[row-index="${i}"]`).html() +
        `
          <td col-index="${j}" class="align-middle">
          <img class="add-icon" src="../styles/add.png">
          <div class="task-list"></div>
          </td>
          `
    );
  }
  let hour = 8 + i;
  let hourStr = hour.toString().padStart(2, "0") + ":00";
  $(`tr[row-index="${i}"] td[col-index="0"]`).text(hourStr);
}

function displayTasks() {
  let allTasks = JSON.parse(localStorage.getItem("missionControl_tasks"));
  if (allTasks) {
    for (let x in allTasks) {
      let task = allTasks[x];
      let taskDate = task.dateDue.split(" ")[0];
      let date = new Date(taskDate);
      let day = date.getDay();

      let taskTime = task.dateDue.split(" ")[1];
      let [hour, minute] = taskTime.split(":");
      hour = parseInt(hour);
      let title = task.title;
      let priority = task.priority;

      let badgeColor;
      switch (priority) {
        case 1:
          badgeColor = "text-bg-danger";
          break;
        case 2:
          badgeColor = "text-bg-warning";
          break;
        case 3:
          badgeColor = "text-bg-info";
          break;
        default:
          badgeColor = "text-bg-secondary";
      }
      let colIndex = day + 1;
      let rowIndex = hour - 8;

      let cell = scheduleTable.find(
        `tr[row-index="${rowIndex}"] td[col-index="${colIndex}"] .task-list`
      );
      cell.html("");
      cell.html(
        cell.html() + ` <span class="badge ${badgeColor}">${title}</span>`
      );
    }
  }
}
displayTasks();

let selectedCell;

document.querySelectorAll(".add-icon").forEach((element) => {
  element.addEventListener("click", function () {
    let rowIndex = element.closest("tr").getAttribute("row-index");
    let colIndex = element.closest("td").getAttribute("col-index");

    selectedCell = scheduleTable.find(
      `tr[row-index="${rowIndex}"] td[col-index="${colIndex}"]`
    );

    // --- Calculate Default Date ---
    const today = new Date();
    today.setDate(today.getDate() + parseInt(colIndex - 2));

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");

    const defaultDate = `${year}-${month}-${date}`;

    // --- Set default to the #date input ---
    $("#date").val(defaultDate);

    // --- Calculate Default Time ---
    const hour = 8 + parseInt(rowIndex);
    const defaultTime = `${hour.toString().padStart(2, "0")}:00`;

    // --- Set default to the #task-time select ---
    $("#task-time").val(defaultTime);

    // --- Restrict Available Hours (08:00-18:00) ---
    const taskTime = document.getElementById("task-time");

    for (let hour = 8; hour <= 18; hour++) {
      const option = document.createElement("option");
      option.value = option.text = `${hour.toString().padStart(2, "0")}:00`;
      taskTime.appendChild(option);
    }
    //

    const createTaskModal = new bootstrap.Modal($("#dynamic-popup"));
    createTaskModal.show();
  });
});

//

// --- Day Of Week Validation (Fri-Sat Not Allowed) ---
const dateInput = document.getElementById("date");
const dateError = document.getElementById("date-error");

dateInput.addEventListener("change", function () {
  const selectedDate = new Date(this.value);
  const day = selectedDate.getDay();
  if (day === 5 || day === 6) {
    dateError.style.display = "inline";
    this.value = "";
  } else {
    dateError.style.display = "none";
  }
});
//

class Task {
  constructor(
    taskId,
    title,
    description,
    status,
    priority,
    dateCreated,
    dateDue,
    assignee,
    createdBy,
    comments
  ) {
    this.taskId = taskId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.dateCreated = dateCreated;
    this.dateDue = dateDue;
    this.assignee = assignee;
    this.createdBy = createdBy;
    this.comments = comments;
  }
}

let currentUser = JSON.parse(
  localStorage.getItem("missionControl_currentUser")
);
let allUsers = JSON.parse(localStorage.getItem("missionControl_users"));
let allTasks = JSON.parse(localStorage.getItem("missionControl_tasks"));
let taskNameInput = $("#title");
let taskdescriptionInput = $("#description");
let taskPriorityInput = $("#priority");
let taskDateInput = $("#date");
let taskAssigneeInput = $("#assignee");

$("#saveTaskBtn").on("click", () => {
  let taskName = taskNameInput.val();
  let taskDescription = taskdescriptionInput.val();
  let taskPriority = taskPriorityInput.val();
  let taskCreatedBy = currentUser.userId;
  let taskAssignee = taskAssigneeInput.val();
  let taskStatus = $("#status").val();
  let taskDate = taskDateInput.val(); //TODO: add date input
  let taskTime = $("#task-time").val();
  taskDate = taskDate + " " + taskTime;
  let date = new Date();
  let taskCreatedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  let id;

  if (!taskName || !taskDescription || !taskPriority || !taskDate) {
    populateAndDisplayErrorToast(
      "Missing Information",
      "Please fill in all fields"
    );
    return;
  }

  switch (taskPriority) {
    case "high":
      taskPriority = 1;
      break;
    case "medium":
      taskPriority = 2;
      break;
    case "low":
      taskPriority = 3;
      break;
    default:
      taskPriority = 2;
      break;
  }

  for (let x in allUsers) {
    let user = allUsers[x];
    if (user.email.toLowerCase() == taskAssignee.toLowerCase()) {
      taskAssignee = user.userId;
      break;
    }
  }

  if (!allTasks) {
    allTasks = [];
    id = 1;
  } else {
    id = allTasks[allTasks.length - 1].taskId + 1;
  }

  let newTask = new Task(
    id,
    taskName,
    taskDescription,
    taskStatus,
    taskPriority,
    taskCreatedDate,
    taskDate,
    taskAssignee,
    taskCreatedBy,
    []
  );

  allTasks.push(newTask);
  localStorage.setItem("missionControl_tasks", JSON.stringify(allTasks));
  let modal = bootstrap.Modal.getInstance($("#dynamic-popup"));
  $("#title").val("");
  $("#description").val("");
  $("#priority").val("medium");
  $("#date").val("");
  $("#task-time").val("");
  $("#assignee").val("");
  $("#status").val("new");
  $("#comments").val("");
  modal.hide();
  displayTasks();
  return;
});

async function sleepMode(seconds) {
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
function populateAndDisplayErrorToast(title, body) {
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
