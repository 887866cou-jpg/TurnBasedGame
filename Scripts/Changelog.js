const Changelog=[
	{plan:"Add combats to zone 2 after it is confirmed that bosses work."},
	{plan:"Add on death effects for enemies."},
	{devNote:`Please make sure that if the game doesn't seem to be working as intended, please use the shortcut "shift" + "backspace" to open the console, and show me or send me a screenshot. Thanks :)`},
	{WIP:"Adding more events to zone 1"},
	{version:"0.1.2",change:"Fixed a bug where the turn would be passed to nobody when a character died",d:24,m:4,y:2026},
	{version:"0.1.1",change:"Added the changelog",d:24,m:4,y:2026}
];
const Months=["January","February","March","April","May","June","July","August","September","October","November","December"];
function makeChangelog(){
	CHANGELOG.innerHTML="";
	Changelog.forEach((log)=>{
		let NEWCHANGE=DOC.createElement("p");
		if(log.devNote){
			NEWCHANGE.style.color="red";
			NEWCHANGE.innerHTML=`${log.devNote}`;
			CHANGELOG.appendChild(NEWCHANGE);
			CHANGELOG.appendChild(DOC.createElement("br"));
		}
	});
	Changelog.forEach((log)=>{
		let NEWCHANGE=DOC.createElement("p");
		if(!log.plan&&!log.WIP&&!log.devNote){
			if(!log.d&&!log.m&&!log.y){
				NEWCHANGE.innerHTML=`v${log.version}: ${log.change}`;
			}else{
				NEWCHANGE.innerHTML=`v${log.version} (${Months[log.m-1]} ${log.d}${addEnding(log.d)}, ${log.y}): ${log.change}`;
			}
			CHANGELOG.appendChild(NEWCHANGE);
			CHANGELOG.appendChild(DOC.createElement("br"));
		}
	});
	Changelog.forEach((log)=>{
		let NEWCHANGE=DOC.createElement("p");
		if(log.WIP){
			NEWCHANGE.innerHTML=`W.I.P: ${log.WIP}`;
			CHANGELOG.appendChild(NEWCHANGE);
			CHANGELOG.appendChild(DOC.createElement("br"));
		}
	});
	let planNum=1;
	Changelog.forEach((log, index)=>{
		let NEWCHANGE=DOC.createElement("p");
		if(log.plan){
			NEWCHANGE.innerHTML=`Plan #${planNum}: ${log.plan}`;
			CHANGELOG.appendChild(NEWCHANGE);
			CHANGELOG.appendChild(DOC.createElement("br"));
			planNum++;
		}
	});
}
function addEnding(number){
	if(`${number}`[`${number}`.length-1]=="1"&&(number<10||number>19)){
		return "st";
	}else if(`${number}`[`${number}`.length-1]=="2"&&(number<10||number>19)){
		return "nd"
	}else if(`${number}`[`${number}`.length-1]=="3"&&(number<10||number>19)){
		return "rd"
	}else{
		return "th";
	}
}