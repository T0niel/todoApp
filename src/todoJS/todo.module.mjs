export default function (title, description, duedate, priority, color, printFun) {
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

  function print(){
    printFun(title, description, duedate, priority, color);
  }

  return {
    title,
    description,
    duedate,
    hasExpiried,
    priority,
    changeClr,
    getClr,
    print,
    dateOfCreation: new Date()
  };
}
