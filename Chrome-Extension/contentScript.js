(() => {

  // geo = Geographical Entity
  // org = Organization
  // per = Person
  // gpe = Geopolitical Entity
  // tim = Time indicator
  // art = Artifact
  // eve = Event
  // nat = Natural Phenomenon
  colors = {'geo': 'rgb(235, 235, 25)', 'org': 'plum', 'per': 'lightskyblue', 'gpe': 'rgb(220, 198, 176)', 'tim': 'lightcoral', 'art': 'lightpink', 'eve': 'lightseagreen', 'nat': 'lightsalmon'};

  // Get the text content of the <p> element inside <div id="detailContent">
  const detailContent = document.querySelector("#detailContent");

  if (detailContent) {

    const paragraphs = detailContent.querySelectorAll("p");

    let paragraphList = [];
    for (let i = 0; i < paragraphs.length; i++) {
      paragraphList.push(paragraphs[i].textContent);
    }

    const payload = {
      textList: paragraphList
    };

    fetch('http://127.0.0.1:8000/nermarker/gettext/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => response.json()).then(data => {
      tokenList = data.textToken;
      labelList = data.parsedlabel;

      // Loop through all <p> elements and extract their text content
      for (let i = 0; i < paragraphs.length; i++) {
    
        const targetParagraph = paragraphs[i];

        const check_img = targetParagraph.querySelector("img");
        const check_imgnote = targetParagraph.querySelector("span.editor-desc.editor-img-desc");
        if (check_img || check_imgnote) {
          continue;
        }

        const textstring = targetParagraph.textContent;
        const words = targetParagraph.textContent.split(" ");
  
        let newpHtml = "";
        
        originT = tokenList[i];
        parsedT = labelList[i];
  
        pretag = "";
        preword = "";
        let T_idx = 0;
        for (let w_idx = 0; w_idx < words.length; w_idx++) {
          const word = words[w_idx].trim();
          const re = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}■~]/g;
          plainWord = word.replace(re, "");
          
          if (plainWord == "") {
            if (preword != "" && pretag != "") {
              newpHtml += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[pretag]};">${preword}</span>` + " ");
              preword = "";
              pretag = "";
            }
            newpHtml += word;
            if (w_idx != (words.length - 1)) {
              newpHtml += " ";
            }
          }
          else {
            idx = T_idx
            check_token = originT[idx];
            while (plainWord != check_token) {
              if (idx >= originT.length-1) {
                break;
              }
              idx += 1;
              check_token += originT[idx];
            }
            if (idx == T_idx) {
              if (pretag != parsedT[T_idx]) {
                if (preword != "" && pretag != "") {
                  newpHtml += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[pretag]};">${preword}</span>` + " ");
                  preword = "";
                  pretag = "";
                }
                if (parsedT[T_idx] != "OOO" && parsedT[T_idx] != "AG>") {
                  preword = word;
                  pretag = parsedT[T_idx];
                  if (w_idx == (words.length - 1)) {
                    newpHtml += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[pretag]};">${preword}</span>`);
                  }
                } else {
                  newpHtml += word;
                  if (w_idx != (words.length - 1)) {
                    newpHtml += " ";
                  }
                }
              }
              else {
                preword += (" " + word);
                if (w_idx == (words.length - 1)) {
                  newpHtml += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[pretag]};">${preword}</span>`);
                }
              }
            }
            else {
              if (preword != "" && pretag != "") {
                newpHtml += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[pretag]};">${preword}</span>` + " ");
                preword = "";
                pretag = "";
              }
              newword = "";
              punc_idx = 0;
              ptag = "";
              pword = "";
              for (let index = T_idx; index <= idx ; index++) {
                if (ptag != parsedT[index]) {
                  if (ptag != "" && pword != "") {
                    newword += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[ptag]};">${pword}</span>`);
                    ptag = "";
                    pword = "";
                  }
                  if (parsedT[index] != "OOO" && parsedT[index] != "AG>") {
                    if (punc_idx > 0 && punc_idx < word.length) {
                      newword += word[punc_idx];
                      punc_idx += 1;
                    }
                    ptag = parsedT[index];
                    pword = originT[index];
                    if (index == idx) {
                      newword += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[ptag]};">${pword}</span>`);
                    }
                  } else {
                    if (punc_idx > 0 && punc_idx < word.length) {
                      newword += word[punc_idx];
                      punc_idx += 1;
                    }
                    newword += originT[index];
                  }
                }
                else {
                  if (punc_idx > 0 && punc_idx < word.length) {
                    pword += word[punc_idx];
                    punc_idx += 1;
                  }
                  pword += originT[index];
                  if (index == idx) {
                    newword += (`<span style="padding: 2px 4px; border-radius: 6px; background-color: ${colors[ptag]};">${pword}</span>`);
                  }
                }
                punc_idx += originT[index].length;
              }
              newpHtml += newword;
              if (w_idx != (words.length - 1)) {
                newpHtml += " ";
              }
            }
            T_idx = idx + 1;
          }
          // console.log(newpHtml);
        }
        targetParagraph.innerHTML = newpHtml;
      }
    }).catch(error => console.error(error));
    
  }

})();
