export default function (
  title,
  description,
  duedate,
  priority,
  color,
  printFun,
  dateOfCreation = null
) {
  const date = new Date();

  function hasExpiried() {
    if (typeof duedate === "string") {
      return new Date() > new Date(duedate);
    }
    return new Date() > duedate;
  }

  if (dateOfCreation === null) {
    return {
      title,
      description,
      duedate,
      hasExpiried,
      priority,
      color,
      print: printFun,
      dateOfCreation: new Date(),
    };
  }else{
    return {
      title,
      description,
      duedate,
      hasExpiried,
      priority,
      color,
      print: printFun,
      dateOfCreation
    };
  }
}
