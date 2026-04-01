//alert("variables")l
//localStorage.clear();
let error=null;
let waitingForKey=false;
let gameStarted=false;
let awaitingLevelUp=false;
let consoleLines=0;
let consoleOutput=[];
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

let notifications={
	inventory:false,
	achivements:false,
};
var Party={
	level:1,
	luck:1,
	xp:0,
	reputation:50,
	get reputationPercent(){
		if(this.reputation>0||this.reputation<0){
			return this.reputation/100;
		}else{
			return 0
		}
	},
	get Alignment(){
		if(this.reputationPercent<0.1){
			return {name:"Demonic",value:-2};
		}else if(this.reputationPercent>=0.1&&this.reputationPercent<0.4){
			return {name:"Evil",value:-1};
		}else if(this.reputationPercent>=0.4&&this.reputationPercent<0.6){
			return {name:"Neutral",value:0};
		}else if(this.reputationPercent>=0.6&&this.reputationPercent<0.9){
			return {name:"Good",value:1};
		}else if(this.reputationPercent>=0.9){
			return {name:"Godly",value:2};
		}
	},
	maxXp:10,
	gainXp(amount){
		try{
		this.xp+=amount;
		Console(`${amount} xp added to party`, "PARTY.XP.GAIN");
		while(this.xp>=(this.level+1)*GLOBAL.EnemyScaling.rate){
			this.xp-=this.maxXp;
			this.LvUp();
			this.maxXp=(this.level+1)*GLOBAL.EnemyScaling.rate;
		}
		LEVEL.innerHTML=`Global level: ${this.level} (${this.xp}/${this.maxXp})`;
		}catch(e){alert(e)}
	},
	LvUp(){
		this.level++;
		LEVEL.innerHTML=`Global level: ${this.level} (${this.xp}/${this.maxXp})`;
		if(this.level<=10){
			addAchievement(29+this.level);
		}else if(this.level>10){
			if(this.level>=20){
				addAchievement(41);
				if(this.level>=30){
					addAchievement(42);
					if(this.level>=40){
						addAchievement(43);
						if(this.level>=50){
							addAchievement(43);
							if(this.level>=100){
								addAchievement(44);
							}
						}
					}
				}
			}
		}
	},
	money:{
		platinum:0,
		gold:0,
		silver:50,
		copper:25,
		gain(type, amount, isCallback){
			if(isCallback==undefined){
				gainMoney(type, amount);
			}
			this[type]+=amount;
			Console(`Added ${amount} ${type}`, "PARTY.MONEY.GAIN");
			if(this[type]>=100&&type!=="platinum"){
				while(this[type]>=100){
						this[type]-=100;
					if(type==="copper"){
						Console(`Converted 100 copper to 1 silver`, "PARTY.MONEY.CONVERT");
						this.gain("silver",1,false);
					}else if(type==="silver"){
						Console(`Converted 100 silver to 1 gold`, "PARTY.MONEY.CONVERT");
						this.gain("gold",1,false);
					}else{
						Console(`Converted 100 gold to 1 platinum`, "PARTY.MONEY.CONVERT");
						this.gain("platinum",1,false);
					}
				}
			}
			if(this.gold>0||this.platinum>0){
				addAchievement(27);
				if(this.platinum>0){
					addAchievement(28);
					if(this.platinum>=50){
						addAchievement(29);
					}
				}
			}
			UpdateMoney();
		}
	},
	inventory:[],
	Characters:[
		{
			get value(){
					return this;
			},
			Stats:{
				name:"Hen Farfield",
				speed:10,
				hp:50,
				maxHp:50,
				level:0,
				xp:0,
				maxXp:10,
				gainXp(amount){
					this.xp+=amount;
					totalXpGained+=amount;
					UpdateLocalStorage("totalXpGained");
					while(this.xp>=this.maxXp){
						this.xp-=this.maxXp;
						this.LvUp();
						this.maxXp=(this.level+1)*(10*(DIFFICULTY_SLOWLEVELING.checked?2:1));
					}
				},
				LvUp(){
					this.level++;
					levelsGained++;
					UpdateLocalStorage("levelsGained");
					MakeSkillChoice(Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield"));
					if(this.level===2||this.level===4||this.level===6||this.level===8){
						this.startingStamina+=1;
						Console(`Hen gained 1 starting stamina for leveling`, "PARTY.CHARACTER.LEVELUP");
					}
					this.maxHp+=rand(10,20);
				},
				armor:0,
				maxStamina:10,
				startingStamina:4,
				staminaRegen:3,
				stamina:0,
				debuffs:[],
				buffs:[],
				debuffImmunities:[],
				skills:[],
				resistances:{slashing:0,blunt:0,piercing:0,debuff:0,magic:0,holy:0},
			},
			effects:{
				startOfBattle:[],
				startOfTurn:[],
				endOfTurn:[],
				endOfBattle:[],
			},
			Boons:[],
			Sacrifices:[],
			Skills:[
				[
					//level 1 skills
					{
						name:"Conditioning",
						desc:"Gain a 25% resistance to blunt damage",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances.blunt+=0.25;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Conditioning");
						}
					},
					{
						name:"Stamina Battery",
						desc:"Gain +5 Max stamina",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.maxStamina+=5;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Stamina Battery");
						}
					}
				],
				[
					//level 2 skills
					{
						name:"Strong Constitution",
						desc:"Gain a 10% resistance to debuff damage",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Conditioning");
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances.debuff+=0.10;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Strong Constitution");
						}
					},
					{
						name:"Durablity",
						desc:"Gain a 20 max hp",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances.debuff+=0.10;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Durablity");
						}
					},
					{
						name:"Reflex",
						desc:"Gain +1 stamina regen",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Stamina Battery");;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.staminaRegen+=1;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Durablity");
						}
					}
				],
				[
					//level 3 skills
					{
						name:"Innate defence",
						desc:"Gain a 5% damage resistance in every type",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Strong Constitution")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Durablity");
						},
						effect(){
							Array.from(Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances).forEach((resist)=>{Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances[resist]+=0.05});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Innate defence");
						}
					},
					{
						name:"Regeneration",
						desc:"Start each combat with 5 regen",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].effects.startOfBattle.push({
								effect:()=>{
									ApplyBuff("regeneration",Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")],5);
									setTimeout(()=>{Console("5 regen applied")},1000)
								},
								type:"pers"
							})
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Regeneration");
						}
					},
					{
						name:"Quick Strike",
						desc:"Gain +1 starting stamina",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Durablity")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Reflex");
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.startingStamina+=1;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Durablity");
						}
					}
				]
				/*[
					//level 4 skills
					{
						name:"Natural Plating",
						desc:"Gain + 10 armor",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Innate defence")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Regeneration");
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.resistances.forEach((resist)=>{resist+=0.05});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Innate defence");
						}
					},
					{
						name:"Regeneration",
						desc:"Start each combat with 5 regen",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Regeneration");
						}
					},
					{
						name:"Quick Strike",
						desc:"Gain +1 starting stamina",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Durablity")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Reflex");
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.startingStamina+=1;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Durablity");
						}
					}
				]*/
			],
			Equipment:{
				Armor:{
					Head:{},
					Body:{},
					Legs:{},
					Feet:{},
					Hands:{},
				},
				Accessories:{
					Back:{},
					Waist:{},
					Belt:{},
					Ring:{
						Slot1:{},
						Slot2:{},
					},
					Neck:{},
					Arms:{
						Slot1:{},
						Slot2:{},
					},
				},
				Weapons:{}
			},
			Actions:{
				Physical:[
					{
						name:"Punch",
						damage:1,
						target:0,
						damageType:"blunt",
						cost:1,
						desc:"damage to the front enemy",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					},
					{
						name:"Push",
						damage:0,
						target:0,
						cost:2,
						desc:"Swap the first two enemies",
						effect(){
							let first=GLOBAL.Combat.enemies[0]
							GLOBAL.Combat.enemies[0]=GLOBAL.Combat.enemies[1];
							GLOBAL.Combat.enemies[1]=first;
							UpdateEnemyDisplay();
						}
					}
				]
			}
		}
	]
};
const Characters=[
	{
			get value(){
				return this;
			},
			Stats:{
				name:"Big Bean",
				speed:50,
				hp:50,
				maxHp:50,
				level:0,
				xp:0,
				maxXp:10,
				gainXp(amount){
					this.xp+=amount;
					totalXpGained+=amount;
					UpdateLocalStorage("totalXpGained");
					while(this.xp>=this.maxXp){
						this.xp-=this.maxXp;
						this.LvUp();
						this.maxXp=(this.level+1)*(10*(DIFFICULTY_SLOWLEVELING.checked?2:1));
					}
				},
				LvUp(){
					this.level++;
				},
				armor:0,
				maxStamina:10,
				startingStamina:5,
				staminaRegen:4,
				stamina:0,
				debuffs:[],
				buffs:[],
				skills:[],
				debuffImmunities:[],
				resistances:{slashing:0,blunt:-0.5,debuff:0,piercing:0,magic:0,holy:0},
			},
			Equipment:{
				Armor:{
					Head:{},
					Body:{},
					Legs:{},
					Feet:{},
					Hands:{}
				},
				Weapons:{}
			},
			Actions:{
				Physical:[
					{
						name:"Punch",
						damage:1,
						target:0,
						damageType:"blunt",
						cost:1,
						desc:"Deal 1 blunt damage to the front enemy",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					},
					{
						name:"Push",
						damage:0,
						target:0,
						cost:2,
						desc:"Swap the first two enemies",
						effect(){
							let first=GLOBAL.Combat.enemies[0]
							GLOBAL.Combat.enemies[0]=GLOBAL.Combat.enemies[1];
							GLOBAL.Combat.enemies[1]=first;
						}
					}
				]
			}
		},
		{
			get value(){
				return this;
			},
			Stats:{
				name:"Glum Farfield",
				speed:11,
				hp:100,
				maxHp:100,
				level:0,
				xp:0,
				maxXp:10,
				gainXp(amount){
					this.xp+=amount;
					totalXpGained+=amount;
					UpdateLocalStorage("totalXpGained");
					while(this.xp>=this.maxXp){
						this.xp-=this.maxXp;
						this.LvUp();
						this.maxXp=(this.level+1)*(10*(DIFFICULTY_SLOWLEVELING.checked?2:1));
					}
				},
				LvUp(){
					this.level++;
					levelsGained++;
					UpdateLocalStorage("levelsGained");
					if(Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Skills.length>=this.level){
						MakeSkillChoice(Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield"));
					}
					if(this.level===2||this.level===4||this.level===6||this.level===8){
						this.armor++;
						Console(`Glum gained 1 armor for leveling`, "PARTY.CHARACTER.LEVELUP");
					}
					this.maxHp+=rand(10,20);
				},
				armor:0,
				maxStamina:10,
				startingStamina:4,
				staminaRegen:4,
				stamina:0,
				debuffs:[],
				buffs:[],
				debuffImmunities:[],
				skills:[],
				resistances:{slashing:0.5,blunt:0,piercing:0,magic:0,holy:0},
			},
			effects:{
				startOfTurn:[],
				endOfTurn:[],
			},
			Boons:[],
			Sacrifices:[],
			Skills:[
				[
					//level 1 skills
					{
						name:"Bless",
						desc:"Gain the ability to bless a character with +1 stamina on their next turn.",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Actions.Magic.push({
								name:"Bless",
								cost:2,
								desc:"Give a member of your party +1 stamina on their next turn",
								effect(){
									PlayerChooseTarget((index)=>{
										Party.Characters[index].Stats.startingStamina++;
										Party.Characters[index].effects.endOfTurn.push(()=>{
											Party.Characters[index].Stats.startingStamina--;
										})
									});
								}
							});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Stats.skills.push("Bless");
						}
					},
					{
						name:"Smite",
						desc:"Gain the ability to smite an opponent for 20 holy damage.",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Actions.Magic.push({
								name:"Smite",
								damage:20,
								damageType:"holy",
								get cost(){
									return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Stats.staminaRegen;
								},
								desc:"Call upon the the gods themselfs to smite an opponent for 20 holy damage",
								effect(){
									Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
								}
							});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Stats.skills.push("Bless");
						}
					}
				]
			],
			Equipment:{
				Armor:{
					Head:{},
					Body:{},
					Legs:{},
					Feet:{},
					Hands:{}
				},
				Weapons:{}
			},
			Actions:{
				Physical:[
					{
						name:"Punch",
						damage:1,
						target:0,
						damageType:"blunt",
						cost:1,
						desc:"Deal 1 blunt damage to the front enemy",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					},
					{
						name:"Push",
						damage:0,
						target:0,
						cost:2,
						desc:"Swap the first two enemies",
						effect(){
							let first=GLOBAL.Combat.enemies[0]
							GLOBAL.Combat.enemies[0]=GLOBAL.Combat.enemies[1];
							GLOBAL.Combat.enemies[1]=first;
						}
					}
				],
				Magic:[
					{
						name:"Healing Wave",
						cost:4,
						desc:"Heal each member of your party by 3",
						effect(){
							Party.Characters.forEach((character,index)=>{
								try{
								heal({from:{type:"character"},to:character,amount:3,isPercent:false});
								}catch(e){Console(e)}
							})
						}
					},
					{
						name:"Heal",
						cost:2,
						desc:"Heal a member of your party by 5",
						effect(){
							PlayerChooseTarget((index,character)=>{
								try{
									heal({from:{type:"character"},to:Party.Characters[index],amount:5,isPercent:false});
								}catch(e){Console(e)}
							});
						}
					}
				]
			}
		},
		{
			get value(){
				return this;
			},
			Stats:{
				name:"Xalara Talon",
				speed:15,
				hp:30,
				maxHp:30,
				level:0,
				xp:0,
				maxXp:10,
				gainXp(amount){
					this.xp+=amount;
					totalXpGained+=amount;
					UpdateLocalStorage("totalXpGained");
					while(this.xp>=this.maxXp){
						this.xp-=this.maxXp;
						this.LvUp();
						this.maxXp=(this.level+1)*(10*(DIFFICULTY_SLOWLEVELING.checked?2:1));
					}
				},
				LvUp(){
					this.level++;
					levelsGained++;
					UpdateLocalStorage("levelsGained");
					if(Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Skills.length>=this.level){
						MakeSkillChoice(Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon"));
					}
					if(this.level===2||this.level===4||this.level===6||this.level===8){
						this.speed++;
					}
					this.maxHp+=rand(5,10);
				},
				armor:2,
				maxStamina:13,
				startingStamina:5,
				staminaRegen:2,
				stamina:0,
				debuffs:[],
				buffs:[],
				skills:[],
				debuffImmunities:[],
				resistances:{slashing:0,blunt:-0.1,piercing:0.25,magic:0,holy:0,debuff:0},
			},
			effects:{
				startOfTurn:[],
				endOfTurn:[],
			},
			Boons:[],
			Sacrifices:[],
			Skills:[
				[
					//level 1 skills
					{
						name:"Deadly Aim",
						desc:"Gain the action 'Sting Like A Bee' ",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Actions.Ranged.push({
								name:"Sting Like A Bee",
								get cost(){
									return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Stats.staminaRegen;
								},
								desc:"Deals 5 piercing damage to the front enemy, 3 piercing damage to the second enemy, and 1 piercing damage to the third",
								damage:5,
								procCo:1.0,
								procs:[],
								damageType:"piercing",
								effect(){
									Damage({
										Amount:this.damage,
										Type:this.damageType,
										get to(){return GLOBAL.Combat.enemies[0]}
									});
									if(GLOBAL.Combat.enemies[1]){
										Damage({
											Amount:this.damage-2,
											Type:this.damageType,
											get to(){return GLOBAL.Combat.enemies[1]}
										});
									}
									if(GLOBAL.Combat.enemies[2]){
										Damage({
											Amount:this.damage-4,
											Type:this.damageType,
											get to(){return GLOBAL.Combat.enemies[2]}
										});
									}
								}
							});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Stats.skills.push("Deadly Aim");
						}
					},
					{
						name:"Keen Eye",
						desc:"Gain the action 'Feelin' Lucky' to deal 10 piercing damage to the front enemy and stun them for a turn",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Actions.Ranged.push({
								name:"Feelin' Lucky",
								damage:10,
								damageType:"piercing",
								get cost(){
									return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Stats.staminaRegen+1;
								},
								desc:"Deal 10 piercing damage to the front enemy and 100% chance to stun",
								effect(){
									Damage({
										Amount:this.damage,
										Type:this.damageType,
										get to(){
											return GLOBAL.Combat.enemies[0]
										}
									});
								}
							});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Xalara Talon")].Stats.skills.push("Keen Eye");
						}
					}
				]
			],
			Equipment:{
				Armor:{
					Head:{},
					Body:{},
					Legs:{},
					Feet:{},
					Hands:{}
				},
				Weapons:{
					name:"Ranged"
				}
			},
			Actions:{
				Physical:[
					{
						name:"Punch",
						damage:1,
						target:0,
						damageType:"blunt",
						cost:1,
						desc:"damage to the front enemy.",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					},
					{
						name:"Push",
						damage:0,
						target:0,
						cost:2,
						desc:"Swap the first two enemies.",
						effect(){
							let first=GLOBAL.Combat.enemies[0]
							GLOBAL.Combat.enemies[0]=GLOBAL.Combat.enemies[1];
							GLOBAL.Combat.enemies[1]=first;
						}
					},
				],
				Ranged:[
					{
						name:"Far Shot",
						damage:10,
						damageType:"piercing",
						target:-1,
						cost:3,
						desc:"damage to the back enemy.",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					}
				],
			}
		},
	{
			get value(){
				return this;
			},
			Stats:{
				name:"Vimida Kamaka",
				speed:13,
				hp:30,
				maxHp:30,
				level:0,
				xp:0,
				maxXp:10,
				gainXp(amount){
					this.xp+=amount;
					totalXpGained+=amount;
					UpdateLocalStorage("totalXpGained");
					while(this.xp>=this.maxXp){
						this.xp-=this.maxXp;
						this.LvUp();
						this.maxXp=(this.level+1)*(10*(DIFFICULTY_SLOWLEVELING.checked?2:1));
					}
				},
				LvUp(){
					this.level++;
					levelsGained++;
					UpdateLocalStorage("levelsGained");
					MakeSkillChoice(Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield"));
					if(this.level===2||this.level===4||this.level===6||this.level===8){
						this.armor+=2;
						this.speed-=1;
					}
					this.maxHp+=rand(10,20);
				},
				armor:3,
				maxStamina:10,
				startingStamina:4,
				staminaRegen:3,
				stamina:0,
				debuffs:[],
				buffs:[],
				debuffImmunities:[],
				skills:[],
				resistances:{slashing:0,blunt:0,piercing:0,debuff:0,magic:0,holy:0},
			},
			effects:{
				startOfTurn:[],
				endOfTurn:[],
			},
			Boons:[],
			Sacrifices:[],
			Skills:[],
			Equipment:{
				Armor:{
					Head:{},
					Body:{},
					Legs:{},
					Feet:{},
					Hands:{},
				},
				Accessories:{
					Back:{},
					Waist:{},
					Belt:{},
					Ring:{
						Slot1:{},
						Slot2:{},
					},
					Neck:{},
					Arms:{
						Slot1:{},
						Slot2:{},
					},
				},
				Weapons:{}
			},
			Actions:{
				Physical:[
					{
						name:"Punch",
						damage:1,
						target:0,
						damageType:"blunt",
						cost:1,
						desc:"damage to the front enemy, and a 25% chance to increase damage by 0.1",
						effect(){
							if(rand(1,4)===4){this.damage+=0.1;}
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					},
					{
						name:"Push",
						damage:0,
						target:0,
						cost:2,
						desc:"Swap the first two enemies",
						effect(){
							let first=GLOBAL.Combat.enemies[0]
							GLOBAL.Combat.enemies[0]=GLOBAL.Combat.enemies[1];
							GLOBAL.Combat.enemies[1]=first;
							UpdateEnemyDisplay();
						}
					}
				]
			}
		}
];
const Boons=[
	{
		name:"Placeholder Boon",
		desc:"",
		types:["takeDamage"],
		effect(type){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					//effects that trgger when you gain this boon
					break;
			}
		},
		gain(CharacterIndex){
			Party.Characters[CharacterIndex].Boons.push(this);
			this.effect("onGain")
		}
	},
	{
		name:"The Boon of fire",
		desc:"Whenever you take damage deal 5 fire damage to the front enemy",
		types:["takeDamage"],
		effect(type){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//alert("test");
					try{
					Damage({
						Amount: 5,
						to: GLOBAL.Combat.enemies[0],
						Type: "fire"
					})
					}catch(e){alert(e)}
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					//effects that trgger when you gain this boon
					break;
			}
		},
		gain(CharacterIndex){
			Party.Characters[CharacterIndex].Boons.push(this);
		}
	}
];

const Curses=[
	
];
const Sacrifices=[
	{
		name:"Placeholder Sacrifice",
		desc:"",
		costType:[],
		cost(sufferee){
			
		},
		types:[],
		effect(type){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					//effects that trgger when you gain this boon
					break;
			}
		},
		gain(CharacterIndex){
			Party.Characters[CharacterIndex].Sacrifices.push(this);
			this.effect("onGain");
		}
	},
	{
		name:"Blood Pact",
		desc:"Lose 15 Max Hp to gain 2 Max Stamina",
		costType:["onGain"],
		cost(type,sufferee){
			try{
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					sufferee.Stats.maxHp-=15;
					sufferee.Stats.hp-=15;
					//effects that trgger when you gain this boon
					break;
			}
			}catch(e){Console(e,"SACRIFICES.COST")}
		},
		types:[],
		effect(type, gainee){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					gainee.Stats.maxStamina+=2;
					//effects that trgger when you gain this boon
					break;
			}
		},
		gain(CharacterIndex){
			Party.Characters[CharacterIndex].Sacrifices.push(this);
			this.cost("onGain",Party.Characters[CharacterIndex]);
			this.effect("onGain",Party.Characters[CharacterIndex]);
		}
	},
	{
		name:"Brutal Blood Pact",
		desc:"Lose 15 Max Hp to gain 2 Max Stamina",
		costType:["onGain"],
		cost(type,sufferee){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					sufferee.Stats.maxHp=Math.round(sufferee.Stats.maxHp/2);
					if(sufferee.Stats.Hp>sufferee.Stats.maxHp){
						sufferee.Stats.Hp=sufferee.Stats.maxHp;
					}
					//effects that trgger when you gain this boon
					break;
			}
		},
		types:[],
		effect(type, gainee){
			switch (type){
				case "combatStart":
					//effect that triggers at the start of combat
					break;
				case "combatEnd":
					//effects that trigger at the end of combat
					break;
				case "takeDamage":
					//effects that trigger when you take damage
					break;
				case "dealDamage":
					//effects that trigger when you deal damage
					break;
				case "heal":
					//effects that trigger when you heal
					break;
				case "onGain":
					gainee.Stats.maxStamina+=3;
					gainee.Stats.staminaRegen+=2;
					//effects that trgger when you gain this boon
					break;
			}
		},
		gain(CharacterIndex){
			Party.Characters[CharacterIndex].Sacrifices.push(this);
			this.cost("onGain",Party.Characters[CharacterIndex]);
			this.effect("onGain",Party.Characters[CharacterIndex]);
		}
	},
];
let books=0;
let Enchantments=[//Level 1 enchantments
		{
			name:"flame",
			equipment:["Weapons"],
			effect(to){
				Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.FLAME");
				to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
					action.procs.push({
						type:"bonus",
						name:"flame",
						desc:"Deal 3 additional fire damage",
						procChance:1.0,
						damage:3,
						damageType:"fire",
						effect(){
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					})
				})
			}
		},
		{
			name:"lifesteal",
			equipment:["Weapons"],
			effect(to){
				Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.LIFESTEAL");
				to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
					action.procs.push({
					type:"bonus",
					desc:"a chance to heal on hit",
					name:"lifesteal",
					procChance:1.0,
					effect(){
						heal({to:to, from:{type:"lifesteal"},amount:1})
					}
				})
			})
		}
	},
	{
		name:"sharpness",
		equipment:["Weapons"],
		effect(to){
			Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.SHARPNESS");
			to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
				action.damage++;
			})
		}
	},
	{
		name:"toxic",
		equipment:["Weapons"],
		effect(to){
			Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.TOXIC");
			to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
				action.procs.push({
					type:"debuff",
					name:"poison",
					procChance:0.40,
					stacks:1,
				})
			})
		}
	},
	{
		name:"self-dipped",
		equipment:["Weapons"],
		effect(to){
			Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.SELFDIPPED");
			to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
				action.procs.push({
					type:"debuff",
					name:"bleed",
					desc:"if you have bleed ",
					get condition(){
						return to.Stats.debuffs.findIndex((debuff)=>debuff.name==="bleed");
					},
					procChance:0.30,
					stacks:1,
				})
			})
		}
	},
	{
		name:"lucky",
		equipment:["Weapons"],
		effect(to){
			Console(`Giving ${to.Stats.name}'s ${to.Equipment.Weapons.name} ${this.name}`, "ENCHANTMENTS.LUCKY");
			to.Equipment.Weapons.Actions[to.Equipment.Weapons.name].forEach((action)=>{
				action.critChance+=0.19;
			})
		}
	}
]
var Equipment={
	Armor:{
		Modifiers:[
			{name:"Broken",effect(a){addAchievement(5);a.armor=Math.max(0,a.armor-5)},uneffect(){},odds:[0,0.01]},
			{name:"Dented",effect(a){a.armor=Math.max(0,a.armor-3)},uneffect(){},odds:[0.01,0.03]},
			{name:"Scuffed",effect(a){a.armor=Math.max(0,a.armor-1)},uneffect(){},odds:[0.03,0.07]},
			{name:"",effect(a){a.armor+=0},uneffect(){},odds:[0.07,0.52]},
			{name:"Polished",effect(a){a.armor+=1},uneffect(){},odds:[0.52,0.67]},
			{name:"Gilded",effect(a){a.armor+=2},uneffect(){},odds:[0.67,0.8]},
			{name:"Rare",effect(a){a.armor+=3; Party.Characters[a.equippedTo].Stats.speed+=1;},uneffect(a){Party.Characters[a.equippedTo].Stats.speed-=1},odds:[0.8,0.86]},
			{name:"Pristine",effect(a){
				a.armor+=4;
				Party.Characters[a.equippedTo].Stats.resistances.blunt+=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.slashing+=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.piercing+=0.03;
			},uneffect(a){
				Party.Characters[a.equippedTo].Stats.resistances.blunt-=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.slashing-=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.piercing-=0.03;},odds:[0.86,0.91]},
			{name:"Epic",effect(a){
				a.armor+=5;
				Party.Characters[a.equippedTo].Stats.staminaRegen+=2;
			},uneffect(a){
				Party.Characters[a.equippedTo].Stats.staminaRegen-=2;
			},odds:[0.91,0.95]},
			{name:"Legendary",effect(a){
				a.armor+=6
				Party.Characters[a.equippedTo].Stats.staminaRegen+=2;
				//only losing one but gaining two is intentional
			},uneffect(a){
				Party.Characters[a.equippedTo].Stats.staminaRegen-=1;
			},odds:[0.95,0.98]},
			{name:"Mythic",effect(a){
				a.armor+=7;
				Party.Characters[a.equippedTo].Stats.resistances.blunt+=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.slashing+=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.piercing+=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.magic+=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.holy+=0.02;
			},uneffect(a){
				Party.Characters[a.equippedTo].Stats.resistances.blunt-=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.slashing-=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.piercing-=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.magic-=0.02;
				Party.Characters[a.equippedTo].Stats.resistances.holy-=0.02;
			},odds:[0.98,0.99]},
			{name:"Perfected",effect(a){
				addAchievement(4);
				a.armor+=8;
				Party.Characters[a.equippedTo].Stats.staminaRegen+=1;
				Party.Characters[a.equippedTo].Stats.startingStamina+=1;
				Party.Characters[a.equippedTo].Stats.maxStamina+=3;
				Party.Characters[a.equippedTo].Stats.armor+=1;
				Party.Characters[a.equippedTo].Stats.speed+=1;
				Party.Characters[a.equippedTo].Stats.resistances.blunt+=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.slashing+=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.piercing+=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.fire+=0.01;
				Party.Characters[a.equippedTo].Stats.resistances.magic+=0.01;
				Party.Characters[a.equippedTo].Stats.resistances.holy+=0.01;
			},uneffect(a){
				Party.Characters[a.equippedTo].Stats.staminaRegen-=1;
				Party.Characters[a.equippedTo].Stats.startingStamina-=1;
				Party.Characters[a.equippedTo].Stats.maxStamina-=3;
				Party.Characters[a.equippedTo].Stats.speed-=1;
				Party.Characters[a.equippedTo].Stats.resistances.blunt-=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.slashing-=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.piercing-=0.03;
				Party.Characters[a.equippedTo].Stats.resistances.fire-=0.01;
				Party.Characters[a.equippedTo].Stats.resistances.magic-=0.01;
				Party.Characters[a.equippedTo].Stats.resistances.holy-=0.01;
			},odds:[0.99,1]},
		],
		randomMod(){
			let randval = rand(0, 1000) / 1000;
			//let randval = 0.93;
			//alert(randval);
		// Use find or a standard loop to return correctly
		return this.Modifiers.find((modifier) => {
			return modifier.odds[0] <= randval && modifier.odds[1] > randval;
		});

			//return this.Modifiers[0];
		},
		CustomMod(modname){
			return this.Modifiers.find((modifier) => {
				return modifier.name=== modname;
			});
		},
		Head:[
			{
				name:"Crown of the King",
				desc:"A crown once worn by the King who lived in what is now a delapidated castle in Darkwood",
				equippedTo:0,
				armor:5,
				modifier:{},
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Head={};
					if(this.modifier.uneffect){
						this.modifier.uneffect();
					}
				},
				Equip(character, custommod){
					try{
					this.equippedTo=character;
					if(Party.Characters[character].Equipment.Armor.Head.Unequip){
						Party.Characters[character].Equipment.Armor.Head.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					//alert(JSON.stringify(this.modifier))
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Head=this;
					
					}catch(e){alert(e +error)}
				},
			},
			{
				name:"Iron Helm",
				desc:"Basic helmet made from iron",
				equippedTo:0,
				armor:1,
				modifier:{},
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Head={};
				},
				Equip(character, custommod){
					this.equippedTo=character;
					if(Party.Characters[character].Equipment.Armor.Head.Unequip){
						Party.Characters[character].Equipment.Armor.Head.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Head=this;
					
				},
			},
			{
				name:"Archer's Cap",
				desc:"The Dead adventurers cap",
				equippedTo:0,
				armor:1,
				modifier:{},
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Head={};
					Party.Characters[this.equippedTo].Stats.speed-=1;
				},
				Equip(character, custommod){
					this.equippedTo=character;
					if(Party.Characters[character].Equipment.Armor.Head.Unequip){
						Party.Characters[character].Equipment.Armor.Head.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[this.equippedTo].Stats.speed+=1;
					Party.Characters[character].Equipment.Armor.Head=this;
					
				},
			}
		],
		Body:[
			{
				name:"Iron Chestplate",
				desc:"Basic chestplate made from iron",
				equippedTo:0,
				armor:1,
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Body={};
				},
				Equip(character, custommod){
					if(Party.Characters[character].Equipment.Armor.Body.Unequip){
						Party.Characters[character].Equipment.Armor.Body.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Body=this;
					
				},
			}
		],
		Legs:[
			{
				name:"Iron Leggings",
				desc:"Basic leggings made from iron",
				equippedTo:0,
				armor:1,
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Legs={};
				},
				Equip(character,custommod){
					if(Party.Characters[character].Equipment.Armor.Legs.Unequip){
						Party.Characters[character].Equipment.Armor.Legs.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Legs=this;
					
				},
			}
		],
		Feet:[
			{
				name:"Iron Boots",
				desc:"Basic boots made from iron",
				equippedTo:0,
				armor:1,
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Feet={};
				},
				Equip(character,custommod){
					if(Party.Characters[character].Equipment.Armor.Feet.Unequip){
						Party.Characters[character].Equipment.Armor.Feet.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Feet=this;
					
				},
			}
		],
		Hands:[
			{
				name:"Iron Gauntlets",
				desc:"Basic gauntlets made from iron",
				equippedTo:0,
				armor:1,
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Hands={};
				},
				Equip(character, custommod){
					if(Party.Characters[character].Equipment.Armor.Hands.Unequip){
						Party.Characters[character].Equipment.Armor.Hands.Unequip();
					}
					if(!custommod){
						Object.assign(this.modifier,Equipment.Armor.randomMod());
					}else{
						Object.assign(this.modifier,Equipment.Armor.CustomMod(custommod.name));
					}
					if(this.modifier.effect){
						this.modifier.effect(this);
					}
					Party.Characters[this.equippedTo].Stats.armor+=this.armor
					Party.Characters[character].Equipment.Armor.Hands=this;
					
				},
			}
		]
	},
	WeaponsMods:{
		Modifiers:[
			{name:"Broken",
			 effect(a){
				addAchievement(5);
				a.Actions[a.name].forEach((action)=>{action.damage=Math.max(action.damage-3,1)})},uneffect(){},odds:[0,0.01]
			},
			{name:"Dented",
			 effect(a){
				a.Actions[a.name].forEach((action)=>{action.damage=Math.max(action.damage-2,1)})},uneffect(){},odds:[0.01,0.03]
			},
			{name:"Scuffed",
			 effect(a){
				 Party.Characters[a.equippedTo].Stats.speed-=1;},uneffect(a){Party.Characters[a.equippedTo].Stats.speed+=1;},odds:[0.03,0.07]
			},
			{name:"",effect(a){},uneffect(a){},odds:[0.07,0.52]},
			{name:"Polished",
			 effect(a){
				 Party.Characters[a.equippedTo].Stats.speed+=1;
			 },
			 uneffect(a){
				 Party.Characters[a.equippedTo].Stats.speed-=1;
			 },
			 odds:[0.52,0.67]
			},
			{name:"Gilded",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=1;
					let prevEffect=action.effect;
					action.procs.push({
						type:"bonus",
						name:"cash money",
						desc:"Gain 10 copper",
						procChance:1.0,
						effect(){
							Party.money.gain("copper",10);
						}
					})
				});
			},uneffect(){},odds:[0.67,0.8]},
			{name:"Rare",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=2
				});
			},uneffect(a){},odds:[0.8,0.86]},
			{name:"Pristine",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=3
					action.critChance+=0.05;
				});
			},uneffect(a){},odds:[0.86,0.91]},
			{name:"Epic",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=4;
					action.procCo+=0.1;
				});
			},uneffect(a){},odds:[0.91,0.95]},
			{name:"Legendary",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=5;
					action.procs.push({
						name:"bleed",
						type:"debuff",
						procChance:0.25,
						stacks:2
					})
				});
			},uneffect(a){},odds:[0.95,0.98]},
			{name:"Mythic",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=6;
				});
			},uneffect(a){},odds:[0.98,0.99]},
			{name:"Perfected",effect(a){
				a.Actions[a.name].forEach((action)=>{
					action.damage+=7
					action.cost=Math.max(action.cost-2,1)
				});
				addAchievement(4);
			},uneffect(a){},odds:[0.99,1]},
		],
		randomMod(){
			let randval = rand(0, 1000) / 1000;
			//let randval = 0.04;
			//alert(randval);
		// Use find or a standard loop to return correctly
		Console((this.Modifiers.find((modifier) => {return modifier.odds[0] <= randval && modifier.odds[1] > randval})).name, "EQUIPMENT.WEAPONS.WEAPONMODS.RANDOMMOD");
		return this.Modifiers.find((modifier) => {
			return modifier.odds[0] <= randval && modifier.odds[1] > randval;
		});

			//return this.Modifiers[0];
		},
		CustomMod(modname){
			return this.Modifiers.find((modifier) => {
				return modifier.name=== modname;
			});
		},
	},
	Weapons:[
		{
			name:"Longsword",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			enchantments:[],
			get levelable(){
				return !DIFFICULTY_NOUPGRADES.checked;
			},
			Actions:{
				Longsword:[
					{
						name:"Slash",
						damage:5,
						target:0,
						damageType:"slashing",
						cost:2,
						desc:"to the front enemy",
						procCo:1.0,
						critChance:0.01,
						procs:[],
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Stab",
						damage:3,
						target:0,
						damageType:"piercing",
						cost:1,
						desc:"to the front enemy",
						procCo:1.0,
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.5,
								stacks:1,
							}
						],
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect();
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Dagger",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Dagger:[
					{
						name:"Slice",
						damage:3,
						target:0,
						damageType:"slashing",
						cost:1,
						desc:"to the front enemy",
						procs:[],
						critChance:0.01,
						procCo:1.0,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Jab",
						damage:2,
						target:0,
						damageType:"piercing",
						cost:1,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:1.0,
								stacks:1,
							}
						],
						procCo:1.0,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Rapier",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Rapier:[
					{
						name:"Stab",
						damage:4,
						target:0,
						damageType:"piercing",
						cost:1,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.8333,
								stacks:1,
							}
						],
						procCo:0.6,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Jab",
						damage:2,
						target:0,
						damageType:"piercing",
						cost:1,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.41666,
								stacks:1,
							},
							{
								name:"stun",
								type:"debuff",
								procChance:0.41666,
								stacks:1
							}
						],
						procCo:0.6,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Lunge",
						damage:5,
						target:0,
						damageType:"piercing",
						cost:2,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.8333,
								stacks:1,
							}
						],
						procCo:0.6,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Warhammer",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Warhammer:[
					{
						name:"Slam",
						damage:10,
						target:0,
						damageType:"blunt",
						cost:5,
						desc:"to the front enemy and they lose 5% blunt resistance",
						critChance:0.01,
						procs:[],
						procCo:1.5,
						effect(){
							GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((s)=>s.Stats.target)].Stats.resistances.blunt-=0.05;
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Pound",
						damage:5,
						target:0,
						damageType:"blunt",
						cost:3,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"stun",
								type:"debuff",
								procChance:1.0,
								stacks:1
							}
						],
						procCo:1.5,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Shortsword",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Shortsword:[
					{
						name:"Slash",
						damage:3,
						target:0,
						damageType:"slashing",
						cost:1,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[],
						procCo:1.0,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Jab",
						damage:2,
						target:0,
						damageType:"piercing",
						cost:1,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[],
						procCo:1.0,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Spear",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Spear:[
					{
						name:"Impale",
						damage:8,
						target:[0,1],
						damageType:"piercing",
						cost:4,
						desc:"to either of the first two enemies and they lose 1% piercing resistance",
						critChance:0.01,
						procs:[],
						procCo:1.25,
						effect(){
							GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((s)=>s.Stats.target)].Stats.resistances.piercing-=0.05;
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Jab",
						damage:2,
						target:[0,1],
						damageType:"piercing",
						cost:1,
						desc:"to either of the first two enemies",
						critChance:0.01,
						procs:[],
						procCo:1.25,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
					
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Halberd",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Halberd:[
					{
						name:"Jab",
						damage:3,
						target:[0,1],
						damageType:"piercing",
						cost:1,
						desc:"to either of the first two enemies",
						critChance:0.01,
						procs:[],
						procCo:1.25,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Chop",
						damage:3,
						target:[0,1],
						damageType:"slashing",
						cost:1,
						desc:"to either of the first two enemies",
						critChance:0.01,
						procs:[],
						procCo:1.25,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		},
		{
			name:"Warscythe",
			equippedTo:0,
			level:0,
			enchants:0,
			modifier:{},
			Actions:{
				Warscythe:[
					{
						name:"Harvest",
						damage:6,
						target:[0,1],
						damageType:"slashing",
						cost:3,
						desc:"to either of the first two enemies",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.50,
								stacks:3
							}
						],
						procCo:1.0,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					},
					{
						name:"Carve",
						damage:4,
						target:0,
						damageType:"slashing",
						cost:2,
						desc:"to the front enemy",
						critChance:0.01,
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.75,
								stacks:2
							}
						],
						procCo:1,
						effect(){
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										if(proc.condition==undefined){
											ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
										}else{
											if(proc.condition){
												ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks);
											}
										}
									}else if(proc.type==="bonus"){
										proc.effect();
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
						}
					}
				]
			},
			Unequip(){
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
				if(this.modifier.uneffect){
					this.modifier.uneffect(this);
				}
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
				Party.Characters[character].Equipment.Weapons=this;
					if(this.modifier.effect){
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
				Object.assign(Party.Characters[character].Actions,this.Actions);
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e)}
			},
		}
	],
};
//GLOBAL.EnemyScaling.rate


let Events=[
	[
		{
			name:"Rest Site",
			text:"You find yourself standing above a small campfire, embers drifting up from the small sticks and logs in the flames.",
			options:[
				{
					text:"Rest to restore 30% of each characters max hp",
					condition(){
						return true;
					},
					effect(){
						Party.Characters.forEach((character,index)=>{
							heal({from:{type:"event"},to:character,amount:0.3,isPercent:true});
						})
					}
				},
				{
					text:"Leave",
					condition(){
						return true;
					},
					effect(){}
				}
			]
		},
		{
			name:"The Stranger",
			text:`Who stands before you?`,
			options:[
				{
					text:"Offer your brother an adventure beyond his wildest dreams (requires Hen Farfield)",
					condition(){
						return Party.Characters.filter((member)=>member.Stats.name==="Hen Farfield").length===1;
					},
					effect(){
						Party.reputation+=1;
						Party.Characters.push(Characters[1]);
						charactersGotten++;
						UpdateLocalStorage("charactersGotten");
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Stranger");
						}
						addAchievement(6);
					}
				}
			]
		},
		{
			name:"Exiled Alchemist",
			text:`A disheveled and dirty figure in a tattered robe approaches you from the woods. You can't see his face, but you can almost feel it's piercing gaze. The figure porcures a mysterious liquid from it's coat and rasps "Pleeaase, take one." `,
			options:[
				{
					text:"Take the mysterious potion",
					condition(){
						return true;
					},
					effect(){
						const randVal=rand(1,4);
						if(randVal===1){
							Party.Characters[rand(0,Party.Characters.length)].Stats.maxHp+=10;
						}else if(randVal===2){
							heal({from:{type:"event"},to:Party.Characters[rand(0,Party.Characters.length)],amount:0.3,isPercent:true});
						}else if(randVal===3){
							Party.Characters.forEach((character,index)=>{
								Damage({Amount:20,Type:"magic",get to(){return Party.Characters[rand(0,Party.Characters.length)]}});
							});
						}
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Exiled Alchemist");
						}
					}
				},
				{
					text:"Quickly leave",
					condition(){
						return true;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Exiled Alchemist");
						}
					}
				}
			]
		},
		{
			name:"Abandoned Castle",
			text:`Through a shady glade of dark trees, you find yourself facing a huge castle.<br>Windows broken in, and shattered.<br> as you walk towards the majestic building, you kick up thick layer of pollen that had settled itself down on the ground at your feet.<br>The King's crown rests on a shelf just inside the doorway.<br>What do you do?`,
			options:[
				{
					text:"Steal the crown for yourself...",
					condition(){
						return true;
					},
					effect(){
						addAchievement(9);
						PlayerChooseTarget((index)=>{Equipment.Armor.Head[0].Equip(index)});
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Abandoned Castle");
						}
					}
				},
				{
					text:"Quickly leave",
					condition(){
						return true;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Abandoned Castle");
						}
					}
				}
			]
		},
		{
			name:"Pillaged Camp",
			text:`The people who came through here left many things...<br>What will you do?`,
			options:[
				{
					text:"Grab some armor.",
					condition(){
						return false;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Pillaged Camp");
						}
					}
				},
				{
					text:"Grab some food. (restore 10% of each characters max hp)",
					condition(){
						return true;
					},
					effect(){
						Party.Characters.forEach((character,index)=>{
							heal({from:{type:"event"},to:character,amount:0.1,isPercent:true});
						});
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Pillaged Camp");
						}
					}
				},
				{
					text:"Grab some weapons.",
					condition(){
						return true;
					},
					effect(){
						MakeEquipChoice(3);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Pillaged Camp");
						}
					}
				},
				{
					text:"Investigate the camp closer...",
					condition(){
						return true;
					},
					effect(){
						MakeSubEvent(0);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Pillaged Camp");
						}
					}
				}
			]
		},
		{
			name:"Mercenary Camp",
			text:`On a hill in the middle of the plains you find a camp with a few friendly mercenaries.`,
			options:[
				{
					text:"Fight them",
					condition(){
						return true;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Mercenary Camp");
						}
						try{
						GLOBAL.Combat.StartCombat(true, ["Mercenary","Mercenary","Mercenary"]);
						}catch(e){alert(e+error)}
					}
				},
				{
					text:"Rest with them for a while. (restore 10% of each characters max hp)",
					condition(){
						return true;
					},
					effect(){
						Party.Characters.forEach((character,index)=>{
							heal({from:{type:"event"},to:character,amount:0.1,isPercent:true});
						});
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Mercenary Camp");
						}
					}
				},
				{
					text:"Grab some weapons.",
					condition(){
						return true;
					},
					effect(){
						MakeEquipChoice(3);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Mercenary Camp");
						}
					}
				},
				{
					text:"Hire one of the mercenaries",
					condition(){
						return (Party.money.gold>=1||Party.money.platinum>=1)&&false;
					},
					effect(){
						MakeSubEvent(0);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Mercenary Camp");
						}
					}
				}
			]
		},
		{
			name:"The Blacksmith",
			text:`In a field of long dead plants and ashes lies a blacksmith shop...<br>As you walk towards it you feel a chill run down your spine...<br>That chill fades away long before you reach the shop because of the pleasent warmness emanating from the shop.<br>The blacksmith offers to improve all of your weapons.<br>but when you try to pay him he says<br>"No need, I can see you've been through enough."`,
			options:[
				{
					text:"Let him reforge your weapons (+2 damage each)",
					condition(){
						return true;
					},
					effect(){
						Events[0]=Events[0].filter((event)=>event.name!=="The Blacksmith");
						Party.Characters.forEach((character)=>{
							if(character.Equipment.Weapons){
								character.Actions[character.Equipment.Weapons.name].forEach((action)=>{
									action.damage+=2;
								})
							}
						});
					}
				},
				{
					text:"Force him to accept payment (-10 reputation)",
					condition(){
						return true;
					},
					effect(){
						GLOBAL.Combat.StartCombat(true,["The Blacksmith"]);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Blacksmith");
						}
						Party.reputation-=10;
					}
				},
			]
		},
		{
			name:"Gaurd Training Camp",
			text:"As you are passing through a small town, you stumble upon a garrison where the local soldiers are training. They are very friendly and one of the guards invites you to train with them.",
			options:[
				{
					text:"Train your endurance",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							Party.Characters[index].Stats.staminaRegen+=1;
						})
						MakeSubEvent(1);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Gaurd Training Camp");
						}
					}
				},
				{
					text:"Train your vitality",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							Party.Characters[index].Stats.maxHp+=15
						})
						MakeSubEvent(2);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Gaurd Training Camp");
						}
					}
				},
				{
					text:"Train your reflexes",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							Party.Characters[index].Stats.speed+=2
						})
						MakeSubEvent(3);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Gaurd Training Camp");
						}
					}
				},
			]
		},
		{
			name:"Phyloce Of Blessings",
			text:`A majestic creature stands before you, legs laid on the ground wings wrapped around it like sleeves of a fancy jacket.<br>`,
			options:[
				{
					text:"Receive The Blessing Of Fire",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							Boons[1].gain(index);
						});
						addAchievement(7);
						MakeSubEvent(4);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Phyloce Of Blessings");
						}
					}
				},
				{
					text:"Receive The Blessing Of Magic",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							if(!Object.keys(Party.Characters[index].Actions).includes("Magic")){
								Object.assign(Party.Characters[index].Actions,
									{
										Magic:[
											{
												name:"Firebolt",
												damage:5,
												damageType:"Fire",
												cost:1,
												desc:"to any enemy, A spell given to you by The Phyloce in the woods",
												effect(){
													Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
												}
											},
										]
									}
								)
							}else{
								Party.Characters[index].Actions.Magic.push({
												name:"Firebolt",
												damage:5,
												damageType:"Fire",
												cost:1,
												desc:"to any enemy, A spell given to you by The Phyloce in the woods",
												effect(){
													Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
												}
											})
							}
						});
						addAchievement(8);
						MakeSubEvent(5);
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Phyloce Of Blessings");
						}
					}
				}
			]
		},
		{
			name:"The Wounded Adventurer",
			text:`A Woman lies on the ground, a gash through her stomach...<br>Her skin as white as a ghost, curled black hair draped down her back flows around the bow sitting in a clip at her back as well.<br>What do you do?`,
			options:[
				{
					text:"Try to Cure her wounds... (Requires Glum Farfield as a party member, +15 reputation)",
					condition(){
						return Party.Characters.filter((member)=>member.Stats.name==="Glum Farfield").length===1;
					},
					effect(){
						Party.Characters.push(Characters[2]);
						Party.reputation+=15;
						charactersGotten++;
						UpdateLocalStorage("charactersGotten");
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Wounded Adventurer");
						}
						Party.reputation+=10;
					}
				},
				{
					text:"Patch up her wounds... (+10 reputation)",
					condition(){
						return true;
					},
					effect(){
						Party.Characters.push(Characters[2]);
						charactersGotten++;
						UpdateLocalStorage("charactersGotten");
						//heal()
						Party.reputation+=10;
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Wounded Adventurer");
						}
						Party.reputation+=5;
					}
				},
			]
		},
		{
			name:"The Skeleton",
			text:`A figure lays in the road ahead of you, motionless.<br>As you approach you see the cloth of his clothing is deeply sunk into their chest, like they haven't eaten in months.<br>Then you finally realize that they left the world of the living long ago...<br>The corpse is wearing a simple leather tunic, light boots of elven craft, and an archers cap.`,
			options:[
				{
					text:"Take the archers cap (-5 reputation)",
					condition(){
						return true;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Skeleton");
						}
						Party.reputation-=5;
						PlayerChooseTarget((index)=>{
							Equipment.Armor.Head[2].Equip(index);
						})
					}
				},
				{
					text:"Take the tunic (-5 reputation)",
					condition(){
						return true;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Skeleton");
						}
						Party.reputation-=5;
					}
				},
				{
					text:"Take the elven boots (-6 reputation)",
					condition(){
						return Party.Alignment.value<1;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Skeleton");
						}
						Party.reputation-=6;
					}
				},
				{
					text:"Let the dead rest (+10 reputation, requires >60% reputation)",
					condition(){
						return Party.Characters.filter((member)=>member.Stats.name==="Glum Farfield").length===1;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Skeleton");
						}
						Party.reputation+=10;
					}
				},
				{
					text:"Desecrate the corpse. (-10 reputation, requires <40% reputation)",
					condition(){
						return Party.Alignment.value<0;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="The Skeleton");
						}
						Party.reputation-=10;
					}
				}
			]
		},
		{
			name:"Barren Path",
			text:`Upon going forward, a room full of dense greenery surrounds you, and in a dark corner a slightly used path is visible; walking through a red circle made of some sort of red liquid glows with a faint demonic light. The middle of the circle has a blackened bowl, filled of previously fresh blood, you are overcome with the urge to slash your finger and put in a drop of blood.`,
			options:[
				{
					text:"Resist (Requires Glum Farfield)",
					condition(){
						return Party.Characters.filter((member)=>member.Stats.name==="Glum Farfield").length===1;
					},
					effect(){
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Barren Path");
						}
						Party.reputation+=10;
					}
				},
				{
					text:"Give in (-6 Reputation)",
					condition(){
						return true;
					},
					effect(){
						PlayerChooseTarget((index)=>{
							Sacrifices[1].gain(index);
						})
						Party.reputation-=6;
						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Barren Path");
						}

						Party.reputation-=6;
					}
				},
				{
					text:"Embrace (-25 Reputation)(Requires Evil)",
					condition(){
						return Party.Alignment.value<0;
					},
					effect(){
						
						//heal()
						PlayerChooseTarget((index)=>{
							Sacrifices[2].gain(index);
						})
						Party.reputation-=25;

						if(!GLOBAL.usingSeed){
							Events[0]=Events[0].filter((event)=>event.name!=="Barren Path");
						}
						Party.reputation+=5;
					}
				},
			]
		},
	]
];
/*{
		name:"Rainy Shore",
		text:`In the cold shower of nature, you take a humble gravel path thats soaked with the essence of natures tears,<br> alies a peaceful beach that is gleeming with a gloomy tranquility.<br>You take in it's refreshing air remensecing this moment.  `,
		options:[
			{
				text:"Let him reforge your weapons (+2 damage each)",
				condition(){
					return true;
				},
				effect(){
					Party.Characters.forEach((character)=>{
						character.Actions[character.Equipment.Weapons.name]
					})
				}
			},
			{
				text:"Force him to accept payment",
				condition(){
					return true;
				},
				effect(){
					GLOBAL.Combat.StartCombat(true,["The Blacksmith"])
				}
			},
		]
		
	}*/
let subEvents=[
	{
		name:"You investigate the camp...",
		text:`As you look around the small camp, a small note sitting on the floor of one of the tents catches your eye.<br><fieldset><legend>Dear travelers...</legend>We have suffered many losses.<br>This was left here as a warning, <b><i>IT</i></b> is coming.<br>and there is nothing that your can do to stop it...<br><b>BEWARE!</b></fieldset>`,
		options:[
			{
				text:"Leave.",
				condition(){
					return true;
				},
				effect(){
					
				}
			}
		]
	},
	{
		name:"you trained your stamina!",
		text:`The selected character's stamina regen increased by 1`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},
	{
		name:"you trained your vitality!",
		text:`The selected character's health increased by 10`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},
	{
		name:"you trained your reflexes!",
		text:`The selected character's speed increased by 2`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},
	{
		name:"You received the boon of fire",
		text:`When the selected character is dealt damage, the front enemy takes 5 fire damage`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},
	{
		name:"You received the boon of magic",
		text:`The selected character gained the ability "Firebolt"<br>Magic->Firebolt (1 stamina): Deals 5 fire damage to any enemy.`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},
];
Console("Turn based game/Scripts/variables.js loaded");

let GLOBAL={
	alertVals:{
		inventory:0,
		achievements:0,
	},
	set alerts(type){
		this.alertVals[type[0]]=type[1];
		if(this.alertVals.inventory||this.alertVals.achievements){
			if(this.alertVals.achievements){
				OPENACHIEVEMENTS.classList.add("alert");
			}else{
				INVENTORYBUTTON.classList.add("alert");
			}
			PAUSEBUTTON.classList.add("alert");
		}else{
			PAUSEBUTTON.classList.remove("alert");
		}
		if(!this.alertVals.achievements){
			OPENACHIEVEMENTS.classList.remove("alert");
		}
		if(!this.alertVals.inventory){
			INVENTORYBUTTON.classList.remove("alert");
		}
	},
	seed:null,
	get armorFalloff(){
		return DIFFICULTY_ARMORFALLOFF.checked?2.5:2;
	},
	get usingSeed(){
		return false;
	},
	get maxEnchants(){
		return 5-(DIFFICULTY_ENCHANTLIMIT.checked?2:0);
	},
	SkillsWaiting:0,
	difficultySelected:[],
	presetNames:[
		"Tough guys 1",
		"Tough guys 2",
		"Tough guys 3",
		"Crowded 1",
		"Crowded 2",
		"Crowded 3",
		"Nerfed 1",
		"Nerfed 2",
		"Nerfed 3",
		"Nerfed 4",
		"Nerfed 5",
		"Nerfed 6",
		"Annoying",
		"Bigger badder (and more)",
		"Uphill struggle",
		"HELL 1",
		"HELL 2",
		"HELL 3",
		"HELL 4",
		"HELL 5",
		"HELL 6",
		"HELL 7",
		"HELL 8",
		"HELL 9",
		"HELL 10",
		"HELL 11",
		"HELL 12",
		"HELL 13",
		"To The Max!"
	],
	presets:[
		[1,0,0,0,0,1],//Tough guys 1
		[1,1,0,0,0,1],//Tough guys 2
		[1,1,0,0,0,1,1],//Tough guys 3
		[0,1,0,0,1],//Crowded 1
		[0,1,0,0,1,1],//Crowded 2
		[0,1,0,0,1,1,1],//Crowded 3
		[0,0,0,0,0,0,0,1,0,1],//Nerfed 1
		[0,0,0,0,0,0,0,1,1,1],//Nerfed 2
		[0,0,1,0,0,0,0,1,1,1],//Nerfed 3
		[0,0,1,1,0,0,0,1,1,1],//Nerfed 4
		[0,0,1,1,0,0,0,1,1,1,0,1],//Nerfed 5
		[0,0,1,1,0,0,0,1,1,1,1,1],//Nerfed 6
		[0,0,0,0,0,1,0,1,1,0,0,1],//Annoying
		[1,1,0,0,1,1,1,0,0,1],//Bigger badder (and more)
		[1,1,1,0,1,1,1,1,0,1,1],//Uphill struggle
		[0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,0,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,0,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,0,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,0,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,0,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,0,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	Achievements:[
		"1. Humble beginnings: start your first game.",
		"2. Thats enough: heal a character at max hp.",
		"3. One punch man: kill an enemy in a single hit.",
		"4. Not interested: skip a weapon pickup.",
		"5. Thats nice: get a perfected equipment.",
		"6. Thats bad: get a broken equipment.",
		"7. Brotherhood: recruit your brother to help on your adventure.",
		"8. Fireheart: recive the blessing of fire from the phyloce of blessings.",
		"9. Firepower: recive the blessing of magic from the phyloce of blessings.",
		"10. Thievery: steal the crown of the former king in Darkwood.",
		"11. Experience I: play 10 games.",
		"12. Experience II: play 25 games.",
		"13. Experience III: play 50 games.",
		"14. Experience IV: play 100 games.",
		"15. Experience V: play 500 games.",
		"16. Slayer I: start your first battle.",
		"17. Slayer II: start 10 battles.",
		"18. Slayer III: start 25 battles.",
		"19. Slayer IV: start 50 battles.",
		"20. Slayer V: start 100 battles.",
		"21. Slayer VI: start 200 battles.",
		"22. Slayer VII: start 300 battles.",
		"23. Slayer VIII: start 400 battles.",
		"24. Slayer IX: start 500 battles.",
		"25. Slayer X: start 1000 battles.",
		"26. Improvements: improve a weapon by equipping a weapon with the same name",
		"27. Too easy?: Play on a higher difficulty.",
		"28. Not quite poor: Carry at least one gold.",
		"29. Not quite rich: carry at least one platinum.",
		"30. Actually rich: carry at least 50 platinum.",
		"31. Endless I: start a fight",
		"32. Endless II: reach global level 2",
		"33. Endless III: reach global level 3",
		"34. Endless IV: reach global level 4",
		"35. Endless V: reach global level 5",
		"36. Endless VI: reach global level 6",
		"37. Endless VII: reach global level 7",
		"38. Endless VIII: reach global level 8",
		"39. Endless IX: reach global level 9",
		"40. Endless X: reach global level 10",
		"41. Endless XI: reach global level 20",
		"42. Endless XII: reach global level 30",
		"43. Endless XIII: reach global level 40",
		"44. Endless XIV: reach global level 50",
		"45. Endless XV: reach global level 100",
		"46. Active I: perform 100 actions.",
		"47. Active II: perform 200 actions.",
		"48. Active III: perform 400 actions.",
		"49. Active IV: perform 800 actions.",
		"50. Active V: perform 1600 actions.",
		"51. Active VI: perform 3200 actions.",
		"52. Active VII: perform 6400 actions.",
		"53. Active VIII: perform 12800 actions.",
		"54. Active IX: perform 25600 actions.",
		"55. Active X: perform 51200 actions.",
		"56. Critical strike: land a Crit.",
		"57. Enchanted I: apply an enchantment",
		"58. Enchanted II: apply 2 enchantments to the same equipment",
		"59. Enchanted III: apply 3 enchantments to the same equipment",
		"60. Enchanted IV: apply 4 enchantments to the same equipment",
		"61. Enchanted V: apply 5 enchantments to the same equipment",
		"62. Ripper I: deal 100 damage",
		"63. Ripper II: deal 250 damage",
		"64. Ripper III: deal 500 damage",
		"65. Ripper IV: deal 1000 damage",
		"66. Ripper V: deal 2500 damage",
		"67. Ripper VI: deal 5000 damage",
		"68. Ripper VII: deal 10000 damage",
		"69. Ripper VIII: deal 25000 damage",
		"70. Ripper IX: deal 50000 damage",
		"71. Ripper X: deal 100000 damage",
		"72. Tanky I: take 100 damage",
		"73. Tanky II: take 250 damage",
		"74. Tanky III: take 500 damage",
		"75. Tanky IV: take 1000 damage",
		"76. Tanky V: take 2500 damage",
		"77. Tanky VI: take 5000 damage",
		"78. Tanky VII: take 10000 damage",
		"79. Dedication I: reach profile level 1",
		"80. Dedication II: reach profile level 2",
		"81. Dedication III: reach profile level 3",
		"82. Dedication IV: reach profile level 4",
		"83. Dedication V: reach profile level 5",
		"84. Dedication VI: reach profile level 10",
		"85. Dedication VII: reach profile level 20",
		"86. Dedication VIII: reach profile level 30",
		"87. Dedication IX: reach profile level 40",
		"88. Dedication X: reach profile level 50",
	],
	buffs:{
		regen:{
			name:"regen",
			desc:"Heals 1 hp per stack at the end of turn (then -1 stack)",
			triggerTime:0,
			stacks:0,
			target:null,
			assign(to,stack){
				if(to.Stats){
					let BuffCopy=this;
					if(to.Stats.buffs.findIndex((buff)=>buff.name==this.name)==-1){
						BuffCopy.stacks=stack;
						BuffCopy.target=to;
						BuffCopy.effect=function (){
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.buffs.push(BuffCopy);
					}else{
						to.Stats.buffs[to.Stats.buffs.findIndex((buff)=>buff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
	},
	debuffs:{
		bleed:{
			name:"bleed",
			desc:"Deals 1 damage per stack at the beginning of the turn (then -1 stack)",
			triggerTime:0,
			stacks:0,
			target:null,
			get DamageOb(){
				return {
					Amount:this.stacks,
					Type: "debuff",
					to:this.target,
					useArmor: false
				}
			},
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							Damage(this.DamageOb);
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else{
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
		poison:{
			name:"poison",
			desc:"Deals 1 damage per stack at the end of the turn (then -1 stack)",
			triggerTime:1,
			stacks:0,
			target:null,
			get DamageOb(){
				return {
					Amount:this.stacks,
					Type: "debuff",
					to:this.target,
					useArmor: false,
				}
			},
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							Damage(this.DamageOb);
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else{
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
		stun:{
			name:"stun",
			desc:"Skips your turn <i>(Doesn't stack)</i>",
			triggerTime:0,
			target:null,
			stacks:0,
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							this.stacks--;
							PassTurn();
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else if(to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks<stack){
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks=stack;
					}
				}
			}
		},
		exaustion:{
			name:"exaustion",
			desc:"Makes 1 random action for each stack cost 1 more to use <i>(doesn't stack)</i>",
			triggerTime:0,
			stacks:0,
			target:null,
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							try{
							let actions=[];
							Object.keys(this.target.Actions).forEach((key)=>{
								this.target.Actions[key].forEach((action,index)=>{
									actions.push([key,index]);
								});
							});
								//Console(`${JSON.stringify(actions)}`)
							for(let costIncrement=0;costIncrement<this.stacks;costIncrement++){
								let randVal=rand(0,actions.length-1);
								this.target.Actions[actions[randVal][0]][actions[randVal][1]].cost++;
								this.target.effects.endOfTurn.push({effect:()=>{
									this.target.Actions[actions[randVal][0]][actions[randVal][1]].cost--;
									this.stacks--;
								},type:"temp"})
							}
							}catch(e){Console(`Error occured while activating the 'exaustion's effect\n${e}`)}
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else if(to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks<stack){
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks=stack;
					}
				}
			}
		},
		vulnerable:{
			name:"vulnerable",
			triggerTime:0,
			stacks:0,
			target:null,
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						Object.keys(DebuffCopy.target.Stats.resistances).forEach((key)=>{
							DebuffCopy.target.Stats.resistances[key]-=0.5;
						});
						DebuffCopy.effect=function (){
						this.stacks--;
							if(this.stacks<=0){
								Object.keys(this.target.Stats.resistances).forEach((key)=>{
									this.target.Stats.resistances[key]+=0.5;
								});
							}
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else{
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
		silence:{
			name:"silence",
			desc:"",
			triggerTime:1,
			stacks:0,
			target:null,
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else if(to.Stats.debuffs[to.Stats.debuffs.findindex((debuff)=>debuff.name==this.name)].stacks<stack){
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks=stack;
					}
					Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
						ability.checkAbility();
					});
					}
				}
			},
			disarm:{
				name:"disarm",
				desc:"",
				triggerTime:1,
				stacks:0,
				target:null,
				assign(to,stack){
					if(to.Stats){
						let DebuffCopy=this;
						
						if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
							DebuffCopy.stacks=stack;
							DebuffCopy.target=to;
							DebuffCopy.effect=function (){
								this.stacks--;
							};
							//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
							to.Stats.debuffs.push(DebuffCopy);
						}else if(to.Stats.debuffs[to.Stats.debuffs.findindex((debuff)=>debuff.name==this.name)].stacks<stack){
							to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks=stack;
						}
					
					}
					Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
						ability.checkAbility();
					});
				}
			},
		burn:{
			name:"burn",
			desc:"Deals 1 damage per stack at the beginning of the turn (then -1 stack)",
			triggerTime:0,
			stacks:0,
			target:null,
			get DamageOb(){
				return {
					Amount:this.stacks,
					Type: "fire",
					to:this.target,
					useArmor: false,
				}
			},
			assign(to,stack){
				if(to.Stats){
					let DebuffCopy=this;
					if(to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)==-1){
						DebuffCopy.stacks=stack;
						DebuffCopy.target=to;
						DebuffCopy.effect=function (){
							Damage(this.DamageOb);
							if(this.stacks<=0){
								Object.keys(this.target.Stats.resistances).forEach((key)=>{
									this.target.Stats.resistances[key]+=0.5;
								});
							}
							this.stacks--;
						};
						Object.keys(DebuffCopy.target.Stats.resistances).forEach((key)=>{
							DebuffCopy.target.Stats.resistances[key]-=0.5;
						});
						DebuffCopy.effect=function (){
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.debuffs.push(DebuffCopy);
					}else{
						to.Stats.debuffs[to.Stats.debuffs.findIndex((debuff)=>debuff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
		get debuffList(){
			let output=[];
			Object.keys(this).forEach((key)=>{
				if(typeof this[key]==="object"){
					output.push(this[key]);
				}
			});
			return output;
		},
		get random(){
			return this.debuffList[rand(0,this.debuffList.length-1)];
		}

	},
	buffs:{
		regeneration:{
			name:"regeneration",
			desc:"Heals 1 hp per stack at the start of your turn (then -1 stack)",
			triggerTime:0,
			stacks:0,
			target:null,
			assign(to,stack){
				if(to.Stats){
					let buffCopy=this;
					if(to.Stats.buffs.findIndex((buff)=>buff.name==this.name)==-1){
						buffCopy.stacks=stack;
						buffCopy.target=to;
						buffCopy.effect=function (){
							heal({from:{type:"character"},to:to,amount:stack});
							this.stacks--;
						};
						//Console(`assigning ${JSON.stringify(DebuffCopy)} to ${to.Stats.name}`)
						to.Stats.buffs.push(buffCopy);
					}else{
						to.Stats.buffs[to.Stats.buffs.findIndex((buff)=>buff.name==this.name)].stacks+=stack;
					}
				}
			}
		},
		get buffList(){
			let output=[];
			Object.keys(this).forEach((key)=>{
				if(typeof this[key]==="object"){
					output.push(this[key]);
				}
			});
			return output;
		},
		get random(){
			return this.buffList[rand(0,this.buffList.length-1)];
		}
	},
	get difficulty(){
		let out=0;
		Array.from(DIFFICULTY_CHECKS).forEach((check)=>{
			if(check.checked){
				out++;
			}
		})
		return out;
	},
	mapNode:[0,0],//Zone, event
	EnemiesCreated:0,
	KeysPressed:[],
	get EnemyScaling(){
		return {
			get rate(){
				return 10/(DIFFICULTY_FASTERSCALING.checked?2:1);
			},
			get amount(){
				return 1*(DIFFICULTY_DOUBLESCALING.checked?2:1)*(DIFFICULTY_SWARMS.checked?0.5:1);
			}
		}
	},
	get EnemyDamageMult(){
		return 0.25*(DIFFICULTY_DOUBLEDAMAGESCALING.checked?2:1);
	},
	Combat:{
		fights:0,
		inCombat:false,
		turn:0,
		round:0,
		enemies:[],
		SpawnCard:{
			//Level 1
			Zone:[
				{
					name:"The Beginning",
					cards:[
						{
							easy:[
								["Debuffer","Bandit"],//encounters
								["Bandit","Cultist"]
							],
							hard:[
								["Debuffer","Bandit","Bandit"],
								["Bandit","Bandit","Cultist"]
							]
						},
						//Level 2
						{
							easy:[
								["Bandit","Bandit"],//encounters
								["Bandit","Cultist"]
							],
							hard:[
								["Bandit","Debuffer","Bandit"],
								["Bandit","Bandit","Cultist"]
							]
						},
						{
							easy:[
								["Debuffer","Bandit","Bandit"],//encounters
								["Bandit","Bandit","Cultist"]
							],
							hard:[
								["Mercenary","Bandit","Assassin"],
								["Mercenary","Bandit","Cultist"],
							]
						}
					],
					Card(prop, level){
						if(!level){
							if(this.cards[Math.min(Party.level-1,this.cards.length-1)][prop].length>1){
								return this.cards[Math.min(Party.level-1,this.cards.length-1)][prop][rand(0,this.cards[Math.min(Party.level-1,this.cards.length-1)][prop].length)]
							}else{
								return this.cards[Math.min(Party.level-1,this.cards.length-1)][prop][0];
							}
						}else{
							if(this.cards[Math.min(level-1,this.cards.length-1)][prop].length>1){
								return this.cards[Math.min(level-1,this.cards.length-1)][prop][rand(0,this.cards[Math.min(level-1,this.cards.length-1)][prop].length)]
							}else{
								return this.cards[Math.min(level-1,this.cards.length-1)][prop][0];
							}
						}
					}
				}
			]
		},
		StartCombat(RANDENEMIES,ENEMYOBJECTS_OR_ENEMYTYPES){
			try{
				this.fights++;
				battles++;
				UpdateLocalStorage("battles");
				addAchievement(30)
				if(battles>=1){
					addAchievement(15);
					if(battles>=10){
						addAchievement(16);
						if(battles>=25){
							addAchievement(17);
							if(battles>=50){
								addAchievement(18);
								if(battles>=100){
									addAchievement(19);
									if(battles>=200){
										addAchievement(20);
										if(battles>=300){
											addAchievement(21);
											if(battles>=400){
												addAchievement(22);
												if(battles>=500){
													addAchievement(23);
													if(battles>=1000){
														addAchievement(24);
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
				if(!Array.isArray(ENEMYOBJECTS_OR_ENEMYTYPES)){
					throw new TypeError(`GLOBAL.Combat.StartCombat() "ENEMYOBJECTS_OR_ENEMYTYPES" was not declared as an array (declared as an "${typeof ENEMYOBJECTS_OR_ENEMYTYPES}")`);
				}
				if(RANDENEMIES){
						if(ENEMYOBJECTS_OR_ENEMYTYPES.every((element)=>typeof element=="string")){
							error=" fight"
							for(var numberOfEnemies=0;numberOfEnemies<ENEMYOBJECTS_OR_ENEMYTYPES.length;numberOfEnemies++){
								//alert(numberOfEnemies);
								let additionEnemy=new Enemy(ENEMYOBJECTS_OR_ENEMYTYPES[numberOfEnemies]);
								this.enemies.push(additionEnemy);
							}
							if(DIFFICULTY_SWARMS.checked){
								this.enemies.push(new Enemy(ENEMYOBJECTS_OR_ENEMYTYPES[ENEMYOBJECTS_OR_ENEMYTYPES.length-1]));
							}
							UpdateEnemyDisplay();
							UpdateTurnOrder(true);
							FIGHTDIALOG.show();
							this.inCombat=true;
							UpdateEnemyStatDisplay(GLOBAL.Combat.enemies.findIndex((s)=>s.Stats.target))
						}else{
							throw new TypeError(`GLOBAL.Combat.StartCombat() "RANDENEMIES" argument was declared as true, but "ENEMYOBJECTS_OR_ENEMYTYPES" was not declared as an array of only strings (Elements that were not strings are: "${ENEMYOBJECTS_OR_ENEMYTYPES.filter((element)=>typeof element!=="string")}")`);
						}
				}else{
				
				}
				TriggerStartOfBattleEffects();
				Party.Characters.forEach((character)=>{
					character.Stats.gainXp(this.fights*Math.max((this.enemies.length-1),1));
				})
				Party.gainXp(this.fights*Math.max((this.enemies.length-1),1))
			}catch(e){Console(e+error)}
		},
		EndCombat(){
			this.enemies=[];
			this.turn=0;
			this.round=0;
			this.inCombat=false;
			FIGHTDIALOG.close();
			GLOBAL.Combat.round=0;
			GLOBAL.Combat.turn=0;
			Party.Characters.forEach((character)=>{
				character.Stats.debuffs=[];
			})
			let chanceValue=rand(0,100);
			if(Party.Characters.findIndex((character)=>character.name==="Glum Farfield")===-1&&GLOBAL.Combat.fights>=3){
				MakeEvent(1);
			}else{
				if(chanceValue<50){
					//make it random equipment when I figure that out
					MakeEquipChoice(rand(2,4));
					EQUIPDIALOG.show();
				}else if(chanceValue>=50){
					MakeEvent(rand(0,Events.length-1));
				}
			}
		}
	}
}

let stats={
	"games played":games,
	"actions taken":actionsTaken,
	"achievement completion":`${(achievements.length/GLOBAL.Achievements.length*100).toFixed(2)}%`,
	"battles started":`${battles}`,
	"equipment upgraded":`${equipmentUpgraded}`,
	"characters recruited":`${charactersGotten}`,
	"enemies defeated":`${enemiesDefeated}`,
	"debuffs applied":`${debuffsApplied}`,
	"damage taken":`${damageTaken.toFixed(2)}`,
	"damage dealt":`${damageDealt.toFixed(2)}`,
	"levels gained":`${levelsGained}`,
	"money gained":`<ul><li>Copper: ${moneyGained.copper}</li><li>Silver: ${moneyGained.silver}</li><li>Gold: ${moneyGained.gold}</li><li>Platinum: ${moneyGained.platinum}</li></ul>`,
	"amount healed":`${amountHealed} Hp`,
	"xp gained":`${totalXpGained} Xp`,
	"profile level":` Level ${findTotalLevel()}`
}