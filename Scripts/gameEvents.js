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
						let Combat=["Treekin","Treekin"];
						for(let i=1;i<Party.level;i++){
							Combat.push("Treekin");
						}
						GLOBAL.Combat.StartCombat(true,Combat);
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
						MakeSubEvent(6);
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
		text:`In the cold shower of nature, you take a humble gravel path thats soaked with the essence of natures tears,<br> alies a peaceful beach that is gleeming with a gloomy tranquility.<br>You take in it's refreshing air remensecing this moment. <br><br> You see an approaching figure in the mist of the foggy ocean, having zero clue whether it's a threat.<br><br>What do you do?`,
		options:[
			{
				text:"Call out to the figure.",
				condition(){
					return true;
				},
				effect(){
					if(new Chance(0.5).succeed){
						MakeSubEvent(6);
					}else{
						MakeSubEvent(7);
					}
					if(!GLOBAL.usingSeed){
						Events[0]=Events[0].filter((event)=>event.name!=="Rainy Shore");
					}
				}
			},
			{
				text:"Force him to accept payment",
				condition(){
					return true;
				},
				effect(){
					
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
	{
		name:"Cryptic Message",
		text:`Placeholder text`,
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
		name:"Disbursement",
		text:`The figure seems to fade away into the fog, leaving you in a slight sense of unease...`,
		options:[
			{
				text:"Ok",
				condition(){
					return true;
				},
				effect(){}
			},
		]
	},//current ending index of the subevent list is 7
];