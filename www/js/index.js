/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

function loadTasks(){
    const storage = window.localStorage;
    if(storage.length == 0){
        document.querySelector("#tasks").innerHTML = `<h1 class="p-2 text-center">Nenhuma tarefa</h1>`;
    } else{
        var structure = "";
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            const task = JSON.parse(storage.getItem(key));
            // tasks.push(JSON.parse(storage.getItem(key)));
            structure = structure + `<div id="task-${key}" class="card mx-auto mb-3" style="width: 18rem">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                      <div class="d-flex align-items-center">
                        <h4 class="mb-0 align-bottom" id="task-title-${key}">${task.title}</h4>
                      </div>
                      <div class="d-flex align-items-center">
                        <button class="btn edit-task"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>
                        </button>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabel"
                          value=""
                          aria-label="..."
                        />
                      </div>
                    </li>
                    <li class="list-group-item" id="task-desc-${key}">${task.description}</li>
                  </ul>
                  <div class="card-footer">
                    <small id="task-date-${key}">Criado em ${task.date}</small>
                  </div>
                </div>`;
            }
            document.querySelector("#tasks").innerHTML = structure;
    }
}
loadTasks();

function saveTask(){

    const title = document.querySelector("#titleTask").value;
    const description = document.querySelector("#descTask").value;
    const date = new Date().toLocaleString('pt-br');

    const taskID = window.localStorage.length + 1;

    const editModalClass = Array.from(document.querySelector(".modal").classList).find(cls => cls.startsWith('edit-modal-task-'));
    
    if (editModalClass) {
        // Extrai o ID da tarefa a ser editada
        const existingTaskId = editModalClass.split('-')[2];
        const existingTask = JSON.parse(localStorage.getItem(existingTaskId));

        // Atualiza a tarefa existente
        existingTask.title = title;
        existingTask.description = description;

        localStorage.setItem(existingTaskId, JSON.stringify(existingTask));
    } else {
        // Cria uma nova tarefa
        const newTask = {
            title: title,
            description: description,
            date: date,
        };

        localStorage.setItem(taskID, JSON.stringify(newTask));
    }

    window.location.reload();
}
document.getElementById('saveButton').addEventListener('click', saveTask);

function openEditModal(taskId){
    const title = document.querySelector(`#task-title-${taskId}`).textContent;
    const description = document.querySelector(`#task-desc-${taskId}`).textContent;

    document.querySelector("#titleTask").value = title;
    document.querySelector("#descTask").value = description;
    document.querySelector(".modal").classList.add(`edit-modal-task-${taskId}`)
}

document.querySelectorAll(".edit-task").forEach(button => {
    button.addEventListener('click', function(){
        const parentDiv = this.closest('.card');
        // Obtém o ID da div pai
        const parentId = parentDiv.id;
        const taskId = parentId.split('-')[1];
        openEditModal(taskId);
    })
})

document.querySelector("#new-task").addEventListener('click', function(){
    document.querySelector("#titleTask").placeholder = "Nova tarefa";
    document.querySelector("#descTask").placeholder = "Descrição da tarefa...";
    document.querySelector("#titleTask").value = "";
    document.querySelector("#descTask").value = "";
})