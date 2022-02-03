// Declarations
const input = document.querySelector("#input");
const listItems = document.querySelector("#listItems");
const addBtn = document.querySelector("#btn");
const msg = document.querySelector(".message");
var taskList = [];

// Events
addBtn.addEventListener("click", addTask);
listItems.addEventListener("click", clickTask);
input.addEventListener("input", debounce(300));

// Get local Storage Data at loading
(async function () {
  try {
    const List = await JSON.parse(localStorage.getItem("taskList"));
    if (List != null) {
      // if list having data already then assign it to taskList for printing already exist data
      taskList = List;
    }
    displayListItem(taskList, true);
  } catch (e) {
    console.log("ERROR :", e.message);
  }
})();

// Debouncing
// Type Anything in input for Search or Add
function debounce(delay) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      search(context, args);
    }, delay);
  };
}

// Show Diff message or User's activity
function showMessage() {
  const l = document.getElementsByClassName("listItem").length;
  if (l == 0 && input.value.length > 0) {
    msg.style.display = "block";
    msg.innerText = ` No TODO task found \n Please add it!`;
  } else if (l == 0) {
    msg.style.display = "block";
    msg.innerText = ` Welcome to MK's TODO list app.\n Please add any Todo task!`;
  } else {
    msg.style.display = "none";
  }
}

// Search Task from local Storage if not found add new
function search() {
  if (input.value.trim() != "") {
    let filterItem = [];
    let btn = false;
    addBtn.disabled = false; // enable Btn
    // checking input with each element of taskList
    for (let i of taskList) {
      let task = i.task;
      if (task.toLowerCase().startsWith(input.value.toLowerCase())) {
        // checking each task with input
        filterItem.push(new Task(i.task, i.status));
        if (task === input.value) {
          // if same task present in list then you can't add
          btn = true;
        }
      }
    }

    displayListItem(filterItem, btn);

    if (filterItem.length == 0) {
      // if o input then Btn disable
      addBtn.disabled = false;
    }
  } else {
    displayListItem(taskList, true);
  }
}

// List out Task Items
function displayListItem(taskList, btn) {
  // Clear All tasks
  listItems.innerHTML = "";

  // Checking Btn Status
  if (btn) addBtn.disabled = true;
  else addBtn.disabled = false;

  // create each task of taskList
  for (let i of taskList) {
    // main listItem div
    const listItem = document.createElement("div");
    listItem.classList.add("listItem");

    // checkBox
    const box = document.createElement("input");
    box.type = "checkbox";
    box.classList.add("completeBtn");

    // task Content
    const task = document.createElement("pre");
    task.classList.add("taskMessage");
    task.innerText = i.task;

    // Delete Btn
    const i2 = document.createElement("div");
    i2.classList.add("deleteBtn");
    i2.classList.add("far");
    i2.classList.add("fa-trash-alt");

    // Task status
    const i1 = document.createElement("div");
    if (i.status == 1) {
      box.checked = true;
      i1.classList.add("fas");
      i1.classList.add("fa-check");
      i1.classList.add("markDone");
      task.classList.add("completed");
      listItem.classList.add("blur");
    } else {
      i1.classList.add("far");
      i1.classList.add("fa-minus-square");
      i1.classList.add("dashed");
    }

    // Append all to listItem
    listItem.append(box);
    listItem.append(i1);
    listItem.append(task);
    listItem.append(i2);
    listItems.append(listItem);
  }
  showMessage();
}

// while pressing add task Btn
function addTask() {
  if (input.value == "") {
    alert("Please Enter Any Task!");
  } else {
    addTaskToLocal(input.value.trim(), 0);
    storeData();
    input.value = "";
  }
  showMessage();
  displayListItem(taskList, true);
}

// Store Data to LocalStorage
function storeData() {
  localStorage.setItem("taskList", JSON.stringify(Array.from(taskList)));
}

// add task to taskList
function addTaskToLocal(task, status) {
  taskList.push(new Task(task, status));
  storeData();
  displayListItem(taskList, true);
}

// constructor Class for new object contains task and it's status
class Task {
  constructor(task, status) {
    this.task = task;
    this.status = status;
  }
}

// update task status
// status 0 for pending
// status 1 for completed
function updateStatus(task, status) {
  for (let i of taskList) {
    if (i.task === task) {
      i.status = status;
    }
  }
  storeData();
  displayListItem(taskList, true);
}

// When User Click on Task
function clickTask(event) {
  const target = event.target;
  const listItem = target.parentElement;
  const task = listItem.getElementsByClassName("taskMessage");

  if (target.classList[0] == "completeBtn") {
    const box = listItem.getElementsByClassName("completeBtn");
    if (box[0].checked) {
      updateStatus(task[0].innerText, 1);
    } else {
      updateStatus(task[0].innerText, 0);
    }
  } else if (target.classList[0] == "deleteBtn") {
    listItem.classList.add("remove");
    listItem.addEventListener("transitionend", () =>
      deleteTask(task[0].innerText)
    );
  }
  showMessage();
}

// When Delete Btn Clicked
function deleteTask(task) {
  for (let i = 0; i < taskList.length; i++) {
    if (task == taskList[i].task) {
      // search which task is clicked
      taskList.splice(i, 1);
      // remove that from taskList
      break;
    }
  }
  storeData();
  displayListItem(taskList, true);
  search();
}
