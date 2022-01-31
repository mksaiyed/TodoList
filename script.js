const input = document.querySelector("#input");
const listItems = document.querySelector("#listItems");
const listItem = document.querySelector(".listItem");
const addBtn = document.querySelector("#btn");
const msg = document.querySelector(".message");
var taskList = [];

addBtn.addEventListener("click", addTask);
listItems.addEventListener("click", clickTask);

// Get local data Data at loading
(async function getList() {
  try {
    const List = await JSON.parse(localStorage.getItem("taskList"));

    if (List != null) {
      taskList = List;
    }
    setListItem(taskList, true);
  } catch (e) {
    console.log(e.message);
  }
})();

function showMessage() {
  const l = document.getElementsByClassName("listItem").length;
  if (l == 0 && input.value.length > 0) {
    msg.style.display = "block";
    msg.innerText = ` No TODO task Found! \n Please Add It!`;
  } else if (l == 0) {
    msg.style.display = "block";
    msg.innerText = ` Welcome to MK's TODO List App.\n Please Add Your Todo !`;
  } else {
    msg.style.display = "none";
  }
}

function addTask() {
  if (input.value == "") {
    alert("Please Enter Any Task!");
  } else {
    // updateStatus(input.value, 0);
    addStatus(input.value, 0);
    storeData();
    input.value = "";
  }
  showMessage();
  setListItem(taskList, true);
}

function clickTask(event) {
  const target = event.target;
  const listItem = target.parentElement;
  const task = listItem.getElementsByClassName("taskMessage");

  if (target.classList[0] == "completeBtn") {
    const box = listItem.getElementsByClassName("completeBtn");
    console.log(box[0].checked);
    if (box[0].checked) {
      updateStatus(task[0].innerText, 1);
    } else {
      updateStatus(task[0].innerText, 0);
    }
  } else if (target.classList[0] == "deleteBtn") {
    deleteTask(task[0].innerText);
  }
  //   storeData();
  showMessage();
}

function setListItem(taskList, btn) {
  console.log(taskList);
  listItems.innerHTML = "";

  if (btn) addBtn.disabled = true;
  else addBtn.disabled = false;

  for (let i of taskList) {
    const listItem = document.createElement("div");
    listItem.classList.add("listItem");

    const box = document.createElement("input");
    const i1 = document.createElement("div");
    const task = document.createElement("p");
    const i2 = document.createElement("div");

    box.type = "checkbox";
    box.classList.add("completeBtn");

    if (i.task_status == 1) {
      i1.classList.add("fas");
      i1.classList.add("fa-check");
      i1.classList.add("checked");
      box.checked = true;
      task.classList.add("completed");
    } else {
      i1.classList.add("far");
      i1.classList.add("fa-minus-square");
      i1.classList.add("dashed");
    }

    task.classList.add("taskMessage");
    task.innerText = i.task_value;

    i2.classList.add("deleteBtn");
    i2.classList.add("far");
    i2.classList.add("fa-trash-alt");

    listItem.append(box);
    listItem.append(i1);
    listItem.append(task);
    listItem.append(i2);
    listItems.append(listItem);
  }
  showMessage();
}

// Store Data to LocalStorage
function storeData() {
  localStorage.setItem("taskList", JSON.stringify(Array.from(taskList)));
}

function addStatus(task_value, task_status) {
  taskList.push(new TASK(task_value, task_status));
  storeData(taskList);
  setListItem(taskList, true);
}
class TASK {
  constructor(task_value, task_status) {
    this.task_value = task_value;
    this.task_status = task_status;
  }
}

function updateStatus(task_value, task_status) {
  for (let i of taskList) {
    if (i.task_value === task_value) {
      i.task_status = task_status;
    }
  }
  storeData();
  setListItem(taskList, true);

  // status 0 for pending
  // status 1 for completed
}

function deleteTask(task) {
  for (let i = 0; i < taskList.length; i++) {
    if (task == taskList[i].task_value) {
      taskList.splice(i, 1);
      break;
    }
  }
  storeData();
  setListItem(taskList, true);
  //   search();
}
