const scheduleTable = $("#main-table");

// --- Build the table structure ---
function renderTable() {
  scheduleTable.html("");

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
}
renderTable();

// --- Restrict Available Hours (08:00-18:00) ---
function timeOptions() {
  const taskTime = document.getElementById("task-time");

  for (let hour = 8; hour <= 18; hour++) {
    const option = document.createElement("option");
    option.value = option.text = `${hour.toString().padStart(2, "0")}:00`;
    taskTime.appendChild(option);
  }
}
//

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
        cell.html() +
          ` <span class="badge ${badgeColor}" id="task-${task.taskId}">${title}</span>`
      );
    }
  }

  // --- Add Click Event to Task Badges ---
  document.querySelectorAll(".badge").forEach((element) => {
    element.addEventListener("click", function (event) {
      let taskId = event.target.id.split("-")[1];
      if (taskId) {
        let task = allTasks.find((t) => t.taskId == taskId);
        if (task) {
          let priority;
          switch (task.priority) {
            case 1:
              priority = "high";
              break;
            case 2:
              priority = "medium";
              break;
            case 3:
              priority = "low";
              break;
            default:
              priority = "medium";
          }
          let allUsers = JSON.parse(
            localStorage.getItem("missionControl_users")
          );
          let assignee = allUsers.find((u) => u.userId == task.assignee);
          const editTaskModal = new bootstrap.Modal($("#dynamic-popup"));
          $("#dynamic-popup .modal-title")
            .text("Edit Task")
            .attr("data-task-id", task.taskId);
          $("#title").val(task.title);
          $("#description").val(task.description);
          $("#priority").val(priority);
          $("#date").val(task.dateDue.split(" ")[0]);
          timeOptions();
          $("#task-time").val(task.dateDue.split(" ")[1]);
          $("#assignee").val(assignee.email);
          $("#status").val(task.status);
          $("#comments").val(task.comments);
          editTaskModal.show();
        }
      }
    });
  });

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

      timeOptions();
      const createTaskModal = new bootstrap.Modal($("#dynamic-popup"));
      createTaskModal.show();
    });
  });

  //
}
displayTasks();

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
let taskCommentsInput = $("#comments");

$("#saveTaskBtn").on("click", () => {
  let modalHeader = $("#modal-title").text();

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
  let taskComments = taskCommentsInput.val();
  let id;

  if (!taskName || !taskDescription || !taskPriority || !taskDate) {
    alert("Please fill in all required fields.");
    return;
  }

  function convertPriorityToNumber(taskPriority) {
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
    console.log(taskPriority);
    return taskPriority;
  }

  for (let x in allUsers) {
    let user = allUsers[x];
    if (user.email.toLowerCase() == taskAssignee.toLowerCase()) {
      taskAssignee = user.userId;
      break;
    }
  }
  taskPriority = convertPriorityToNumber(taskPriority);

  if (modalHeader == "Edit Task") {
    let taskId = $("#modal-title").attr("data-task-id");
    let task = allTasks.find((t) => t.taskId == taskId);
    if (task) {
      task.title = taskNameInput.val();
      task.description = taskdescriptionInput.val();
      task.priority = convertPriorityToNumber(taskPriorityInput.val());
      task.dateDue = taskDateInput.val() + " " + $("#task-time").val();
      // let assignee = allUsers.find(u => u.email == taskAssigneeInput.val())
      task.assignee = allUsers.find(
        (u) => u.email == taskAssigneeInput.val()
      ).userId;
      localStorage.setItem("missionControl_tasks", JSON.stringify(allTasks));
    }
  } else {
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
      taskComments
    );

    allTasks.push(newTask);
    localStorage.setItem("missionControl_tasks", JSON.stringify(allTasks));
  }
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
  renderTable();
  displayTasks();
  return;
});



