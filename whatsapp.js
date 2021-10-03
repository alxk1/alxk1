function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


function download(filename, text) {
	console.log("Downloading " + filename);
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

let groupCount = 0
let collectedProfiles = []


function collectData(groupTag){
	
	contactsList =  Array.prototype.slice.call(document.getElementsByTagName('section')[0].querySelectorAll('div[data-testid="cell-frame-container"]')).map(function(a){
	    let gridCells = a.querySelectorAll('div[role="gridcell"]');
	    let {numberTag,nameTag} = gridCells;
	    let status= gridCells[0].parentElement.children[1].children[0].innerText

	    let imgTag = a.getElementsByTagName('img')[0];

	    let imgSrc = (imgTag!=undefined)?imgTag.src:undefined;
	    let phoneNumber = gridCells[0].innerText
	    let nickName = gridCells[1].innerText
	    return {groupTag,phoneNumber,nickName, imgSrc,status};

	})

	for (var i = 0; i < contactsList.length; i++) {
		var j = 0
		for (; j < collectedProfiles.length; j++) {
			if (collectedProfiles[j].phoneNumber == contactsList[i].phoneNumber) {
				break
			}
		}

		if (j==collectedProfiles.length) {
			collectedProfiles.push(contactsList[i])
		}
	}
}

async function collect_group_data(){
	collectedProfiles = []

	groupTag = document.getElementsByTagName('header')[1].querySelectorAll('div[role="button"]')[1].children[0].children[0].children[0].outerHTML
	document.getElementsByTagName('header')[1].querySelector('div[role="button"]').click()
	await sleep(1000);
	try{
		document.getElementsByTagName('section')[0].querySelectorAll('span[data-icon="down"]')[0].click()
	}catch(error){

	}

	scrollElement = document.getElementsByTagName('section')[0].parentElement;
	let speed = 200;
	while(true) {
		collectData(groupTag);
		await sleep(750);

		let scrollBefore = scrollElement.scrollTop;
		scrollElement.scrollTo(0, scrollElement.scrollTop + speed);
		if (scrollElement.scrollTop === scrollBefore) {
		  await sleep(1000);
		  scrollElement.scrollTo(0, scrollElement.scrollTop + speed);
		  if (scrollElement.scrollTop === scrollBefore) break;
		}
	}

	let jsonText = JSON.stringify(collectedProfiles)
	let saveFileName = groupCount.toString()+'.json'

	download(saveFileName,jsonText)

	groupCount++

	console.log(saveFileName);
}
