export default function (title, description, duedate, priority, color) {
  const date = new Date();

  function changeClr(clr) {
    color = clr;
  }

  function getClr() {
    return color;
  }

  function hasExpiried() {
    return new Date() >= duedate;
  }

  return {
    title,
    description,
    duedate,
    hasExpiried,
    priority,
    changeClr,
    getClr,
    dateOfCreation: new Date()
  };
}
