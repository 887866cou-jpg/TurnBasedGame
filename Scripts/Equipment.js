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
				armor:2,
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
			},
			{
				name:"Elven boots",
				desc:"Lightweight leather boots of Evlen make",
				equippedTo:0,
				armor:1,
				modifier:{},
				Unequip(){
					Party.Characters[this.equippedTo].Stats.armor-=this.armor
					Party.Characters[this.equippedTo].Equipment.Armor.Feet={};
				},
				Equip(character, custommod){
					this.equippedTo=character;
					if(Party.Characters[character].Equipment.Armor.Feet.Unequip){
						Party.Characters[this.equippedTo].Stats.speed-=1
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
					Party.Characters[this.equippedTo].Stats.speed+=1
					Party.Characters[character].Equipment.Armor.Feet=this;
					
				},
			},
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
				Console(a.equippedTo,"POLISHED.MODIFIER")
				 Party.Characters[a.equippedTo].Stats.speed+=1;},uneffect(a){Party.Characters[a.equippedTo].Stats.speed=1;},
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
					action.damage+=8;
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
			//randval = 0.52;
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((s)=>s.Stats.target)].Stats.resistances.blunt-=0.05;
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
					
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance});
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
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}, crit:this.critChance,});
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
						}
					}
				]
			},
			Unequip(){
				if(this.modifier.uneffect){
					this.modifier.uneffect(Party.Characters[this.equippedTo].Equipment.Weapons);
				}
				delete Party.Characters[this.equippedTo].Actions[this.name];
				Party.Characters[this.equippedTo].Equipment.Weapons={};
			},
			Equip(character,custommod){
				try{
				this.equippedTo=character;
				Console(`this.equippedTo set to "${this.equippedTo}"`,"EQUIPMENT.WEAPONS.EQUIP(WARSCYTHE)")
				if(Party.Characters[character].Equipment.Weapons.Unequip){
					Party.Characters[character].Equipment.Weapons.Unequip();
				}
				
				if(!custommod){
					//this line here is part of a weapon V
					error=1;
					Object.assign(this.modifier,Equipment.WeaponsMods.randomMod());
				}else{
					error=2;
					Object.assign(this.modifier,Equipment.WeaponsMods.CustomMod(custommod.name));
				}
					error=3;
				Party.Characters[character].Equipment.Weapons=this;
					error=4;
					if(this.modifier.effect){
						error=5;
						this.modifier.effect(Party.Characters[character].Equipment.Weapons);
					}
					error=6
				Object.assign(Party.Characters[character].Actions,this.Actions);
					error=7;
				Console(`${Party.Characters[character].Stats.name} equipped a ${this.modifier.name} ${this.name}`, "EQUIPMENT.WEAPONS.EQUIP");
				}catch(e){Console(e+" (error:"+error+")")}
			}
		}
	],
};