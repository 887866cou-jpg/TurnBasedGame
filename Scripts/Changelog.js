const Changelog=[
	{plan:"Add combats to zone 2 after it is confirmed that bosses work."},
	{plan:"Add on death effects for enemies."},
	{devNote:`Please make sure that if the game doesn't seem to be working as intended, please use the shortcut "shift" + "backspace" to open the console, and show me or send me a screenshot. Thanks :)`},
	{devNote:`If you have time, please see if you can get the boss for zone 1, The other thing to note is that after the boss you might see some strange things, for example: events will stop poping up because the event list changed to one that has nothing in it yet. Thanks again people! :)`},
	{devNote:`If you want to see how close you are to the boss combat you can type in "/bossProg" in the debug menu and it will tell you the number of combats you need to complete and the number you have completed`},
	{WIP:"Adding more events to zone 1"},
	{version:"0.2.0",change:"Started to work on the enemies and descriptions of zone 2",d:29,m:4,y:2026},
	{version:"0.1.3",change:"Added placholders to start zone 2 combats as well as the boss for zone 1",d:28,m:4,y:2026},
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