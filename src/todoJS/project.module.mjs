import Heap from "./maxHeap.module.mjs";

//Creates an heap like structure where you can add an object with the priority property and based on that it will store it into an heap :)
export default function (updateTimage = 1 * 60 * 1000) {
  let heap = Heap();
  let objs = [];

  function insert(obj) {
    heap.insert(obj.priority);
    objs.push(obj);
  }

  function getMostPriorityObject() {
    let PriorityObject = null;

    objs.forEach((obj) => {
      if (obj.priority === heap.peek()) {
        PriorityObject = obj;
      }
    });

    return PriorityObject;
  }

  //Check for updates on time every 10 min
  setInterval(() => {
    //Get the expiered objects
    const expiredObjects = [];

    objs = objs.filter((obj) => {
      if (obj.hasExpiried()) {
        expiredObjects.push(obj);
      }

      return !obj.hasExpiried();
    });

    //create a new heap
    heap = new Heap();
    objs.forEach((obj) => {
      heap.insert(obj.priority);
    });
  }, updateTimage);

  return { insert, getMostPriorityObject};
}
