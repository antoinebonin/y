export function getUniqueValues(array) {
    let resultArr = []
    array.forEach(element => {
        if (resultArr.indexOf(element) === -1) {
            resultArr.push(element)
        }
    });
    return resultArr
}

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }