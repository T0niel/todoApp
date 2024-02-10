
export default function (name, reset = null, updateTimage = 1 * 60 * 1000) {
  let objs = [];

  function insert(obj) {
    objs.push(obj);
  }

  function print() {
    objs = objs.filter(obj => !obj.hasExpiried());

    objs.sort((objA, objB) => objA.priority > objB.priority ? -1 : 1);
    reset();
    printObjs();
  }

  function printObjs(){
    objs.forEach(obj => {
      obj.print(obj);
    })
  }

  //Check for updates on time every 1 min
  setInterval(() => {
    print();
  }, updateTimage);

  return {
    insert,
    creationDate: new Date(),
    name,
    print,
  };
}
