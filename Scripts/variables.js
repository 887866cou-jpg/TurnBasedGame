//alert("variables")l
//localStorage.clear();
let error=null;
let waitingForKey=false;
let gameStarted=false;
let awaitingLevelUp=false;
let consoleLines=0;
let consoleOutput=[];
let combatLogOutput=[];
let combatLogMessages=0;
let activeMessages=0;
let combatLog=0;
let hasErrored=false;
let hidelist=["System","Rolls","SEEDGEN","TSoBE"];
let showOnly;
let isIdle=false;
let idleTimer=setTimeout(()=>{
	isIdle=true;
	Console("You are idle","IDLEPREVENTION")
},300000)
let notifications={
	inventory:false,
	achivements:false,
};
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
//GLOBAL.EnemyScaling.rate



Console("Turn based game/Scripts/variables.js loaded");

let stats={
	"games played":games,
	"actions taken":actionsTaken,
	"achievement completion":`${(achievements.length/GLOBAL.Achievements.length*100).toFixed(2)}% (${achievements.length}/${GLOBAL.Achievements.length})`,
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
	"profile level":` Level ${findTotalLevel()}`,
	"Total time spent":`${toDaysHoursMinutesSeconds(timePlayed)}`
}