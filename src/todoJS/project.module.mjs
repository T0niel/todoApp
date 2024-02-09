import Heap from "./maxHeap.module.mjs";

//Creates an heap like structure where you can add an object with the priority property and based on that it will store it into an heap :)
export default function (name, updateTimage = 1 * 60 * 1000) {
  let heap = Heap();
  let objs = [];

  function insert(obj) {
    heap.insert(obj.priority);
    objs.push(obj);
  }

  function peekPriorityObject() {
    let PriorityObject = null;

    objs.forEach((obj) => {
      if (obj.priority === heap.peek()) {
        PriorityObject = obj;
      }
    });

    return PriorityObject;
  }

  function extractPriorityObject() {
    let PriorityObject = null;
    const nextHeap = heap.peek();

    objs.forEach((obj) => {
      if (obj.priority === nextHeap) {
        PriorityObject = obj;
      }
    });

    //remove it from the objects
    heap.extract();
    objs = objs.filter((obj) => {
      return obj !== PriorityObject;
    })

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

    //create a new heap and print them
    heap = new Heap();
    objs.forEach((obj) => {
      heap.insert(obj.priority);
      obj.print();
    });
  }, updateTimage);

  return { insert, extractPriorityObject, peekPriorityObject, creationDate: new Date(), name};
}