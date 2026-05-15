function UpdateStats(){
	STATS.innerHTML="";
	Object.keys(stats).forEach((stat)=>{
		const NEWSTAT=DOC.createElement("li");
		NEWSTAT.innerHTML=`${stat}: ${stats[stat]}`;
		STATS.appendChild(NEWSTAT)
	});
	STATSDIALOG.show();
}
function updateInventory(){
	try{
	INVENTORY.innerHTML="";
	Party.inventory.forEach((item,index)=>{
		if(item.type=="enchantedBook"){
			const NEWBOX=DOC.createElement("fieldset");
			const NEWINVENTORYDISPLAY=DOC.createElement("li");
			function getValidItems(){
				let output=[];
					let includesWeapons=false;
				item.value.Enchants.forEach((enchant)=>{
					if(enchant.equipment.includes("Weapons")){
						includesWeapons=true;
					}
			})
				if(includesWeapons){
					Party.Characters.forEach((character)=>{
						if(character.Equipment.Weapons.enchants<GLOBAL.maxEnchants){
							output.push({
								get EquipTo(){
									return character
								},
								get Item(){
									return index
								}
								});
						}
					})
				}
				return output
			}
			
			const NEWITEM=DOC.createElement("li");
			function getnames(){
				let output=[];
				JSON.parse(item.desc).Enchants.forEach((enchant)=>{
					output.push(enchant.name);
				})
				return output.join(",");
			}
			NEWINVENTORYDISPLAY.innerHTML=`${item.type}: ${getnames()} <br>Valid Targets:`;
			NEWBOX.appendChild(NEWINVENTORYDISPLAY);
			getValidItems().forEach((validItem)=>{
				const NEWITEMTARGETBUTTON=DOC.createElement("button");
				NEWITEMTARGETBUTTON.innerHTML=`${validItem.EquipTo.Stats.name}'s ${validItem.EquipTo.Equipment.Weapons.name} (${validItem.EquipTo.Equipment.Weapons.enchants}/${GLOBAL.maxEnchants})`;
					NEWITEMTARGETBUTTON.addEventListener("click",()=>{
					item.value.Enchants.forEach((enchant)=>{
						enchant.effect(validItem.EquipTo);
						validItem.EquipTo.Equipment.Weapons.enchants++;
						if(validItem.EquipTo.Equipment.Weapons.enchants>=1){
							addAchievement(56);
							if(validItem.EquipTo.Equipment.Weapons.enchants>=2){
								addAchievement(57);
								if(validItem.EquipTo.Equipment.Weapons.enchants>=3){
									addAchievement(58);
									if(validItem.EquipTo.Equipment.Weapons.enchants>=4){
										addAchievement(59);
										if(validItem.EquipTo.Equipment.Weapons.enchants===5){
											addAchievement(60);
										}
									}
								}
							}
						}
						Party.inventory=Party.inventory.filter((_,index)=>index!==validItem.Item);
						updateInventory();
						UpdateCharacterDisplay(Party.Characters.findIndex((character)=>character===validItem.EquipTo))
					})
				})
				NEWBOX.appendChild(NEWITEMTARGETBUTTON)
			})
			INVENTORY.appendChild(NEWBOX);
			INVENTORY.appendChild(NEWITEM);
		}
	})
	Party.inventory.forEach((item,index)=>{
		if(item.type=="consumable"){
			let NEWBOX=DOC.createElement("fieldset");
			let NEWCONSUMABLE=DOC.createElement("li");
			NEWCONSUMABLE.innerHTML=`${item.name} x${item.amount}`;
			item.options.forEach((option)=>{
				let NEWOPTION=DOC.createElement("button");
				NEWBOX.appendChild(NEWOPTION);
				NEWOPTION.innerHTML=`${option.name}: ${option.desc} (${item.uses?`${item.uses} uses remaining`:""})`;
				NEWOPTION.addEventListener("click",()=>{
					item.uses--;
					Party.inventory.forEach((item1,index)=>{
						if(item1.uses<=0){
							if(item1.amount>1){
								Party.inventory[index].uses=item1.maxUses;
								Party.inventory[index].amount--;
							}else{
								Party.inventory.splice(index,1);
							}
						}
					})
					Party.inventory=Party.inventory.filter((item)=>item.uses>0);
					updateInventory();
					if(option.effect){
						option.effect();
					}
				})
				if(typeof option.condition=="boolean"){
					if(option.condition){
						NEWOPTION.disabled=false;
					}else{
						NEWOPTION.disabled=true;
					}
				}
			})
			INVENTORY.appendChild(NEWCONSUMABLE);
			INVENTORY.appendChild(NEWBOX);
		}
	})
	Party.inventory.forEach((item,index)=>{
		if(item.type=="material"){
			let NEWINVENTORYITEM=DOC.createElement("li");
			NEWINVENTORYITEM.innerHTML=`${item.name}: ${item.desc} (x${item.amount})`;
			INVENTORY.appendChild(NEWINVENTORYITEM);
		}
	})
	}catch(e){Console(e,"ERROR")}
}

function UpdateBossScreen(){
	
}
function UpdateStatDisplay(index){
	error=" statdisplay"
	Array.from(CHARACTERSTATS).forEach((element)=>{
		element.innerHTML="";
	});
	let stats=[];
	if(Party.Characters[index]){
		error+="armor"
		//PrintToConsole(JSON.stringify(Party.Characters[index].Equipment.Armor.Head))
		if(Object.keys(Party.Characters[index].Equipment.Armor.Head).length){
			stats.push(`Armor->Head: ${Party.Characters[index].Equipment.Armor.Head.modifier.name} ${Party.Characters[index].Equipment.Armor.Head.name} (+${Party.Characters[index].Equipment.Armor.Head.armor} armor)`);
		}
		if(Object.keys(Party.Characters[index].Equipment.Armor.Body).length){
			stats.push(`Armor->Body: ${Party.Characters[index].Equipment.Armor.Body.modifier.name} ${Party.Characters[index].Equipment.Armor.Body.name} (+${Party.Characters[index].Equipment.Armor.Body.armor} armor)`);
		}
		if(Object.keys(Party.Characters[index].Equipment.Armor.Legs).length){
			stats.push(`Armor->Legs: ${Party.Characters[index].Equipment.Armor.Legs.modifier.name} ${Party.Characters[index].Equipment.Armor.Legs.name} (+${Party.Characters[index].Equipment.Armor.Legs.armor} armor)`);
		}
		if(Object.keys(Party.Characters[index].Equipment.Armor.Feet).length){
			stats.push(`Armor->Feet: ${Party.Characters[index].Equipment.Armor.Feet.modifier.name} ${Party.Characters[index].Equipment.Armor.Feet.name} (+${Party.Characters[index].Equipment.Armor.Feet.armor} armor)`);
		}
		error+="hands"
		if(Object.keys(Party.Characters[index].Equipment.Armor.Hands).length){
			stats.push(`Armor->Hands: ${Party.Characters[index].Equipment.Armor.Hands.modifier.name} ${Party.Characters[index].Equipment.Armor.Hands.name} (+${Party.Characters[index].Equipment.Armor.Hands.armor} armor)`);
		}
		error+=" after armor"
		for(const key in Party.Characters[index].Stats){
			if((Party.Characters[index].Stats[key]!==0&&typeof Party.Characters[index].Stats[key]!=="function")||key==="stamina"){
				if(!Array.isArray(Party.Characters[index].Stats[key])){
					if(typeof Party.Characters[index].Stats[key]!=="number"){
							stats.push(`<p id="${key}">${key}: ${JSON.stringify(Party.Characters[index].Stats[key])}</p>`);
					}else{
						if(key==="armor"){
							if(Party.Characters[index].Stats[key]-1>0){
								stats.push(`<p id="${key}">${key}: ${Party.Characters[index].Stats[key].toFixed(0)} (${(calculateDamageReduction(Party.Characters[index].Stats[key])*100).toFixed(3)}% damage reduction)</p>`);
							}
						}else if(key==="hp"){
							stats.push(`<label for="hp_meter">Hp:${Math.round(Party.Characters[index].Stats.hp)}/${Party.Characters[index].Stats.maxHp}<meter id="hp_meter" value="${Party.Characters[index].Stats.hp}" max="${Party.Characters[index].Stats.maxHp}"></label><br>`);
						}else if(key==="xp"){
							stats.push(`<label for="xp_meter">Xp:${Party.Characters[index].Stats.xp}/${Party.Characters[index].Stats.maxXp}<meter id="xp_meter" value="${Party.Characters[index].Stats.xp}" max="${Party.Characters[index].Stats.maxXp}"></label>`);
						}else if(key==="stamina"){
							stats.push(`<label for="stamina_meter">Stamina:${Party.Characters[index].Stats.stamina}/${Party.Characters[index].Stats.maxStamina}<meter id="stamina_meter" value="${Party.Characters[index].Stats.stamina}" max="${Party.Characters[index].Stats.maxStamina}"></label>`);
						}else if(key.includes("max")){}else{
							stats.push(`<p id="${key}">${key}: ${Party.Characters[index].Stats[key].toFixed(2)}</p>`);
						}
					}
				}else if(key==="debuffs"&&Party.Characters[index].Stats.debuffs.length>0){
					let debuffs=[];
					error+=" debuffs";
					//PrintToConsole(JSON.stringify(Party.Characters[index].Stats.debuffs))
					Party.Characters[index].Stats.debuffs.forEach((Debuff)=>{
						debuffs.push(`${Debuff.stacks}${getDebuffSymbol(Debuff.name)}`);
					})
					error+=" after debuffs"
					stats.push(`<p id="${key}">${key}: ${debuffs.join(",")}</p><br>`);
				}else if(key==="buffs"&&Party.Characters[index].Stats.buffs.length>0){
					let buffs=[];
					//PrintToConsole(JSON.stringify(Party.Characters[index].Stats.debuffs))
					Party.Characters[index].Stats.buffs.forEach((buff)=>{
						buffs.push(`${buff.stacks}${getbuffSymbol(buff.name)}`);
					})
					stats.push(`<p id="${key}">${key}: ${buffs.join(",")}</p><br>`);
				}
			}
		}
		stats.sort((a,b)=>{
			if(a.includes("stamina")||a.includes("Stamina")){
				return -10;
			}
		})
	stats.push(`<i>(Stats with value 0 are omitted)</i>`);
	Array.from(CHARACTERSTATS)[index].innerHTML=`${stats.join("\n")}`;
		Array.from(DOC.getElementsByClassName("popuptarget")).forEach((element)=>{
			element.addEventListener("mouseenter",()=>{
				Array.from(element.children)[0].style.display="block";
			});
			element.addEventListener("mouseleave",()=>{
				Array.from(element.children)[0].style.display="none";
			});
		})
	}
}


// Example usage:
function UpdateEnemyStatDisplay(index){
	error=" enemy stat display"
	try{
	Array.from(ENEMYSTATS).forEach((element)=>{
		element.innerHTML="";
	});
	if(GLOBAL.Combat.enemies[index]){
		let stats=[];
		for(const key in GLOBAL.Combat.enemies[index].Stats){
			if(key!=="debuffs"&&key!=="lootTable"){
				if(typeof GLOBAL.Combat.enemies[index].Stats[key]!=="number"){
					stats.push(`${key}: ${JSON.stringify(GLOBAL.Combat.enemies[index].Stats[key])}`);
				}else{
					stats.push(`${key}: ${GLOBAL.Combat.enemies[index].Stats[key].toFixed(2)}`);
				}
			}else if(key==="debuffs"){
				let debuffs=[];
				GLOBAL.Combat.enemies[index].Stats.debuffs.forEach((Debuff)=>{
					debuffs.push(`${Debuff.stacks}${getDebuffSymbol(Debuff.name)}`);
				})
				stats.push(`${key}: ${debuffs.join(",")}`);
			}
		}
		stats.push(`This enemy intends to:${GLOBAL.Combat.enemies[index].Actions[GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][0]][GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][1]].damage?`Deal ${GLOBAL.Combat.enemies[index].Actions[GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][0]][GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][1]].damage}${GLOBAL.Combat.enemies[index].Actions[GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][0]][GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][1]].damageType}`:``} ${JSON.stringify(GLOBAL.Combat.enemies[index].Actions[GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][0]][GLOBAL.Combat.enemies[index].AttackPattern[GLOBAL.Combat.enemies[index].AttackStage][1]].desc)}`)
		Array.from(ENEMYSTATS)[index].innerHTML=`<p>${stats.join(`</p>\n<p>`)}</p>`;
	}
	}catch(e){Console(e+error,"ERROR")}
}
function UpdateEnemyDisplay(){
	error=" enemydisplay";
	try{
	ENEMYSELECT.innerHTML="";
	if(GLOBAL.Combat.enemies.length>0){
		GLOBAL.Combat.enemies.forEach((enemy,index)=>{
			UpdateEnemyStatDisplay(index);
			const ENEMYBUTTON=document.createElement("button");
			GLOBAL.Combat.enemies[index].Stats.target=false;
			if(index==0){
				ENEMYBUTTON.classList.add("target");
				GLOBAL.Combat.enemies[0].Stats.target=true;
			}
			ENEMYBUTTON.classList.add("enemy_button");
			ENEMYBUTTON.addEventListener("mouseover",()=>{
				UpdateEnemyStatDisplay(index);
			})
			ENEMYBUTTON.addEventListener("click",()=>{
				Array.from(document.getElementsByClassName("enemy_button")).forEach((button,index1)=>{
					button.classList.remove("target");
					GLOBAL.Combat.enemies[index1].Stats.target=false;
				})
				ENEMYBUTTON.classList.add("target");
				GLOBAL.Combat.enemies[index].Stats.target=true;
			})
			ENEMYBUTTON.innerHTML=`${enemy.type} ${enemy.ID}`;
			ENEMYSELECT.appendChild(ENEMYBUTTON);
		});
	}else{
		GLOBAL.Combat.EndCombat();
	}
	}catch(e){Console(e+error,"ERROR")}
}
function UpdateAll(ENEMYORPLAYER){
	if(ENEMYORPLAYER===1||!ENEMYORPLAYER){
		Party.Characters.forEach((character,index)=>{
			UpdateCharacterDisplay(index);
			UpdateStatDisplay(index)
		})
	}
	if(ENEMYORPLAYER===0||!ENEMYORPLAYER){
		GLOBAL.Combat.enemies.forEach((enemy,index)=>{
			UpdateEnemyStatDisplay(index);
		});
		UpdateEnemyDisplay();
	}
}
function UpdateCharacterDisplay(index){
	UpdateStatDisplay(index);
	error="characterdisplay"
	Array.from(CHARACTERABILITIES).forEach((element)=>{
		element.innerHTML="";
	});
	if(Party.Characters[index]){
		for(const key in Party.Characters[index].Actions){
			for(const element of Party.Characters[index].Actions[key]){
				const CHARACTERABILITYBUTTON=DOC.createElement("button");
				CHARACTERABILITYBUTTON.classList.add("character_ability");
				if(Party.Characters[index].Equipment.Weapons.modifier){
					CHARACTERABILITYBUTTON.innerHTML=`${Party.Characters[index].Equipment.Weapons.name===key?`${Party.Characters[index].Equipment.Weapons.modifier.name} `:""}${key}->${element.name} (${element.cost} stamina): ${element.damage&&element.damage>0?`Deals ${element.damage} ${element.damageType} damage`:element.healing&&element.healing>0?`Heals ${Math.round(element.healing)}`:""} ${element.desc}`;
					if(element.procs){
						if(element.procs.length>0){
							let procDesc=[];
							element.procs.forEach((proc)=>{
								if(proc.type==="debuff"){
									function getOdds(){
										if(Party.luck>-2&&Party.luck<2){
											return Math.min(element.procCo*proc.procChance,1);
										}else{
											if(Party.luck<-1){
												return Math.min((element.procCo*proc.procChance)**Math.abs(Party.luck),1);
											}else if(Party.luck>1){
												return Math.min(1-((element.procCo*proc.procChance)**Math.abs(Party.luck)),1);
											}
										}
									}
									procDesc.push(`and${proc.desc?` ${proc.desc}`:``} ${(getOdds()*100).toFixed(2)}% chance to inflict ${proc.stacks} ${proc.name}`);
								}else if(proc.type==="bonus"){
									if(proc.desc){
										procDesc.push(`and ${proc.desc}`);
									}
								}
							})
							CHARACTERABILITYBUTTON.innerHTML+=` ${procDesc.join(", ")}`;
						}
					}
				}else{
					if(element.healing){
						CHARACTERABILITYBUTTON.innerHTML=`${key}->${element.name} (${element.cost} stamina): ${element.desc} ${Math.round(element.healing)}`;
					}else{
						CHARACTERABILITYBUTTON.innerHTML=`${key}->${element.name} (${element.cost} stamina): ${element.damage?`Deals ${element.damage} ${element.damageType} damage`:""} ${element.desc}`;
					}
				}
				CHARACTERABILITYBUTTON.checkAbility=function(){
					if(Party.Characters[index].Stats.stamina-element.cost<0||
					   (key==="Magic"&&Party.Characters[index].Stats.debuffs.findIndex((debuff)=>debuff.name==="silence")!==-1)||
					   (Party.Characters[index].Equipment.Weapons.name===key&&Party.Characters[index].Stats.debuffs.findIndex((debuff)=>debuff.name==="disarm")!==-1)
					  ){
						CHARACTERABILITYBUTTON.disabled=true;
					}
				}
				CHARACTERABILITYBUTTON.addEventListener("mouseover",()=>{
					if(element.target!==undefined){
						CHARACTERABILITYBUTTON.checkAbility();
						if(typeof element.target==="number"){
							Array.from(DOC.getElementsByClassName("enemy_button"))[element.target].click();
						}else if(Array.isArray(element.target)){
							if(!element.target.includes(GLOBAL.Combat.enemies.findIndex((enemy)=>enemy.Stats.target))){
								Array.from(DOC.getElementsByClassName("enemy_button"))[element.target[0]].click();
							}
						}
					}
				})
				CHARACTERABILITYBUTTON.addEventListener("click",()=>{
					if(Party.Characters[index].Stats.stamina<=0-element.cost>=0){
						Party.Characters[index].Stats.stamina-=element.cost;
						actionsTaken++;
						UpdateLocalStorage("actionsTaken");
						if(actionsTaken>=100){
							addAchievement(45);
							if(actionsTaken>=200){
								addAchievement(46);
								if(actionsTaken>=400){
									addAchievement(47);
									if(actionsTaken>=800){
										addAchievement(48);
										if(actionsTaken>=1600){
											addAchievement(49);
											if(actionsTaken>=3200){
												addAchievement(50);
												if(actionsTaken>=6400){
													addAchievement(51);
													if(actionsTaken>=12800){
														addAchievement(52);
														if(actionsTaken>=25600){
															addAchievement(53);
															if(actionsTaken>=51200){
																addAchievement(54);
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
						element.effect();
						UpdateStatDisplay(index);
						if(AUTOPASS.checked){
							if(Party.Characters[index].Stats.stamina<=0){
								PassTurn();
								Console("Auto-Passed turn","AUTOPASSER");
							}
						}
					}
					Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
						ability.checkAbility();
					});
				});
				CHARACTERABILITIES[index].appendChild(CHARACTERABILITYBUTTON);
				CHARACTERABILITYBUTTON.checkAbility();
			}
			
		}
	}
}
function UpdateLocalStorage(key){
	if(window[key]){
		localStorage.setItem(key,JSON.stringify(window[key]))
		Console(`localStorage[${key}] updated to ${JSON.stringify(window[key])}`)
	}else{
		Console(`window does not contain ${key} (${window[key]})`)
	}
}