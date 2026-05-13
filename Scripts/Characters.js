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
				hp:45,
				maxHp:45,
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
						Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Actions.Magic[0].healing*=1.1;
						Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Glum Farfield")].Actions.Magic[1].healing*=1.1;
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
						healing:3,
						desc:"Heal each member of your party by",
						effect(){
							Party.Characters.forEach((character,index)=>{
								try{
								heal({from:{type:"character"},to:character,amount:this.healing,isPercent:false});
								}catch(e){Console(e)}
							})
						}
					},
					{
						name:"Heal",
						cost:2,
						healing:5,
						desc:"Heal a member of your party by",
						effect(){
							PlayerChooseTarget((index,character)=>{
								try{
									heal({from:{type:"character"},to:Party.Characters[index],amount:this.healing,isPercent:false});
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