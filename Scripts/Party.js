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
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Quick Strike");
						}
					}
				],
				[
					//level 4 skills
					{
						name:"Natural Plating",
						desc:"Gain + 10 armor",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Innate defence")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Regeneration");
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.armor+=10;
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Natural Plating");
						}
					},
					/*{
						name:"Regeneration",
						desc:"Start each combat with 5 regen",
						get condition(){
							return true;
						},
						effect(){
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Regeneration");
						}
					},*/
					{
						name:"Weapons Training",
						desc:"The weapon Equipped to Hen Farfield gets -1 stamina cost on all of its actions (to a minimum of 1)",
						get condition(){
							return Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Regeneration")||Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.includes("Quick Strike");
						},
						effect(){
							//alert(Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Actions[Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Equipment.Weapons.name]);
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Actions[Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Equipment.Weapons.name].forEach((action)=>{
								action.cost=Math.max(1,action.cost-1);
							});
							Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")].Stats.skills.push("Weapons Training");
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