class Enemy{
	constructor(PREDEFINED_ENEMY_TYPE,ENEMY_OBJECT){
		try{
			const enemy=this;
		switch(PREDEFINED_ENEMY_TYPE){
			case "Debuffer":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				this.Stats={
					hp:(15*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					name:`Debuffer ${GLOBAL.EnemiesCreated}`,
					maxHp:(15*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					armor:0,
					type:"Debuffer",
					speed:rand(1,6),
					resistances:{slashing:0,blunt:0,piercing:0,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					"Twisted dagger":[
						{
							name:"Painful jab",
							damage:1*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"Piercing",
							desc:"damage to the front hero and apply 1 exaustion",
							procs:[
								{
									name:"exaustion",
									type:"debuff",
									procChance:1,
									stacks:1
								}
							],
							procCo:1.0,
							effect(){
								try{
								Console(`{Amount:${this.damage},Type:${this.damageType},get to(){return ${JSON.stringify(Party.Characters[0].Stats)}}}`)
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
								}catch(e){Console(e)}
							}
							
						},
						{
							name:"Cursed slash",
							damage:2*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"slashing",
							desc:"damage to the front hero and 50% chance to apply 1 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.50,
									stacks:1
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,from:enemy,using:this});
							}
							
						}
					]
				};
				this.AttackPattern=[["Twisted dagger",0],["Twisted dagger",1]];
				this.AttackStage=0;
				break;
			case "Bandit":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				let randHpVal=rand(12,18);
				this.Stats={
					hp:(randHpVal*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					maxHp:(randHpVal*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					name:`bandit ${GLOBAL.EnemiesCreated}`,
					armor:0,
					type:"Bandit",
					speed:rand(7,15),
					resistances:{slashing:rand(30,41)/100,blunt:-(rand(10,16)/100),piercing:0,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Rapier:[
					{
						name:"Stab",
						damage:4*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
						damageType:"piercing",
						desc:"damage to the front hero and 50% chance to inflict 3 bleed",
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
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this,using:this,using:this});
							}
					},
					{
						name:"Jab",
						damage:2*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
						damageType:"piercing",
						desc:"damage to the front hero and 60% chance to inflict 1 bleed",
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.60,
								stacks:1
							}
						],
						procCo:1.0,
						effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this,using:this});
							}
					},
					{
						name:"Lunge",
						damage:5*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
						get target(){
							return Party.Characters[0];
						},
						damageType:"piercing",
						desc:"damage to the front hero and 50% chance to inflict 1 bleed",
						procs:[
							{
								name:"bleed",
								type:"debuff",
								procChance:0.50,
								stacks:1
							}
						],
						procCo:1.0,
						effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
					}
				]
				}
				this.AttackPattern=[["Rapier",rand(0,3)],["Rapier",rand(0,3)],["Rapier",rand(0,3)]];
				this.AttackStage=0;
				break;
			case "Mercenary":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				let randHpVal1=rand(15,21);
				this.Stats={
					hp:(randHpVal1*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					maxHp:(randHpVal1*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					armor:0,
					type:"Mercenary",
					name:`mercenary ${GLOBAL.EnemiesCreated}`,
					speed:rand(9,15),
					resistances:{slashing:rand(30,41)/100,blunt:0,piercing:-(rand(10,16)/100),debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Longsword:[
						{
							name:"Slash",
							damage:5*(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult),
							damageType:"slashing",
							desc:"damage to the front hero",
							procs:[],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
						},
						{
							name:"Stab",
							damage:3*(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult),
							damageType:"piercing",
							desc:"damage to the front hero and 50% chance to inflict 1 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.50,
									stacks:1
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this,using:this});
							}
						}
					],
					Shiv:[
						{
							name:"Backstab",
							damage:6*(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult),
							damageType:"piercing",
							desc:"damage to the back hero",
							procs:[],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[Party.Characters.length-1],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[Party.Characters.length-1],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[Party.Characters.length-1]},from:enemy,from:enemy,using:this});
							}
						}
					]
				}
				this.AttackPattern=[["Shiv",0],["Longsword",0],["Longsword",1],["Shiv",0]];
				this.AttackStage=0;
				break;
			default:
				alert(null);
				break;
			case "The Blacksmith":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				this.Stats={
					hp:50*(DOUBLEBASEHP.checked?2:1),
					maxHp:50*(DOUBLEBASEHP.checked?2:1),
					name:`The Blacksmith ${GLOBAL.EnemiesCreated}`,
					armor:0,
					type:"Boss",
					speed:1,
					resistances:{slashing:0,blunt:0,piercing:0,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Physical:[
						{
							name:"The Blacksmith's swipe",
							damage:10,
							damageType:"blunt",
							desc:"Deal 10 blunt damage to all heros and increase The Blacksmiths speed by 4 permanantly",
							procs:[
								{
									name:"speed up",
									type:"bonus",
									desc:"+4 speed",
									procChance:1.0,
									effect(){
										GLOBAL.Combat.enemies.forEach((enemy)=>{
											if(enemy.Stats.type=="Boss"){
												enemy.Stats.speed+=4;
											}
										})
									}
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Party.Characters.forEach((character, index)=>{
									Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[index]},from:enemy,using:this});
								})
							}
						},
					],
					Hammer_Of_The_Blacksmith:[
						{
							name:"The Blacksmith's Slam",
							damage:15,
							damageType:"blunt",
							desc:"Deal 15 blunt damage to the front hero",
							procs:[],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
						},
					]
				}
				this.AttackPattern=[["Physical",0],["Hammer_Of_The_Blacksmith",0]];
				this.AttackStage=0;
				break;
			case "Cultist":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				let randHpVal2=rand(8,10);
				let randSpeedval=rand(5,7);
				this.Stats={
					hp:(randHpVal2*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					maxHp:(randHpVal2*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					name:`Cultist ${GLOBAL.EnemiesCreated}`,
					armor:0,
					type:"Cultist",
					speed:randSpeedval,
					resistances:{slashing:-(rand(5,10)/100),blunt:-(rand(10,15)/100),piercing:-(rand(5,10)/100),debuff:0,magic:(rand(10,20)/100),holy:0.5},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Magic:[
						{
							name:"Healing wave",
							damage:0,
							healing:5,
							damageType:"",
							desc:"Heal each enemy for 5",
							procs:[],
							procCo:1.0,
							effect(){
								GLOBAL.Combat.enemies.forEach((enemy,index)=>{
									heal({from:{type:"enemy"},to:enemy,amount:5,isPercent:false});
								})
							}
						},
						{
							name:"Enhance",
							damage:0,
							healing:0,
							damageType:"",
							desc:"Each enemy has a 25% chance to gain +1 damage to all of their attacks",
							procs:[],
							procCo:1.0,
							effect(){
								GLOBAL.Combat.enemies.forEach((enemy,index)=>{
									if(rand(1,4)===4){
										Object.keys(enemy.Actions).forEach((type)=>{
											enemy.Actions[type].forEach((action)=>{
												action.damage++;
												Console(`${enemy.Stats.name} got +1 damage on ${action.name}`)
											})
										})
									}
								})
							}
						}
					],
				}
				this.AttackPattern=[["Magic",1],["Magic",0]];
				this.AttackStage=0;
				break;
			case "Assassin":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				let randHpVal3=rand(16,21);
				let randSpeedval2=rand(9,15);
				this.Stats={
					hp:(randHpVal3*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					maxHp:(randHpVal3*(DOUBLEBASEHP.checked?2:1))*(GLOBAL.EnemyScaling.amount*Party.level*0.5),
					name:`Assassin ${GLOBAL.EnemiesCreated}`,
					armor:0,
					type:"Assassin",
					speed:randSpeedval2,
					resistances:{slashing:(rand(35,45)/100),blunt:0,piercing:0,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Longsword:[
						{
							name:"Suprise Attack",
							damage:4*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"piercing",
							desc:"damage to the front hero and 75% chance to inflict 2 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.75,
									stacks:2
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
						},
						{
							name:"Twist the knife",
							damage:6*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"piercing",
							desc:"damage to the front hero and 100% chance to inflict 1 bleed, but only if that hero has bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:1.0,
									stacks:1,
									get condition(){
										return GetFrontCharacter().Stats.debuffs.findIndex((debuff)=>debuff.name==="bleed")!==-1;
									}
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								if(GetFrontCharacter().Stats.debuffs.findIndex((debuff)=>debuff.name==="bleed")!==-1){
									Damage({Amount:this.damage,Type:this.damageType,get to(){return GetFrontCharacter()},from:enemy,using:this});
								}
							}
						}
					]
				}
				this.AttackPattern=[["Longsword",0],["Longsword",0],["Longsword",1]];
				this.AttackStage=0;
				break;
			case "Treekin":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				this.Stats={
					hp:(20*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					name:`Treekin ${GLOBAL.EnemiesCreated}`,
					type:"Treekin",
					maxHp:(20*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					armor:3,
					speed:rand(8,15),
					resistances:{slashing:-0.1,blunt:0.5,piercing:0.25,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:["Bleed"],
				};
				this.Actions={
					"Melee":[
						{
							name:"Woodhammer",
							damage:10*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"blunt",
							desc:"damage to the front hero",
							procs:[],
							procCo:1.0,
							effect(){
								try{
								Console(`{Amount:${this.damage},Type:${this.damageType},get to(){return ${JSON.stringify(Party.Characters[0].Stats)}}}`)
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this,using:this});
								}catch(e){Console(e)}
							}
							
						},
						{
							name:"Harden shell",
							damage:0,
							damageType:null,
							desc:"Each Treekin gains 2 armor",
							procs:[
								{
									type:"bonus",
									name:"Armor-up",
									desc:"Gains armor",
									procChance:1.0,
									effect(){
										GLOBAL.Combat.enemies.forEach((enemy)=>{
											if(enemy.Stats.type==="Treekin"){
												enemy.Stats.armor+=2;
											}
										})
									}
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
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
				};
				this.AttackPattern=[[["Melee",0],["Melee",0],["Melee",1]],[["Melee",0],["Melee",1],["Melee",0]]][rand(0,2)];
				this.AttackStage=0;
				break;
			case "Bandit Leader":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				let randHpVal4=rand(50,65);
				this.Stats={
					hp:(randHpVal4*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.6,1),
					maxHp:(randHpVal4*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.6,1),
					name:`bandit leader ${GLOBAL.EnemiesCreated}`,
					armor:0,
					type:"Bandit Leader",
					speed:rand(7,15),
					resistances:{slashing:rand(30,41)/100,blunt:-0.1,piercing:0.1,debuff:0.25,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:[],
				};
				this.Actions={
					Rapier:[
						{
							name:"Jab",
							damage:8*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"piercing",
							desc:"damage to the front hero and 50% chance to inflict 1 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.50,
									stacks:1
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
						},
						{
							name:"Stab",
							damage:10*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"piercing",
							desc:"damage to the front hero and 60% chance to inflict 2 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.60,
									stacks:2
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this});
							}
						},
						{
							name:"Lunge",
							damage:12*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							get target(){
								return Party.Characters[1]?Party.Characters[1]:Party.Characters[0];
							},
							damageType:"piercing",
							desc:"damage to the second hero and 50% chance to inflict 4 bleed",
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.50,
									stacks:4
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]},from:enemy,using:this,using:this});
							}
						}
					],
					Boss:[
						{
							name:"Warcry",
							desc:"All bandits gain +2 speed and +1 armor.",
							procs:[
								{
									type:"bonus",
									name:"Speed & armor up",
									desc:"Gains speed and armor",
									procChance:1.0,
									effect(){
										GLOBAL.Combat.enemies.forEach((enemy)=>{
											if(enemy.Stats.type==="Bandit"){
												enemy.Stats.speed+=2;
													enemy.Stats.armor++;
											}
										})
									}
								}
							],
							procCo:1.0,
							effect(){
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
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
				}
				this.AttackPattern=[["Rapier",0],["Rapier",1],["Rapier",2],["Boss",0]];
				this.AttackStage=0;
				break;
			case "Strix":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				this.Stats={
					hp:(20*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					name:`Strix ${GLOBAL.EnemiesCreated}`,
					type:"Strix",
					maxHp:(20*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					armor:3,
					speed:rand(8,15),
					resistances:{slashing:-0.1,blunt:0.5,piercing:0.25,debuff:0,magic:0,holy:0},
					debuffs:[],
					debuffImmunities:["Bleed"],
				};
				this.Actions={
					"Claw":[
						{
							name:"Scrape",
							damage:10*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"slashing",
							desc:"To all characters",
							procCo:1.0,
							procs:[
								{
									name:"bleed",
									type:"debuff",
									procChance:0.5,
									stacks:4
								}
							],
							procCo:1.0,
							effect(){
								try{
								Console(`{Amount:${this.damage},Type:${this.damageType},get to(){return ${JSON.stringify(Party.Characters[0].Stats)}}}`)
								this.procs.forEach((proc)=>{
									Party.Characters.forEach((character,index)=>{
										if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
											if(proc.type==="debuff"){
												if(proc.condition==undefined){
													ApplyDebuff(proc.name,Party.Characters[index],proc.stacks);
												}else{
													if(proc.condition){
														ApplyDebuff(proc.name,Party.Characters[index],proc.stacks);
													}
												}
											}else if(proc.type==="bonus"){
												proc.effect();
											}
										}
									})
								});
								Party.Characters.forEach((character,index)=>{
									Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[index]},from:enemy,using:this});
								})
								}catch(e){Console(e)}
							}
						},
					],
					"Beak":[
						{
							name:"Gorge",
							damage:rand(11,15)*Math.max(GLOBAL.EnemyScaling.amount*Party.level*GLOBAL.EnemyDamageMult,1),
							damageType:"piercing",
							desc:"To the front character",
							procCo:1.0,
							procs:[],
							procCo:1.0,
							effect(){
								try{
								Console(`{Amount:${this.damage},Type:${this.damageType},get to(){return ${JSON.stringify(Party.Characters[0].Stats)}}}`)
								this.procs.forEach((proc)=>{
									if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
										if(proc.type==="debuff"){
											if(proc.condition==undefined){
												ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
											}else{
												if(proc.condition){
													ApplyDebuff(proc.name,Party.Characters[0],proc.stacks);
												}
											}
										}else if(proc.type==="bonus"){
											proc.effect();
										}
									}
								});
								heal({from:enemy,to:enemy,amount:(findDamage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[index]},from:enemy,using:this})/100)*20,isPercent:true})
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[index]},from:enemy,using:this});
								}catch(e){Console(e)}
							}
						},
					],
					"Sonic":[
						{
							name:"Sickening screech",
							procs:[
								{
									name:"vulnerable",
									type:"debuff",
									procChance:1.0,
									stacks:2
								}
							],
							procCo:1.0,
							effect(){
								try{
								Console(`{Amount:${this.damage},Type:${this.damageType},get to(){return ${JSON.stringify(Party.Characters[0].Stats)}}}`)
								this.procs.forEach((proc)=>{
									Party.Characters.forEach((character,index)=>{
										if(new Chance(proc.procChance*this.procCo,-Party.luck).succeed){
											if(proc.type==="debuff"){
												if(proc.condition==undefined){
													ApplyDebuff(proc.name,Party.Characters[index],proc.stacks);
												}else{
													if(proc.condition){
														ApplyDebuff(proc.name,Party.Characters[index],proc.stacks);
													}
												}
											}else if(proc.type==="bonus"){
												proc.effect();
											}
										}
									})
								});
								Party.Characters.forEach((character,index)=>{
									Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[index]},from:enemy,using:this});
								})
								}catch(e){Console(e)}
							}
						}
					]
				};
				this.AttackPattern=[][rand(0,2)];
				this.AttackStage=0;
				break;
		}
		this.ID=`${GLOBAL.EnemiesCreated}`;
		this.type=PREDEFINED_ENEMY_TYPE;
		GLOBAL.EnemiesCreated++;
		}catch(e){Console(e)}
	}
	get isAlone(){
		return (GLOBAL.Combat.enemies.length===1);
	}
	Attack(){
    try{
        if(this.AttackPattern.length > 1){
            setTimeout(()=>{
                let attackCategory = this.AttackPattern[this.AttackStage][0];
                let attackIndex = this.AttackPattern[this.AttackStage][1];
				Console(`${this.Stats.name} used ${this.Actions[attackCategory][attackIndex].name}`,"COMBATLOG");
                this.Actions[attackCategory][attackIndex].effect();
                this.AttackStage = (this.AttackStage + 1) % this.AttackPattern.length;
                PassTurn();
            }, settings.Other.Attack_interval_delay??500);
        } else {
            Console("no attack");
        }
    }catch(e){
        Console(`Error during attack: ${e}\n(${this.Actions[this.AttackPattern[this.AttackStage][0]][ this.AttackPattern[this.AttackStage][1]]})`);
    }
}

};