/*I USE WEBPACK SO YES*/
const css = require("./style.css");
const { formatDistance } = require("date-fns");

import renderCardsModule from "./renderCards.module.mjs";
import project from "./todoJS/project.module.mjs";
import todoObj from "./todoJS/todo.module.mjs";

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
        initalizeCardContainer();
        wrapperSwitchModes(true);
        printCurrentProject();
        printCurrentProjectHeader();
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

    dateInput.value = obj.duedate;
    colorInput.value = obj.getClr();
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
        todoObj(
          getTitleInput(),
          getDescriptionInput(),
          getDateInput(),
          getPriorityInput(),
          getColorInput(),
          renderCardsModule(
            formatDistance,
            cardWrapper,
            currentProject,
            editHandeler
          )
        )
      );
      printCurrentProject();
    }else{
      document.querySelector(".invalid").style.display = "block";
    }
  });

  initalizeCardContainer();
};

run();
