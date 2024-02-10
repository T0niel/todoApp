/*I USE WEBPACK SO YES*/
const css = require("./style.css");
const { formatDistance } = require("date-fns");

import renderCardsModule from "./renderCards.module.mjs";
import project from "./todoJS/project.module.mjs";
import todoModule from "./todoJS/todo.module.mjs";

const run = () => {
  const createTodoBtn = document.querySelector(".new-todo-btn");
  const modal = document.querySelector(".modal");
  const close = document.querySelector(".close");
  const createBtn = document.querySelector(".create-btn");
  const titleInput = document.querySelector("input#title");
  const descriptionInput = document.querySelector("textarea");
  const dateInput = document.querySelector("input#date");
  const colorInput = document.querySelector("input#color");
  const priorityInput = document.querySelector("input#priority");
  const cardContainer = document.querySelector(".card-container");
  const wrapper = document.querySelector(".wrapper");
  const cardWrapper = document.querySelector(".card-wrapper");
  const todayProjects = document.querySelector("details.today-projects");
  const monthlyProjects = document.querySelector("details.month-projects");
  const weekProjects = document.querySelector("details.week-projects");
  const allProjects = document.querySelector("details.all-projects");
  const createProjectBtn = document.querySelector(".create-project-btn");
  const currentProjectHeader = document.querySelector(".current-prj-header");
  const from = document.querySelector("form");

  const projects = [];

  const dayPrinted = [];
  const monthPrinted = [];
  const allPrinted = [];
  const weekprinted = [];

  let currentProject = null;
  let editing = false;
  let editingObj = null;

  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  function saveCurrentProjectToLocalStorage() {
    if (storageAvailable("localStorage")) {
      let localProjects = localStorage.getItem("Projects");
      if (localProjects === null) {
        localStorage.setItem("Projects", "[]");
      }

      localProjects = localStorage.getItem("Projects");

      const objLocal = JSON.parse(localProjects);

      let found = false;

      objLocal.forEach((obj, index) => {
        for (let key in obj) {
          if (key === currentProject.name) {
            found = true;
            objLocal[index] = {
              name: currentProject.name,
              [currentProject.name]: currentProject.getObjects(),
            };
          }
        }
      });

      if (!found)
        objLocal.push({
          name: currentProject.name,
          [currentProject.name]: currentProject.getObjects(),
        });

      localStorage.setItem("Projects", JSON.stringify(objLocal));
    }
  }

  function getProjectsFromLocalStorage() {
    if (storageAvailable("localStorage")) {
      let localProjects = localStorage.getItem("Projects");
      if (localProjects !== null) {
        const objLocal = JSON.parse(localProjects);
        objLocal.forEach((obj) => {
          let objects = [];

          let localProj = project(obj.name, reset, objects);

          obj[obj.name].forEach((todoObj) => {
            objects.push(
              todoModule(
                todoObj.title,
                todoObj.description,
                new Date(todoObj.duedate),
                +todoObj.priority,
                todoObj.color,
                renderCardsModule(
                  formatDistance,
                  cardWrapper,
                  localProj,
                  editHandeler,
                  removeHandeler
                ),
                todoObj.dateOfCreation
              )
            );
          });

          localProj = project(obj.name, reset, objects);

          projects.push(localProj);
        });

        printProjectsToDetails();
      }
    }
  }

  /*If the first parameter is not defined then it will act as an toggeler*/
  function wrapperSwitchModes(toGrid) {
    if (toGrid) {
      wrapper.classList.remove("block");
      wrapper.classList.add("grid");
    } else {
      wrapper.classList.toggle("block");
    }
  }

  function createProject(name) {
    projects.push(new project(name, reset));
  }

  function reset() {
    while (cardWrapper.firstChild) {
      cardWrapper.removeChild(cardWrapper.firstChild);
    }

    saveCurrentProjectToLocalStorage();
  }

  function printCurrentProject() {
    reset();
    if (currentProject !== null) {
      currentProject.print();
    }
  }

  function insertTodoIntoCurrentProject(todoObj) {
    if (currentProject !== null) {
      currentProject.insert(todoObj);
    }
  }

  function printSpecificDateProjects(project, dateCondition, detailElement) {
    if (dateCondition) {
      const btn = document.createElement("button");
      btn.textContent = project.name;
      btn.classList.add("project-btn");
      btn.addEventListener("click", () => {
        currentProject = project;
        
        projects.forEach(project => {
          project.stopPrinting();
        })

        currentProject.startPrinting();

        initalizeCardContainer();
        wrapperSwitchModes(true);
        printCurrentProject();
        printCurrentProjectHeader();
        /*Save project to local storage*/
        saveCurrentProjectToLocalStorage();
      });
      detailElement.appendChild(btn);
    }
  }

  /*These functions are supposed to print projects to details*/
  function printTodayProjects() {
    projects.forEach((project) => {
      if (!dayPrinted.includes(project)) {
        printSpecificDateProjects(
          project,
          project.creationDate.getFullYear() === new Date().getFullYear() &&
            project.creationDate.getMonth() === new Date().getMonth() &&
            project.creationDate.getDay() === new Date().getDay(),
          todayProjects
        );
        dayPrinted.push(project);
      }
    });
  }

  function printThisMonthProjects() {
    projects.forEach((project) => {
      if (!monthPrinted.includes(project)) {
        printSpecificDateProjects(
          project,
          project.creationDate.getFullYear() === new Date().getFullYear() &&
            project.creationDate.getMonth() === new Date().getMonth(),
          monthlyProjects
        );

        monthPrinted.push(project);
      }
    });
  }

  function printThisWeekProjects() {
    projects.forEach((project) => {
      if (!weekprinted.includes(project)) {
        printSpecificDateProjects(
          project,
          project.creationDate.getMonth() === new Date().getMonth() &&
            new Date().getDay() - project.creationDate.getDay() <= 7,
          weekProjects
        );

        weekprinted.push(project);
      }
    });
  }

  function removeHandeler(card) {
    currentProject.removeObj(card.getAttribute("data-index"));
    cardWrapper.removeChild(card);

    saveCurrentProjectToLocalStorage();
  }

  function printAllProjects() {
    projects.forEach((project) => {
      if (!allPrinted.includes(project)) {
        printSpecificDateProjects(project, true, allProjects);

        allPrinted.push(project);
      }
    });
  }

  function printProjectsToDetails() {
    printAllProjects();
    printThisMonthProjects();
    printThisWeekProjects();
    printTodayProjects();
  }

  //Will display the cards portion if theres an project
  const initalizeCardContainer = () => {
    if (currentProject === null) {
      cardContainer.style.display = "none";
      wrapperSwitchModes();
    } else {
      cardContainer.style.display = "block";
    }
  };

  function printCurrentProjectHeader() {
    if (currentProject !== null)
      currentProjectHeader.textContent = `Current project: ${currentProject.name}`;
  }

  createTodoBtn.addEventListener("click", () => {
    modal.style.display = modal.style.display === "none" ? "flex" : "none";
  });

  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  createProjectBtn.addEventListener("click", () => {
    const name = prompt("Project name: ");
    if (name.length > 3 && typeof name === "string") {
      createProject(name);
      printProjectsToDetails();
    } else {
      alert(
        "Not an valid project name (must be an string with more that 3 characters)"
      );
    }
  });

  function editHandeler(obj) {
    const mouseEvent = new MouseEvent("click");
    createTodoBtn.dispatchEvent(mouseEvent);

    console.log("Object date: ");
    console.log(obj.duedate);
    if (typeof obj.duedate !== "string")
      dateInput.value = obj.duedate.toISOString().split(".")[0];
    else
      dateInput.value = (new Date(obj.duedate)).toISOString().split(".")[0];
    
    colorInput.value = obj.color;
    priorityInput.value = obj.priority;
    titleInput.value = obj.title;
    descriptionInput.value = obj.description;

    editing = true;
    editingObj = obj;
    createBtn.textContent = "Edit";
  }

  const getTitleInput = () => titleInput.value;
  const getDescriptionInput = () => descriptionInput.value;
  const getDateInput = () => dateInput.value;
  const getColorInput = () => colorInput.value;
  const getPriorityInput = () => priorityInput.value;

  createBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (from.checkValidity()) {
      if (editing && editingObj !== null) {
        currentProject.removeObj(null, editingObj);

        editing = false;
        editingObj = null;
        createBtn.textContent = "Create";
      }
      insertTodoIntoCurrentProject(
        todoModule(
          getTitleInput(),
          getDescriptionInput(),
          getDateInput(),
          getPriorityInput(),
          getColorInput(),
          renderCardsModule(
            formatDistance,
            cardWrapper,
            currentProject,
            editHandeler,
            removeHandeler
          )
        )
      );
      printCurrentProject();
      saveCurrentProjectToLocalStorage();
    } else {
      document.querySelector(".invalid").style.display = "block";
    }
  });

  initalizeCardContainer();
  getProjectsFromLocalStorage();
};

run();
