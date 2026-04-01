class Enemy{
	constructor(PREDEFINED_ENEMY_TYPE,ENEMY_OBJECT){
		try{
		switch(PREDEFINED_ENEMY_TYPE){
			case "Debuffer":
				Object.defineProperty(this, "value",{
					get(){
						return this;
					},
				})
				this.Stats={
					hp:(15*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					name:`test enemy ${GLOBAL.EnemiesCreated}`,
					maxHp:(15*(DOUBLEBASEHP.checked?2:1))*Math.max(GLOBAL.EnemyScaling.amount*Party.level*0.5,1),
					armor:0,
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
						desc:"damage to the front hero and 50% chance to inflict 1 bleed",
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[Party.Characters.length-1]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
							}
						},
					],
					Hammer_Of_The_Blacksmith:[
						{
							name:"The Blacksmith's ",
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
								Damage({Amount:this.damage,Type:this.damageType,get to(){return Party.Characters[0]}});
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
									Damage({Amount:this.damage,Type:this.damageType,get to(){return GetFrontCharacter()}});
								}
							}
						}
					]
				}
				this.AttackPattern=[["Longsword",0],["Longsword",0],["Longsword",1]];
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







class Chance{
	constructor(percent,adv=1){
		//high rolls are always favored
		//adv is how many times it should roll to get a favorable outcome, if negative rolls for an unfavorable outcome
		//for example, if adv is -3, it will roll 3 times and if any of the rolls don't succeed then the roll fails
		try{
			this.rolls=[];
			for(let i=0;i<((adv===0)?1:Math.abs(adv));i++){
				let val=rand(0,10001)/10000;
				this.rolls.push({roll:val,pass:(val>=percent)});
			}
			Console(`rolls for chance ${JSON.stringify(this.rolls)}>=${percent}`,"Rolls")
			this.succeed=true;
			this.adv=adv;
			if(adv!==0){
				for(const roll of this.rolls){
					if(adv>0){
						if(roll.pass){
							this.succeed=true;
							break;
						}else{
							this.succeed=false;
						}
					}else if(adv<0){
						if(roll.pass){
							this.succeed=true;
						}else{
							this.succeed=false;
							break;
						}
					}
				}
			}else{
				if(this.rolls[0].pass){
					this.succeed=true;
				}else{
					this.succeed=false;
				}
			}
		}catch(e){
			Console(e);
		}
	}
	targetRolls(){
		try{
		let out=this.rolls[0].roll;
		for(const roll of this.rolls){
			if(this.adv>=0){
				if(roll.roll>out){
					out=roll.roll;
				}
			}else if(this.adv<0){
				if(roll.roll<out){
					out=roll.roll;
				}
			}
		}
		return out;
		}catch(e){Console(e)}
	}
};

class Enchantment{
	constructor(random/*bool*/,name){
		if(random){
			this.enchant=Enchantments[rand(0,Enchantments.length)];
		}
	}
}
class Book{
	constructor(randEnchants, EnchantsObjects){
		if(randEnchants){
			this.Enchants=[];
			let hasFailed=false;
			books++;
			for(let maxEnchants=Party.level;maxEnchants>0&&!hasFailed;maxEnchants--){
				if(new Chance(1-(0.5**(this.Enchants.length)),Party.luck).succeed){
					Console(`adding enchant to book ${books}`);
					this.Enchants.push(new Enchantment(true).enchant);
				}else{
					hasFailed=true;
				}
			}
		}
	}
}




Console("Turn based game/Scripts/classes.js loaded");
