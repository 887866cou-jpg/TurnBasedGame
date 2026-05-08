let baseSettings={
	Visuals:{
		
	},
	Other:{
		Attack_interval_delay:500,
	}
	
};
var games=JSON.parse(localStorage.getItem("games"))??0;
var achievements=JSON.parse(localStorage.getItem("achievements"))??[];
var battles=JSON.parse(localStorage.getItem("battles"))??0;
var actionsTaken=JSON.parse(localStorage.getItem("actionsTaken"))??0;
var settings=JSON.parse(localStorage.getItem("settings"))??baseSettings;
var equipmentUpgraded=JSON.parse(localStorage.getItem("equipmentUpgraded"))??0;
var charactersGotten=JSON.parse(localStorage.getItem("charactersGotten"))??0;
var enemiesDefeated=JSON.parse(localStorage.getItem("enemiesDefeated"))??0;
var debuffsApplied=JSON.parse(localStorage.getItem("debuffsApplied"))??0;
var damageTaken=JSON.parse(localStorage.getItem("damageTaken"))??0;
var damageDealt=JSON.parse(localStorage.getItem("damageDealt"))??0;
var levelsGained=JSON.parse(localStorage.getItem("levelsGained"))??0;
var moneyGained=JSON.parse(localStorage.getItem("moneyGained"))??{
	platinum:0,
	gold:0,
	silver:0,
	copper:0,
};
var amountHealed=JSON.parse(localStorage.getItem("amountHealed"))??0;
var totalXpGained=JSON.parse(localStorage.getItem("totalXpGained"))??0;
var presetsBeaten=JSON.parse(localStorage.getItem("presetsBeaten"))??[];
var timePlayed=JSON.parse(localStorage.getItem("timePlayed"))??0;
let startTime=new Date();
function findTotalLevel(){
	let output=1;
	for(let remainingXp=totalXpGained;output*10<remainingXp;remainingXp-=output*10){
		output++;
	}
	if(output>=1){
		addAchievement(78);
		if(output>=2){
			addAchievement(79);
			if(output>=3){
				addAchievement(80);
				if(output>=4){
					addAchievement(81);
					if(output>=5){
						addAchievement(82);
						if(output>=10){
							addAchievement(83);
							if(output>=20){
								addAchievement(84);
								if(output>=30){
									addAchievement(85);
									if(output>=40){
										addAchievement(86);
										if(output>=50){
											addAchievement(87);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	Console(output);
	return output;
}
function gainMoney(type, amount){
		moneyGained[type]+=amount;
		if(moneyGained[type]>=100&&type!=="platinum"){
			while(moneyGained[type]>=100){
					moneyGained[type]-=100;
				if(type==="copper"){
					gainMoney("silver",1);
				}else if(type==="silver"){
					gainMoney("gold",1);
				}else{
					gainMoney("platinum",1);
				}
			}
		}
		UpdateLocalStorage("moneyGained");
}
function addTime(){
	const currentTime=new Date();
	function getTotalseconds(date){
		let output=0;
		output+=Math.floor(date.getTime()/1000);
		return output;
	}
	Console(getTotalseconds(currentTime)-getTotalseconds(startTime))
	timePlayed+=getTotalseconds(currentTime)-getTotalseconds(startTime);
	startTime=currentTime;
	UpdateLocalStorage("timePlayed");
}
function toDaysHoursMinutesSeconds(seconds){
	let output=[];
	let remainder=0;
	if(Math.floor(seconds/8640)>0){
		output.push(`${Math.floor(seconds/86400)} Days `);
	}
	output.push(`${`${Math.floor((seconds%86400)/360)}`.padStart(2,"0")}:`);
	output.push(`${`${Math.floor(((seconds%86400)%360)/60)}`.padStart(2,"0")}.`);
	output.push(`${`${(((seconds%86400)%360)%60)}`.padStart(2,"0")}`);
	Console(output.join(""));
	return output.join("");
}

UpdateLocalStorage("games");
UpdateLocalStorage("achievements");
UpdateLocalStorage("battles");
UpdateLocalStorage("actionsTaken");
UpdateLocalStorage("settings");
UpdateLocalStorage("equipmentUpgraded");
UpdateLocalStorage("charactersGotten");
UpdateLocalStorage("enemiesDefeated");
UpdateLocalStorage("debuffsApplied");
UpdateLocalStorage("damageTaken");
UpdateLocalStorage("damageDealt");
UpdateLocalStorage("levelsGained");
UpdateLocalStorage("moneyGained");
UpdateLocalStorage("amountHealed");
UpdateLocalStorage("totalXpGained");
UpdateLocalStorage("presetsBeaten");
UpdateLocalStorage("timePlayed");