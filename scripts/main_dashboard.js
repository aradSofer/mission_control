class Task{
    constructor(taskId, title, description, status, priority, dateCreated, dateDue, assignee, createdBy, comments){
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
let currentUser = JSON.parse(localStorage.getItem('missionControl_currentUser'))
let allUsers = JSON.parse(localStorage.getItem('missionControl_users'))
let allTasks = JSON.parse(localStorage.getItem('missionControl_tasks'))
let taskNameInput
let taskdescriptionInput
let taskPriorityInput
let taskDateInput
let taskAssigneeInput

$("#addTaskButton").on("click", () => {

    let taskName = taskNameInput.val();
    let taskDescription = taskdescriptionInput.val();
    let taskPriorityInput = taskPriorityInput.val();
    let taskCreatedBy = currentUser.userId;
    let taskAssigneeInput = taskAssigneeInput.val();
    let taskStatus = "To Do";
    let taskDateInput = taskDateInput.val(); //TODO: add date input
    let date = new Date();
    let taskCreatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}}`;
    let id
    
    if(!taskName || !taskDescription || !taskPriority || !taskDate){
        populateAndDisplayErrorToast("Missing Information", "Please fill in all fields")    
        return
    }

    switch(taskPriorityInput){
        case "High":
            taskPriority = 1
            break;
        case "Medium":
            taskPriority = 2
            break;
        case "Low":
            taskPriority = 3
            break;
        default:
            taskPriority = 2
            break;
    }

    let taskAssignee;

    for(let x in allUsers){
        let user = allUsers[x]
        if(user.email.toLowerCase() == taskAssigneeInput.toLowerCase()){
            taskAssignee = user.userId
            break;
        }
    }
    
    if(!allTasks){
        allTasks = []
        id = 1
    }else{
        id = allTasks[allTasks.length - 1].taskId + 1
    }
    
    let newTask = new Task(id, taskName, taskDescription, taskStatus, taskPriority, taskCreatedDate, taskDate, taskAssignee, taskCreatedBy, [])
    
    allTasks.push(newTask)
    localStorage.setItem('missionControl_tasks', JSON.stringify(allTasks))
})



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

  const task= [];
  document.getElementById("myModal").addEventListener('submit', function(e)  {
e.preventDefault();
const title= document.getElementById("title").value
const description= document.getElementById("description").value
const status= document.getElementById("status").value
const priority= document.getElementById("priority").value
const assignee= document.getElementById("assignee").value
const createdBy= document.getElementById("createdBy").value
const date= document.getElementById("date").value
const time= document.getElementById("time").value
const dateCreated= document.getElementById("dateCreated").value
const comments= document.getElementById("comments").value

const newTask = {
    title: title,
    description: description,
    status: status,
    priority: priority,
    assignee: assignee,
    createdBy: createdBy,
    date: date,
    time: time,
    dateCreated: dateCreated,
    comments: comments
}
task.push(newTask);
localStorage.setItem('task')
  })

  console.log(task);
