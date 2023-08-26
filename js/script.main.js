const taskInput = document.querySelector(".task-input input");
const textInput = document.querySelector(".task-input textarea"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                liTag += `<table class="table">
                            
                            <tr style="padding:10px;margin-top:25px;">
                                <td style="padding:15px;margin-bottom:10px;width:5%"><input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}></td>
                                <td style="padding:15px;margin-bottom:10px;width:25%;">${todo.name}</td>
                                <td style="padding:15px;margin-bottom:10px;width:48%">${todo.dueDate}</td>
                                <td style="padding:15px;margin-bottom:10px;width:10%;">${todo.status}</td>
                                <td style="padding:15px;margin-bottom:10px;width:15%;">
                                    <span style="padding:3px;border-radius:4px;" class="btn-primary" onclick='editTask(${id}, "${todo.name}")'><i class="fa fa-edit"></i></span>
                                    <span style="padding:3px;border-radius:4px;" class="btn-danger" onclick='deleteTask(${id}, "${filter}")'><i class="fa fa-trash"></i></span>
                                </td>
                            </tr>
                        </table>`;
            }
        });
    }
    taskBox.innerHTML = liTag || ``;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName, inputTextName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
    textInput.value = inputTextName;
    textInput.focus();
    textInput.value = todos[editId].dueDate;
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});
// Save Data on button click
function saveData() {
    let userTask = taskInput.value.trim();
    let textTask = textInput.value.trim();
    if(userTask || textTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, dueDate:textTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].dueDate = textTask;
        }
        taskInput.value = "";
        textInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
}