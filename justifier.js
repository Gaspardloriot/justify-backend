//Justifying functions
const paraFind = (wholeString) => {
    const maxLength = wholeString.length;
    let paragraphs = [];                           //Coordinates of all the paragraphs  
    let parCoor = [0];                            //Coordinates of all breaking points for the paragraphs
    let formattedText = [];                       //Final array of this function, divides text into paragraphs
  
    const empty = (string) => (/^\s*$/).test(string)    //Function that checks if a string is empty
    for (let i = 0; i < maxLength; i++) {              //Loop that scans text. Looks for 2 or more spaces, hence Providing Breaking points for paragraphs
      let str = wholeString.substring(i, i + 2)
      let check = empty(str);
      if (check) {
        parCoor.push(i)                              //If condition returns true (empty* >2), the coordinates of each breaking Point are pushed in an array for future reference
      }
    }
    for (let ii = 0; ii < parCoor.length; ii++) {  //The beginning and end of each paragraph are equal to previous BP - BP
      paragraphs.push(
        [parCoor[ii],
        parCoor[ii + 1]]
      )
    }                                               //We now have the coordinates for each paragraph's beginning and end
    paragraphs[parCoor.length - 1][1] = maxLength;
    for (let i = 0; i < paragraphs.length; i++) {
      if (!(empty                                  //As some paragraphs will contain only spaces (the breaking point for a paragraph is >2 spaces) , they must not be added
        (wholeString.substring                    //Using the coordinates, we push substrings of the text (paragraphs) into the formattedText array
          (paragraphs[i][0], paragraphs[i][1])
        ))
      ) {
        formattedText.push(
          wholeString.substring(paragraphs[i][0], paragraphs[i][1])
        )
      }
    }
    for (let ii = 0; ii < formattedText.length; ii++) {      //Removing potential white spaces in the beginning of each array. They are now redundant because of line break.
      if (empty
        (formattedText[ii]
          .substring(0, 1)
        )) {
        formattedText[ii] = formattedText[ii].substring(2)
      }
    }
    let final = justifierBoy(formattedText);                //We have all the paragraphs. We must now break these down into sub-arrays (lines)
    return final;                                          //As such we call the justifierBoy function with formattedText as paramater
  }
  
  
  const justifierBoy = (paragraphs) => {
    let final = [];                                                   //Final array that contains an array of paragraphs. Each paragraph array contains sub-arrays (lines)
    for (let i = 0; i < paragraphs.length; i++) {                    //Function will loop for number of paragraphs
      let activPar = paragraphs[i];                                 //activPar is the active (studied array) within the loop
      const lineAmount = Math.ceil(activPar.length / 80);
      let justified = [];                                             //justified is a placeholder array containing all the lines of the active paragraph 
      let bP = 0;                                                    //Provides largest possible Breaking point in a line                 
      let chunked = 0;                                              //How many characters of the paragraph have already been chunked/Accounted for
      for (let ii = 0; ii <= lineAmount; ii++) {
        let studyString = activPar.substring(chunked, chunked + 80);  //studyString is to lines what activPar is to paragraphs
        for (let i = 0; i <= 80; i++) {                                    //Finds the Maximum breaking point by looking for empty strings...
          let isEmpty = studyString.substring(i - 1, i)                   //...it is re-assigned everytime it hits a space. Hence its maximum value is 80 (end of line)
          let checker = (/^\s*$/).test(isEmpty);
          if (checker) {
            bP = i - 1;                                                 //The -1 is to take out the now irrelevant space
          }
        }
        if (studyString.substring(0, bP).length > 0) justified.push(studyString.substring(0, bP));  //studyString (line) is then pushed into the justified array (paragraph)
        bP++;
        chunked += bP;                                                                             //next string to study will take place one substring after the previous breaking point
      }
      final.push(justified);                                                                      //We now have the final array of paragraphs with line sub-arrays
    }
    return final;                                                                                //We return it to paraFind, which then returns it to the justifier api to respond
  }
  
  module.exports=paraFind;