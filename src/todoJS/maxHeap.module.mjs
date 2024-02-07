export default function(){
  let heap = [];

  const heapifyUp = (index) => {
    if (index > heap.length || index === 0) {
      return;
    }

    const parentIndex = getParent(index);

    if (heap[parentIndex] < heap[index]) {
      const temp = heap[parentIndex];
      heap[parentIndex] = heap[index];
      heap[index] = temp;
    }

    heapifyUp(parentIndex);
  };

  const heapifyDown = (index) => {
    if (index > heap.length) {
      return;
    }

    const leftChildIndex = getLeftChild(index);
    const rightChildIndex = getRightChild(index);

    //If the right child exists
    if (rightChildIndex < heap.length) {
      const max = Math.max(heap[leftChildIndex], heap[rightChildIndex]);

      if (max === heap[leftChildIndex] && max > heap[index]) {
        const temp = heap[leftChildIndex];
        heap[leftChildIndex] = heap[index];
        heap[index] = temp;

        heapifyDown(leftChildIndex);
      } else if (max === heap[rightChildIndex] && max > heap[index]) {
        const temp = heap[rightChildIndex];
        heap[rightChildIndex] = heap[index];
        heap[index] = temp;

        heapifyDown(rightChildIndex);
      }
    }
  };

  const peek = () => (heap.length > 0) ? heap[0] : null;

  const extract = () => {
    const temp = heap[0];
    heap[0] = heap.pop();
    heapifyDown(0);
    return temp;
  }

  const insert = (element) => {
    heap.push(element);
    heapifyUp(heap.length - 1);
  }

  const getLeftChild = (index) => index * 2 + 1;
  const getRightChild = (index) => index * 2 + 2;
  const getParent = (index) => Math.floor((index - 1) / 2);

  return {insert, extract, peek};
}