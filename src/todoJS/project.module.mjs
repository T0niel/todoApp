export default function (
  name,
  reset = null,
  dataObjs = null,
  dateOfCreation = null,
  updateTimage = 1 * 60 * 1000, 
) {
  let objs = [];
  let printing = true;

  if (dataObjs !== null) objs = dataObjs;

  function insert(obj) {
    objs.push(obj);
  }

  function stopPrinting() {
    printing = false;
  }

  function startPrinting() {
    printing = true;
  }

  function print() {
    objs = objs.filter((obj) => !obj.hasExpiried());

    objs.sort((objA, objB) => (objA.priority > objB.priority ? -1 : 1));
    if (reset != null) {
      reset();
    }
    printObjs();
  }

  function printObjs() {
    objs.forEach((obj, index) => {
      obj.print(obj, index);
    });
  }

  function removeObj(index, obj = null) {
    if (obj !== null) {
      objs = objs.filter((cObj) => obj !== cObj);
    } else {
      objs = objs.filter((obj, objIndex) => +index !== objIndex);
    }
  }

  function getObjects() {
    return objs;
  }

  //Check for updates on time every 1 min
  setInterval(() => {
    if(printing)
    {
      print();
    }
  }, updateTimage);

  return {
    insert,
    creationDate: dateOfCreation === null ? new Date() : dateOfCreation,
    name,
    print,
    removeObj,
    getObjects,
    startPrinting,
    stopPrinting
  };
}
