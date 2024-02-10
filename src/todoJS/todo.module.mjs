export default function (title, description, duedate, priority, color, printFun) {
  const date = new Date();

  function changeClr(clr) {
    color = clr;
  }

  function getClr() {
    return color;
  }

  function hasExpiried() {
    if(typeof duedate === "string")
    {
      return new Date() >= new Date(duedate);  
    }
    return (new Date()) >= duedate;
  }

  return {
    title,
    description,
    duedate,
    hasExpiried,
    priority,
    changeClr,
    getClr,
    print: printFun,
    dateOfCreation: new Date(),
  };
}
