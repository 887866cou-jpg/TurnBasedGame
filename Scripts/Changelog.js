const Changelog=[
	{plan:"Add combats to zone 2 after it is confirmed that bosses work."},
	{plan:"Add on death effects for enemies."},
	{plan:"Add a besiary"},
	{devNote:`Please make sure that if the game doesn't seem to be working as intended, please use the shortcut "shift" + "backspace" to open the console, and show me or send me a screenshot. Thanks :)`},
	{devNote:`If you have time, please see if you can get the boss for zone 1, The other thing to note is that after the boss you might see some strange things, for example: events will stop poping up because the event list changed to one that has nothing in it yet. Thanks again people! :)`},
	{devNote:`If you want to see how close you are to the boss combat you can type in "/bossProg" in the debug menu and it will tell you the number of combats you need to complete and the number you have completed`},
	{WIP:`Finding Mythological creatures to add to the game as zone 2 enemies/bosses (I'm looking through <a href="https://en.wikipedia.org/wiki/List_of_legendary_creatures_by_type" target="_blank">this list</a>)`},
	{WIP:"Adding more events to zone 1"},
	{WIP:"Adding more characters for zone 2"},
	{version:[0,2,30],change:"Changed the treekin enemy debuff immunity from 'Bleed' to 'bleed'",d:14,m:5,y:2026},
	{version:[0,2,29],change:"Added a system for stacks of consumables being used, and added the uses property so that they can be used multiple times.",d:14,m:5,y:2026},
	{version:[0,2,28],change:"Added consumables to the inventory",d:14,m:5,y:2026},
	{version:[0,2,27],change:"Added a new enemies, the Gallinipper, to Zone 2 (Matthew)",d:14,m:5,y:2026},
	{version:[0,2,26],change:"Rounded the healing in action descriptions",d:13,m:5,y:2026},
	{version:[0,2,25],change:"Added an event to zone 2",d:13,m:5,y:2026},
	{version:[0,2,24],change:"Nerfed Glums healing from x1.5 every level, back to x1.1 every other level",d:13,m:5,y:2026},
	{version:[0,2,23],change:"Added time played achievements",d:13,m:5,y:2026},
	{version:[0,2,22],change:"Added poison back",d:13,m:5,y:2026},
	{version:[0,2,21],change:"Changed the descriptions of character's actions that heal to the actual amount that they heal",d:13,m:5,y:2026},
	{version:[0,2,20],change:"Implemented drops into the game along with a revamped inventory system",d:12,m:5,y:2026},
	{version:[0,2,19],change:"Buffed Glums healing from x1.1 every other level, to x1.5 every level",d:12,m:5,y:2026},
	{version:[0,2,18],change:"Fixed the turn counter on the combat log messages",d:12,m:5,y:2026},
	{version:[0,2,17],change:"Nerfed Glum Farfield's starting hp stat",d:12,m:5,y:2026},
	{version:[0,2,16],change:"Added idle prevention for time spent stat.",d:12,m:5,y:2026},
	{version:[0,2,15],change:"Fixed a bug where the amount of time displayed in the stats menu wasn't how much time you had actually spent in game.",d:12,m:5,y:2026},
	{version:[0,2,14],change:"Fixed a bug where the game would try to apply a debuff to a dead body",d:8,m:5,y:2026},
	{version:[0,2,13],change:"Fully removed a deprecated debug console function from the game (Hopefully)",d:8,m:5,y:2026},
	{version:[0,2,12],change:"Teporarily removed poison",d:8,m:5,y:2026},
	{version:[0,2,11],change:"Cleaned up the debug console",d:7,m:5,y:2026},
	{version:[0,2,10],change:"Fixed a few bugs",d:7,m:5,y:2026},
	{version:[0,2,9],change:"Added a time played statistic",d:7,m:5,y:2026},
    {version:[0,2,8],change:"Edited the Glum Farfield introduction text and description (Matthew)",d:6,m:5,y:2026},
	{version:[0,2,7],change:"Made it so that the strixes are not physically disabled",d:6,m:5,y:2026},
	{version:[0,2,6],change:"Fully finished the strix stats and actions.",d:6,m:5,y:2026},
	{version:[0,2,5],change:"Added the strix to the zone 2 spawncards",d:6,m:5,y:2026},
	{version:[0,2,4],change:"Added descriptions to chance rolls in the console.",d:5,m:5,y:2026},
	{version:[0,2,3],change:"Fixed a bug for enemy action descriptions that don't deal damage.",d:5,m:5,y:2026},
	{version:[0,2,2],change:"Fixed a bug where the GLOBAL.Combat.EndCombat() function wasn't being called, but a collection of code that did <u>almost</u> the same thing was.",d:5,m:5,y:2026},
	{version:[0,2,1],change:"Added Combat log, and fixed some minor bugs.",d:1,m:5,y:2026},
	{version:[0,2,0],change:"Started to work on the enemies and descriptions of zone 2",d:29,m:4,y:2026},
	{version:[0,1,3],change:"Added placholders to start zone 2 combats as well as the boss for zone 1",d:28,m:4,y:2026},
	{version:[0,1,2],change:"Fixed a bug where the turn would be passed to nobody when a character died",d:24,m:4,y:2026},
	{version:[0,1,1],change:"Added the changelog",d:24,m:4,y:2026}
];
const Months=["January","February","March","April","May","June","July","August","September","October","November","December"];
function findCurrentVersion(){
	let output=[0,1,1];
	Changelog.forEach((log)=>{
		if(log.version){
			if(log.version[0]>output[0]){
				output=log.version;
			}else if(log.version[0]==output[0]){
				if(log.version[1]>output[1]){
					output=log.version;
				}else if(log.version[1]==output[1]){
					if(log.version[2]>output[2]){
						output=log.version;
					}
				}
			}
		}
	})
	Console(`${output.join(".")}`)
	return output;
}
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
				NEWCHANGE.innerHTML=`v${log.version.join(".")}: ${log.change}`;
			}else{
				NEWCHANGE.innerHTML=`v${log.version.join(".")} (${Months[log.m-1]} ${log.d}${addEnding(log.d)}, ${log.y}): ${log.change}`;
			}
			NEWCHANGE.style.color="green";
			CHANGELOG.appendChild(NEWCHANGE);
			CHANGELOG.appendChild(DOC.createElement("br"));
		}
	});
	Changelog.forEach((log)=>{
		let NEWCHANGE=DOC.createElement("p");
		if(log.WIP){
			NEWCHANGE.innerHTML=`W.I.P: ${log.WIP}`;
			NEWCHANGE.style.color="Orange";
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