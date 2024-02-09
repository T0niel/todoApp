export default function (
  formatter
) {
  return (todoObj, cardWrapper, duedate, dateOfCreation, color) => {
    const dueDateFormated = formatter(duedate, new Date());

    const dateOfCreationFormated = formatter(dateOfCreation, new Date());

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundColor = color;

    const heading = document.createElement("h1");
    heading.classList.add("title");
    heading.textContent = todoObj.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = todoObj.description;

    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    dueDate.textContent = "Available until: " + dueDateFormated;

    const creationDate = document.createElement("p");
    creationDate.classList.add("creation-date");
    creationDate.textContent =
      "Was created: " + dateOfCreationFormated + " ago";

    const priority = document.createElement("p");
    priority.classList.add("priority");
    priority.textContent = "Has priority of: " + todoObj.priority;

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
    card.appendChild(paragraph);
    card.appendChild(creationDate);
    card.appendChild(dueDate);
    card.appendChild(priority);
    card.appendChild(btns);

    cardWrapper.appendChild(card);
  };
}
