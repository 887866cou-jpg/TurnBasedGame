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
		if(!this.alertVals.achievements&&!this.alertVals.inventory){
			PAUSEBUTTON.innerHTML=`&#129908;&#129904`;
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
		"89. Tic-Toc I: Spend 1 minute total playing",//60
		"90. Tic-Toc II: Spend 15 minutes total playing",//900
		"91. Tic-Toc III: Spend 30 minutes total playing",//1800
		"92. Tic-Toc IV: Spend 1 hour total playing",//3600
		"93. Tic-Toc V: Spend 5 hours total playing",//18000
		"94. Tic-Toc VI: Spend 10 hours total playing",//36000
		"95. Tic-Toc VII: Spend 1 day total playing",//86400
		"96. Tic-Toc VIII: Spend 2 days total playing",//172800
		"97. Tic-Toc IX: Spend 4 days total playing",//345600
		"98. Tic-Toc X: Spend 1 week total playing",//604800
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
					useArmor: false,
					from:{
						Stats:{
							name:"bleed"
						}
					}
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
					from:{
						Stats:{
							name:"poison"
						}
					}
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
							Console(`${to.Stats.name} is stunned (turn skipped)`,"COMBATLOG")
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
					from:{
						Stats:{
							name:"burn"
						}
					}
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
		totalTurns:0,
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
					bosses:[
						{
							card:["Bandit","Bandit Leader","Bandit"],
							description:"As you walk to a clearing in front of you, you see a pair of bandits standing around a large tent in the center of the clearing.<br>A few well made fires sit around the camp, the pops and crackles of the fires soothing your mind as you decide what to do..."
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
				},
				//Zone 2
				{
					name:"The Withering Planes",
					desc:"As you walk out of the forest, you come to find yourself in a place only spoken of to scare little children from going out too far into bad land;<br>But those stories aren't entirely made up, as you can clearly tell from what is in front of you:<br>A vast green sea of thick tall deep green grass, with hardly a tree in sight.<br>In the few patches around you with no grass, you can see that the soil is an unnatural black color with roots, covering almost half of the dirt that you can see; Wrapping around it, as if trying to choke whatever life is left out of it,<br>and as grey as the smoldering ashes of your childhood home...<br><b>Welcome To: The Withering Planes.<b>",
					cards:[
						{
							easy:[
								["Strix","Strix","Strix"]//encounters
							],
							hard:[
								["Strix","Strix","Strix","Strix"]
							]
						},
					],
					bosses:[
						{
							card:[],
							description:""
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
			Console("<hr> New combat","COMBATLOG");
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
				}
				TriggerStartOfBattleEffects();
				Party.Characters.forEach((character)=>{
					character.Stats.gainXp(this.fights*Math.max((this.enemies.length-1),1));
				})
				Party.gainXp(this.fights*Math.max((this.enemies.length-1),1));
			}catch(e){Console(e+error)}
		},
		EndCombat(){
			this.enemies=[];
			this.turn=0;
			this.round=0;
			this.totalTurns=0;
			this.inCombat=false;
			FIGHTDIALOG.close();
			GLOBAL.Combat.round=0;
			GLOBAL.Combat.turn=0;
			checkToStartBoss();
			LOG.innerHTML="";
			combatLogOutput=[];
			Party.Characters.forEach((character)=>{
				character.Stats.debuffs=[];
				character.Stats.buffs=[];
			});
			Party.money.gain("copper",GLOBAL.Combat.fights);
			Party.money.gain("silver",rand(0,GLOBAL.Combat.fights));
			Party.money.gain("gold",Math.floor(GLOBAL.Combat.fights/10));
			UpdateMoney();
			if(GLOBAL.mapNode[0]===0&&new Chance(0.25,Party.luck,"enchanted book").succeed){
				Console(`You got a new book!`)
				giveRandomBook();
			}
			let chanceValue=rand(0,100);
			if(Party.Characters.findIndex((character)=>character.name==="Glum Farfield")===-1&&GLOBAL.Combat.fights>=3){
				MakeEvent(1);
			}else{
				if(chanceValue<50){
					let ArmorOrWeapons=rand(1,10);
					//make it random equipment when I figure that out
					MakeEquipChoice(rand(2,4));
					EQUIPDIALOG.show();
				}else if(chanceValue>=50){
					let eventVal=rand(0,Events[GLOBAL.mapNode[0]].length)
					Console(`event value: ${eventVal}`);
					if(Events[GLOBAL.mapNode[0]][eventVal]){
						MakeEvent(eventVal);
					}else{
						MakeEvent(0)
					}
				}
			}
		}
	}
}