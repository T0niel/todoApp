export default function (formatter, cardWrapper, project, editHandeler, removeHandeler) {
  return (obj, index) => {
    const dueDateFormated = formatter(obj.duedate, new Date());

    const dateOfCreationFormated = formatter(obj.dateOfCreation, new Date());

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundColor = obj.color;

    const heading = document.createElement("h1");
    heading.classList.add("title");
    heading.textContent = obj.title;

    const div = document.createElement("div");
    
    let splited = obj.description.split(" ");
    splited.forEach(content => {
      const paragraph = document.createElement("p");
      paragraph.textContent = content;
      div.appendChild(paragraph);
    });

    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    dueDate.textContent = "Available for: " + dueDateFormated;

    const creationDate = document.createElement("p");
    creationDate.classList.add("creation-date");
    creationDate.textContent =
      "Was created: " + dateOfCreationFormated + " ago";

    const priority = document.createElement("p");
    priority.classList.add("priority");
    priority.textContent = "Has priority of: " + obj.priority;

    const btns = document.createElement("div");
    btns.classList.add("btns");
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.textContent = "Edit";

    btns.appendChild(editBtn);
    btns.appendChild(removeBtn);

    card.appendChild(heading);
    card.appendChild(div);
    card.appendChild(creationDate);
    card.appendChild(dueDate);
    card.appendChild(priority);
    card.appendChild(btns);
    card.setAttribute("data-index", index);

    editBtn.addEventListener("click", () => {
      editHandeler(obj);
    })

    removeBtn.addEventListener("click", () => {
      removeHandeler(card);
    });

    cardWrapper.appendChild(card);
  }
}
