function rand(min, max){
    /*random number function*/
    return Math.floor(Math.random() * (Math.max(max,min) - Math.min(min,max))) + Math.min(min,max);
}
Array.prototype.average=function (){
	const initialValue = 0;
	return (this.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue)/this.length);
}
function TriggerDebuffs(STARTOREND) {
	error="debufftrigger";
	try{
		//Console(`Turn ${JSON.stringify(GetTurnOrder()[GLOBAL.Combat.turn])}`)
	if(GetTurnOrder()[GLOBAL.Combat.turn]){
		error+=1;
		GetTurnOrder()[GLOBAL.Combat.turn].Stats.debuffs.forEach((debuff)=>{
			error+=1;
			if(debuff.triggerTime==STARTOREND){
				if(debuff.effect){
					debuff.effect();
				}
				Console(`${debuff.name} triggered on ${debuff.target.Stats.name}`, "TRIGGERDEBUFFS");
			}
		})
		error+=1;
		GetTurnOrder()[GLOBAL.Combat.turn].Stats.debuffs.filter((debuff)=>debuff.stacks<=0).forEach((debuff)=>{
			if(debuff.OnRemoval){
				debuff.OnRemoval();
			}
		})
		GetTurnOrder()[GLOBAL.Combat.turn].Stats.debuffs=GetTurnOrder()[GLOBAL.Combat.turn].Stats.debuffs.filter((debuff)=>debuff.stacks>0);
	}
	}catch(e){Console(e+error)}
}
function TriggerBuffs(STARTOREND) {
	error="bufftrigger";
	try{
		//Console(`Turn ${JSON.stringify(GetTurnOrder()[GLOBAL.Combat.turn])}`)
	if(GetTurnOrder()[GLOBAL.Combat.turn]){
		if(GetTurnOrder()[GLOBAL.Combat.turn].Stats.buffs){
			error+=1;
			GetTurnOrder()[GLOBAL.Combat.turn].Stats.buffs.forEach((buff)=>{
				error+=1;
				if(buff.triggerTime==STARTOREND){
					if(buff.effect){
						buff.effect();
					}
					Console(`${buff.name} triggered on ${buff.target.Stats.name}`, "TRIGGERDEBUFFS");
				}
			})
			error+=1;
			GetTurnOrder()[GLOBAL.Combat.turn].Stats.buffs.filter((buff)=>buff.stacks<=0).forEach((buff)=>{
				if(buff.OnRemoval){
					buff.OnRemoval();
				}
			})
			GetTurnOrder()[GLOBAL.Combat.turn].Stats.buffs=GetTurnOrder()[GLOBAL.Combat.turn].Stats.buffs.filter((buff)=>buff.stacks>0);
		}
	}
	}catch(e){Console(e+error)}
}
function ApplyDebuff(DEBUFFNAME,TO,STACK,CHANCE){
	error="applydebuff"
	try{
	if(CHANCE){
		//CHANCE will be a Chance object
		
	}else{
		error+=1;
		Console(`applying ${STACK} ${DEBUFFNAME} to ${TO.Stats.name}`,"COMBATLOG")
		error+=1;
		if(TO.Stats.debuffImmunities.includes(DEBUFFNAME)){
			Console(`${TO.Stats.name} has an immunity to ${DEBUFFNAME}, ${DEBUFFNAME} not applied`, "DEBUFF.IMMUNITY");
		}else{
			GLOBAL.debuffs[DEBUFFNAME].assign(TO,STACK)
			if(!Party.Characters.includes(TO)){
				debuffsApplied+=STACK;
				UpdateLocalStorage("debuffsApplied");
			}
		}
		UpdateEnemyDisplay();
	}
	}catch(e){PrintToConsole(`${e} (${error}, values: ${JSON.stringify(arguments)})`)}
}
function ApplyBuff(BUFFNAME,TO,STACK,CHANCE){
	error="applybuff"
	try{
	if(CHANCE){
		//CHANCE will be a Chance object
		
	}else{
		error+=1;
		Console(`applying ${STACK} ${BUFFNAME} to ${TO.Stats.name}`)
		error+=1;
		GLOBAL.buffs[BUFFNAME].assign(TO,STACK)
		UpdateEnemyDisplay();
	}
	}catch(e){PrintToConsole(`${e} (${error}, values: ${JSON.stringify(arguments)})`)}
}
function findDamage(damageObject){
	//PrintToConsole(JSON.stringify(damageObject.to));
	/*Damage object format
		{
			Amount: the amount of damage you want to be dealt
			to: the object to deal the damage to
			Type: the type of damage being dealt
			crit: the chance that the damage will crit.
			useArmor: a bool telling the game whether or not to use armor to calulate damage
			from: the object dealing the damage
			using: the action used to deal the damage.
		}
	*/
	let NumberOfEnemies=GetTurnOrder().length;
	error="finddamage";
	function DamageWithArmor(){
		let armorIsDefined=false;
		if(damageObject.useArmor){
			armorIsDefined=true;
		}
		if((!armorIsDefined||damageObject.useArmor)){
			return (damageObject.Amount-damageObject.Amount*calculateDamageReduction(damageObject.to.Stats.armor));
		}else if(!damageObject.useArmor){
			return damageObject.Amount;
		}
		
	}
	//this line is causing an error
	let damageAmount=0;
	if(damageObject.crit!==undefined){
		if(new Chance(damageObject.crit,1,"Crit").succeed){
			//Console(`${damageObject.from?`${damageObject.from.Stats.name} `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} dealt ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)*2} (CRIT!) ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG");
			damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)*2
		}else{
			//Console(`${damageObject.from?`${damageObject.from.Stats.name} used `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} dealt ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)} ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG")
			damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0);
		}
	}else{
		//Console(`${damageObject.from?`${damageObject.from.Stats.name} `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)} ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG")
		damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)
	}
	return damageAmount;
}
function Damage(damageObject){
	//PrintToConsole(JSON.stringify(damageObject.to));
	try{
	/*Damage object format
		{
			Amount: the amount of damage you want to be dealt
			to: the object to deal the damage to
			Type: the type of damage being dealt
			crit: the chance that the damage will crit.
			useArmor: a bool telling the game whether or not to use armor to calulate damage
			from: the object dealing the damage
			using: the action used to deal the damage.
		}
	*/
	let NumberOfEnemies=GetTurnOrder().length;
	error="damage";
	function DamageWithArmor(){
		let armorIsDefined=false;
		if(damageObject.useArmor){
			armorIsDefined=true;
		}
		if((!armorIsDefined||damageObject.useArmor)){
			return (damageObject.Amount-damageObject.Amount*calculateDamageReduction(damageObject.to.Stats.armor));
		}else if(!damageObject.useArmor){
			return damageObject.Amount;
		}
		
	}
	//this line is causing an error
	let damageAmount=0;
	if(damageObject.crit!==undefined){
		if(new Chance(damageObject.crit,1,"Crit").succeed){
			addAchievement(55);
			Console(`${damageObject.from?`${damageObject.from.Stats.name} `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} dealt ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)*2} (CRIT!) ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG");
			damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)*2
			damageObject.to.Stats.hp-=damageAmount;
		}else{
			Console(`${damageObject.from?`${damageObject.from.Stats.name} used `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} dealt ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)} ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG")
			damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0);
			damageObject.to.Stats.hp-=damageAmount;
		}
	}else{
		Console(`${damageObject.from?`${damageObject.from.Stats.name} `:``}${damageObject.using?`used ${damageObject.using.name} dealing`:` dealt`} ${Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)} ${damageObject.Type} damage, to ${damageObject.to.Stats.name}`,"COMBATLOG")
		damageAmount=Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)
		damageObject.to.Stats.hp-=damageAmount;
	}
	if(GLOBAL.Combat.enemies.includes(damageObject.to)){
		if(Math.max(DamageWithArmor()-DamageWithArmor()*(damageObject.to.Stats.resistances[damageObject.Type]??0),0)>=damageObject.to.Stats.maxHp){
			addAchievement(2);
		}
		if(damageObject.Type!=="debuff"){
			damageDealt+=damageAmount;
			if(damageDealt>=100){
				addAchievement(61);
				if(damageDealt>=250){
					addAchievement(62);
					if(damageDealt>=500){
						addAchievement(63);
						if(damageDealt>=1000){
							addAchievement(64);
							if(damageDealt>=2500){
								addAchievement(65);
								if(damageDealt>=5000){
									addAchievement(66);
									if(damageDealt>=10000){
										addAchievement(67);
										if(damageDealt>=25000){
											addAchievement(68);
											if(damageDealt>=50000){
												addAchievement(69);
												if(damageDealt>=100000){
													addAchievement(70);
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
			UpdateLocalStorage("damageDealt");
		}
		GLOBAL.Combat.enemies=GLOBAL.Combat.enemies.filter((enemy)=> enemy.Stats.hp>0);
		UpdateEnemyDisplay();
		if(GLOBAL.Combat.enemies.findIndex((enemy)=> enemy==damageObject.to)>=0){
			UpdateEnemyStatDisplay(GLOBAL.Combat.enemies.findIndex((enemy)=> enemy==damageObject.to));
		}
		
	}else if(Party.Characters.includes(damageObject.to)){
		UpdateStatDisplay(Party.Characters.findIndex((character)=> character==damageObject.to));
		Console(`damage dealt ${damageAmount}`)
		damageTaken+=damageAmount;
		if(damageTaken>=100){
			addAchievement(71);
			if(damageTaken>=250){
				addAchievement(72);
				if(damageTaken>=500){
					addAchievement(73);
					if(damageTaken>=1000){
						addAchievement(74);
						if(damageTaken>=2500){
							addAchievement(75);
							if(damageTaken>=5000){
								addAchievement(76);
								if(damageTaken>=10000){
									addAchievement(77);
								}
							}
						}
					}
				}
			}
		}
		UpdateLocalStorage("damageTaken");
		damageObject.to.Boons.forEach((boon)=>{
			if(boon.types.includes("takeDamage")){
				boon.effect("takeDamage");
			}
		})
		if(DIFFICULTY_SOULLINK.checked){
			if(Party.Characters.findIndex((character)=>character.Stats.hp<=0)!==-1){
				location.reload();
			}
		}
		
		Party.Characters=Party.Characters.filter((character)=>character.Stats.hp>0);
	}
	enemiesDefeated+=NumberOfEnemies-GLOBAL.Combat.enemies.length;
	UpdateLocalStorage("enemiesDefeated");
	if(GetTurnOrder().length-1<GLOBAL.Combat.turn){
		GLOBAL.Combat.turn=Math.max(GLOBAL.Combat.turn-1,0);
	}
	if(Party.Characters.length===0){
		location.reload();
	}
	}catch(e){Console(`${e} (${error})`)}
}
function heal(healObj){
	/*
		healObj:{
			from: (obj) who is healing,
			to: (obj) who is getting healed,
			amount: (int) the amount being healed,
			isPercent: (bool) if the amount being healed is a percent
		}
	*/
	let actualAmountHealed=0;
	if(healObj.isPercent){
		if(healObj.to.Stats.hp+(healObj.to.Stats.maxHp*healObj.amount)<=healObj.to.Stats.maxHp){
			Console("case 1");
			actualAmountHealed=(healObj.to.Stats.maxHp*healObj.amount)
		}else{
			Console("case 2");
			actualAmountHealed=(healObj.to.Stats.maxHp*healObj.amount)-((healObj.to.Stats.hp+(healObj.to.Stats.maxHp*healObj.amount))-healObj.to.Stats.maxHp);
		}
		healObj.to.Stats.hp=Math.min(healObj.to.Stats.hp+(healObj.to.Stats.maxHp*healObj.amount),healObj.to.Stats.maxHp);
	}else{
		if(healObj.to.Stats.hp+healObj.amount<=healObj.to.Stats.maxHp){
			Console("case 3");
			actualAmountHealed=healObj.amount;
		}else{
			Console("case 4");
			actualAmountHealed=healObj.amount-((healObj.to.Stats.hp+healObj.amount)-healObj.to.Stats.maxHp);
		}
		healObj.to.Stats.hp=Math.min(healObj.to.Stats.hp+healObj.amount,healObj.to.Stats.maxHp);
	}
	if(Party.Characters.includes(healObj.to)){
		amountHealed+=actualAmountHealed;
		if(healObj.to.Stats.hp===healObj.to.Stats.maxHp){
			addAchievement(1);
		}
	}
	
	UpdateLocalStorage("amountHealed");
	Console(`${healObj.from.type} healed ${healObj.to.Stats.name} for ${actualAmountHealed}`,"COMBATLOG");
}
function calculateDamageReduction(armor){
	if(armor>0){
		let damageReduction=1+((2.5*(Math.abs(getBaseLog(GLOBAL.armorFalloff,armor))+getBaseLog(GLOBAL.armorFalloff,armor))))/2;
		Console(damageReduction/100);
		return damageReduction/100;
	}else{
		return 0;
	}
}
function getDifficultyPreset(){
	let currentDiff=GLOBAL.difficultySelected.slice(0,GLOBAL.difficultySelected.lastIndexOf(1)+1);
	for(let index=0;index<GLOBAL.presets.length;index++){
		if(currentDiff.join("")==GLOBAL.presets[index].join("")){
			currentDiff=GLOBAL.presetNames[index];
			break;
		}
	}
	Console(currentDiff);
	return currentDiff;
}
function padSelectedDifficulty(){
	for(let i=0;i<GLOBAL.presets.length;i++){
		if(GLOBAL.difficultySelected[i]==null){
			GLOBAL.difficultySelected[i]=0;
		}
	}
}
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function giveRandomBook(){
	let bookGiven=new Book(true);
	PAUSEBUTTON.innerHTML="!!!";
	GLOBAL.alerts=["inventory",1];
	Party.inventory.push({type:"enchanted book",desc:JSON.stringify(bookGiven),value:bookGiven})
}
function getDebuffSymbol(name){
	switch(name){
		case "bleed":
			return `<span class="popuptarget">&#129656;<span class="popup">${GLOBAL.debuffs.bleed.desc}</span></span>`;
			break;
		case "stun":
			return `<span class="popuptarget">&#10036;<span class="popup">${GLOBAL.debuffs.stun.desc}</span></span>`;
			break;
		case "exaustion":
			return `<span class="popuptarget">&#128164;<span class="popup">${GLOBAL.debuffs.exaustion.desc}</span></span>`;
			break;
		case "poison":
			return `<span class="popuptarget">&#9763;<span class="popup">${GLOBAL.debuffs.poison.desc}</span></span>`;
			break;
		case "poison":
			return `<span class="popuptarget">&#128566;<span class="popup">${GLOBAL.debuffs.silence.desc}</span></span>`;
			break;
		case "disarm":
			return `<span class="popuptarget">&#128274;<span class="popup">${GLOBAL.debuffs.disarm.desc}</span></span>`;
			break;
		default:
			return "n/a"
	}
}
function getbuffSymbol(name){
	switch(name){
		case "regeneration":
			return `<span class="popuptarget">&#128154;<span class="popup">${GLOBAL.buffs.regeneration.desc}</span></span>`;
			break;
		default:
			return "n/a"
	}
}
function MakeStartingWeaponSelect(){
	error=" equipchoice"
	SELECTSTARTINGWEAPONDIALOG.innerHTML="";
		Equipment.Weapons.forEach((weapon,index)=>{
			const NEWEQUIPBUTTON=DOC.createElement("button");
			NEWEQUIPBUTTON.innerHTML=weapon.name;
			NEWEQUIPBUTTON.addEventListener("click",()=>{
				PlayerChooseTarget(function (index){
					weapon.Equip(parseInt(index));
				});
				SELECTSTARTINGWEAPONDIALOG.close();
			});
			const NEWEQUIPDESC=DOC.createElement("p");
			let output=[];
			weapon.Actions[weapon.name].forEach((action)=>{
				let desc=`${action.name} (${action.cost} stamina):deals ${action.damage} ${action.damageType} ${action.desc}`;
				if(action.procs){
					if(action.procs.length>0){
						let procDesc=[];
						action.procs.forEach((proc)=>{
							if(proc.type==="debuff"){
								desc+=`, and ${Math.min(100,(action.procCo)*proc.procChance*100).toFixed(2)}% chance to inflict ${proc.stacks} ${proc.name}`;
							}
						})
					}
				}
				output.push(desc);
			})
			
			NEWEQUIPDESC.innerHTML=`<p>${output.join("</p>\n<p>")}</p>`;
			SELECTSTARTINGWEAPONDIALOG.appendChild(NEWEQUIPBUTTON);
			SELECTSTARTINGWEAPONDIALOG.appendChild(NEWEQUIPDESC);
		});
	const CLOSEEQUIPBUTTON=DOC.createElement("button");
	CLOSEEQUIPBUTTON.innerHTML="Skip";
	CLOSEEQUIPBUTTON.addEventListener("click",()=>{
		SELECTSTARTINGWEAPONDIALOG.close();
	})
	SELECTSTARTINGWEAPONDIALOG.appendChild(CLOSEEQUIPBUTTON);
	SELECTSTARTINGWEAPONDIALOG.show();
}

function TriggerStartOfTurnEffects(){
	if(GetTurnOrder()[GLOBAL.Combat.turn].effects){
		let output=[];
		GetTurnOrder()[GLOBAL.Combat.turn].effects.startOfTurn.forEach((effect)=>{
			if(effect.type==="pers"){
				output.push(effect)
			}
			effect();
		})
		GetTurnOrder()[GLOBAL.Combat.turn].effects.startOfTurn=output;
	}
}
function TriggerStartOfBattleEffects(){
	//try{
	let output=[];
	GetTurnOrder().forEach((turn,index)=>{
		if(turn.effects){
			Console("turn.effects is defined","TSoBE")
			if(turn.effects.startOfBattle){
				Console("turn.effects.startOfBattle is defined","TSoBE")
				turn.effects.startOfBattle.forEach((effect)=>{
					if(effect.type==="pers"){
						output.push(effect)
						Console(`${turn.Stats.name}s start of battle effects triggered`,"TSoBE");
					}
					effect.effect();
				})
				turn.effects.startOfBattle=output;
			}
		}
	})
	//}catch(e){Console(e+", "+error)}
}
function TriggerEndOfTurnEffects(){
	if(GetTurnOrder()[GLOBAL.Combat.turn].effects){
		let output=[];
		GetTurnOrder()[GLOBAL.Combat.turn].effects.endOfTurn.forEach((effect)=>{
			if(effect.type==="pers"){
				output.push(effect)
			}
			effect.effect();
		})
		GetTurnOrder()[GLOBAL.Combat.turn].effects.endOfTurn=output;
	}
}
function MakeEvent(eventID){
	error=" event"
	try{
	EVENTDIALOG.innerHTML="";
	const NEWEVENTTITLE=DOC.createElement("h1");
	NEWEVENTTITLE.innerHTML=Events[GLOBAL.mapNode[0]][eventID].name;
	const NEWEVENTTEXT=DOC.createElement("p")
	NEWEVENTTEXT.innerHTML=Events[GLOBAL.mapNode[0]][eventID].text;
	EVENTDIALOG.appendChild(NEWEVENTTITLE);
	EVENTDIALOG.appendChild(NEWEVENTTEXT);
	Events[GLOBAL.mapNode[0]][eventID].options.forEach((option)=>{
		const EVENTOPTION=DOC.createElement("button");
		EVENTOPTION.innerHTML=option.text;
		if(option.condition()){
			EVENTOPTION.addEventListener("click",()=>{
				checkToStartBoss()
				EVENTDIALOG.close();
				option.effect();
			});
		}else{
			EVENTOPTION.disabled=true;
		}
		EVENTDIALOG.appendChild(DOC.createElement("br"));
		EVENTDIALOG.appendChild(EVENTOPTION);
	});
	EVENTDIALOG.show();
	}catch(e){Console(e+error)}
}
function MakeZoneDescription(zoneID){
	error=" event"
	try{
	EVENTDIALOG.innerHTML="";
	const NEWZONETITLE=DOC.createElement("h1");
	NEWZONETITLE.innerHTML=GLOBAL.Combat.SpawnCard.Zone[zoneID].name;
	const NEWZONETEXT=DOC.createElement("p")
	NEWZONETEXT.innerHTML=GLOBAL.Combat.SpawnCard.Zone[zoneID].desc;
	EVENTDIALOG.appendChild(NEWZONETITLE);
	EVENTDIALOG.appendChild(NEWZONETEXT);
	const ZONEOPTION=DOC.createElement("button");
	ZONEOPTION.innerHTML="Continue on...";
	ZONEOPTION.addEventListener("click",()=>{
		EVENTDIALOG.close();
	});
	EVENTDIALOG.appendChild(DOC.createElement("br"));
	EVENTDIALOG.appendChild(ZONEOPTION);
	EVENTDIALOG.show();
	}catch(e){Console(e+error)}
}
function checkToStartBoss(){
	if(GLOBAL.Combat.fights/(GLOBAL.mapNode[0]+1)<ReadSeed(GLOBAL.seed).numberOfCombats){
		//the # of combats played / the zone # < the # of combats made in the seed
		Console("No Boss");
		return false;
	}else{
		updateBossDescription(GLOBAL.Combat.SpawnCard.Zone[GLOBAL.mapNode[0]].bosses[0].desc);
		alert("boss");
		return true;
	}
}
function updateBossDescription(description){
	try{
		NORMALCOMBAT.style.display="none";
		BOSSCOMBAT.style.display="block";
		BOSSDESC.innerHTML=description;
		STARTBOSSCOMBAT.addEventListener("click",()=>{
			GLOBAL.Combat.StartCombat(true,GLOBAL.Combat.SpawnCard.Zone[GLOBAL.mapNode[0]].bosses[0].card);
			GLOBAL.mapNode[0]++;
			MakeZoneDescription(GLOBAL.mapNode[0]);
			NORMALCOMBAT.style.display="block";
			BOSSCOMBAT.style.display="none";
		})
	}catch(e){
		Console(e,"UPDATEBOSSDESC");
	}
}
function MakeSkillChoice(characterIndex){
	GLOBAL.SkillsWaiting++;
	try{
	Console(`Character level ${characterIndex} ${GLOBAL.SkillsWaiting}`)
	Console(`${Party.Characters[characterIndex].Stats.name} (level ${Party.Characters[characterIndex].Stats.level})`)
	const CHARACTERSKILLOPTIONS=DOC.createElement("dialog");
	CHARACTERSKILLOPTIONS.innerHTML=`<h1>Pick a level ${Party.Characters[characterIndex].Stats.level} skill for ${Party.Characters[characterIndex].Stats.name}</h1>`;
	Party.Characters[characterIndex].Skills[Party.Characters[characterIndex].Stats.level-1].forEach((skill)=>{
		if(skill){
			const NEWSKILLDESC=DOC.createElement("p");
			const NEWSKILLCHOICE=DOC.createElement("button");
			if(!skill.condition){
				NEWSKILLCHOICE.disabled=true;
			}else{
				NEWSKILLCHOICE.disabled=false;
			}
			NEWSKILLCHOICE.addEventListener("click",()=>{
				try{
					CHARACTERSKILLOPTIONS.close();
					GLOBAL.SkillsWaiting--;
					//Console(GLOBAL.SkillsWaiting);
					if(GLOBAL.SkillsWaiting<=0){
						SKILLDIALOG.close();
						SKILLDIALOG.innerHTML="";
					}
					skill.effect();
					skill.hasSkill=true;
				}catch(e){Console(e)}
			})
			NEWSKILLCHOICE.innerHTML=`Gain skill "${skill.name}"`;
			NEWSKILLDESC.innerHTML=`${skill.desc}`;
			CHARACTERSKILLOPTIONS.appendChild(NEWSKILLDESC);
			CHARACTERSKILLOPTIONS.appendChild(NEWSKILLCHOICE);
		}
	})
	
	SKILLDIALOG.appendChild(CHARACTERSKILLOPTIONS);
	CHARACTERSKILLOPTIONS.show();
	SKILLDIALOG.show();
	}catch(e){Console(e)}
}
function MakeSubEvent(eventID){
	error=" subevent";
	try{
		setTimeout(()=>{
	EVENTDIALOG.innerHTML="";
	const NEWEVENTTITLE=DOC.createElement("h1");
	NEWEVENTTITLE.innerHTML=subEvents[eventID].name;
	const NEWEVENTTEXT=DOC.createElement("p")
	NEWEVENTTEXT.innerHTML=subEvents[eventID].text;
	EVENTDIALOG.appendChild(NEWEVENTTITLE);
	EVENTDIALOG.appendChild(NEWEVENTTEXT);
	subEvents[eventID].options.forEach((option)=>{
		if(option.condition()){
			const EVENTOPTION=DOC.createElement("button");
			EVENTOPTION.innerHTML=option.text;
			EVENTOPTION.addEventListener("click",()=>{
				option.effect();
				EVENTDIALOG.close();
			});
			EVENTDIALOG.appendChild(DOC.createElement("br"));
			EVENTDIALOG.appendChild(EVENTOPTION);
		}
	});
	EVENTDIALOG.show();
		},0);
	}catch(e){Console(`${e} (${error})`)}
}

function addAchievement(index){
	//try{
		if(!achievements.includes(GLOBAL.Achievements[index])){
			GLOBAL.alerts=["achievements",1]
			achievements.push(GLOBAL.Achievements[index]);
			MOSTRECENTACHIEVEMENT.innerHTML=GLOBAL.Achievements[index];
			UpdateLocalStorage("achievements");
			Console(`Achievement gain: ${GLOBAL.Achievements[index]}`);
		}
	//}catch(e){alert(e)}
}
function UpdateAchievementsDisplay(){
	ACHIEVEMENTSLIST.innerHTML="";
	ACHIEVEMENTSMETER.min=0;
	ACHIEVEMENTSMETER.max=GLOBAL.Achievements.length;
	ACHIEVEMENTSMETER.value=achievements.length;
	ACHIEVEMENTSMETERLABEL.innerHTML=`Achievements: ${achievements.length}/${GLOBAL.Achievements.length} (${((achievements.length/GLOBAL.Achievements.length)*100).toFixed(2)}%)`
	GLOBAL.Achievements.forEach((achievement)=>{
		const NEWACHIEVEMENTITEM=DOC.createElement("li");
			NEWACHIEVEMENTITEM.innerHTML=achievement;
		if(achievements.includes(achievement)){
			NEWACHIEVEMENTITEM.style.color="black";
		}else{
			NEWACHIEVEMENTITEM.style.color="red";
		}
		ACHIEVEMENTSLIST.appendChild(NEWACHIEVEMENTITEM);
	})
}
function PlayerChooseTarget(fnc){
	CHARACTERTARGETDIALOG.innerHTML="";
	Party.Characters.forEach((character,index)=>{
		const NEWCHARACTERBUTTON=DOC.createElement("button");
		NEWCHARACTERBUTTON.classList.add("choice");
		NEWCHARACTERBUTTON.innerHTML=`${character.Stats.name}`;
		NEWCHARACTERBUTTON.addEventListener("click",()=>{
			fnc(index);
			CHARACTERTARGETDIALOG.close();
		});
		CHARACTERTARGETDIALOG.appendChild(NEWCHARACTERBUTTON);
		CHARACTERTARGETDIALOG.appendChild(DOC.createElement("br"));
	});
	CHARACTERTARGETDIALOG.show();
}
function UpdatePauseScreen(){
	REPUTATION.innerHTML=`Reputation ${Party.Alignment.name} (${Party.reputationPercent*100}%)`;
}
function MakeEquipChoice(n,armor){
	error=" equipchoice"
	EQUIPDIALOG.innerHTML="";
	if(armor){
		let armorTypeRand=rand(0,5);
		
	}else{
		for(var i=0;i<n;i++){
			const NEWEQUIPBUTTON=DOC.createElement("button");
			let equip=Equipment.Weapons[rand(0,Equipment.Weapons.length)];
			NEWEQUIPBUTTON.innerHTML=equip.name;
			NEWEQUIPBUTTON.addEventListener("click",()=>{
				PlayerChooseTarget(function (index){
					if(Party.Characters[index].Equipment.Weapons.name===equip.name&&!DIFFICULTY_NOUPGRADES.checked){
						Party.Characters[index].Actions[Party.Characters[index].Equipment.Weapons.name].forEach((action)=>{
							action.damage++;
							equipmentUpgraded++;
							UpdateLocalStorage("equipmentUpgraded");

						})
						addAchievement(25);
					}else{
						equip.Equip(index);
					}
				});
				EQUIPDIALOG.close();
			});
			const NEWEQUIPDESC=DOC.createElement("p");
			let output=[];
			equip.Actions[equip.name].forEach((action)=>{
				output.push(`${action.name} (${action.cost} stamina):deals ${action.damage} ${action.damageType} ${action.desc}`);
				if(action.procs){
						if(action.procs.length>0){
							let procDesc=[];
							action.procs.forEach((proc)=>{
								if(proc.type==="debuff"){
									function getOdds(){
										if(Party.luck>-2&&Party.luck<2){
											return Math.min(action.procCo*proc.procChance,1);
										}else{
											if(Party.luck<-1){
												return Math.min((action.procCo*proc.procChance)**Math.abs(Party.luck),1);
											}else if(Party.luck>1){
												return Math.min(1-((action.procCo*proc.procChance)**Math.abs(Party.luck)),1);
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
							output.push(`${procDesc.join(", ")}`)
						}
					}
			})
			
			NEWEQUIPDESC.innerHTML=`<p>${output.join("</p>\n<p>")}</p>`;
			EQUIPDIALOG.appendChild(NEWEQUIPBUTTON);
			EQUIPDIALOG.appendChild(NEWEQUIPDESC);
		}
	}
	const CLOSEEQUIPBUTTON=DOC.createElement("button");
	CLOSEEQUIPBUTTON.innerHTML="Skip";
	CLOSEEQUIPBUTTON.addEventListener("click",()=>{
		EQUIPDIALOG.close();
		addAchievement(3);
	})
	EQUIPDIALOG.appendChild(CLOSEEQUIPBUTTON);
	EQUIPDIALOG.show();
}

function UpdateMoney(){
	["copper","silver","gold","platinum"].forEach((coin)=>{
		if(Party.money[coin]){
			DOC.getElementById(coin).innerHTML=`${Party.money[coin]} ${coin}`
		}
	})
}
function UpdateTurnOrder(withpass){
	error="updateturnorder";
	try{
	TURNORDER.innerHTML="";
	GetTurnOrder().forEach((turn,index)=>{
		const NEWTURNDISPLAY=DOC.createElement("li");
		NEWTURNDISPLAY.innerHTML=`| ${turn.Stats.name}`;
		NEWTURNDISPLAY.addEventListener("mouseover",()=>{
			if(!turn.ID){
				UpdateStatDisplay(Party.Characters.findIndex((character)=>character.Stats.name===turn.Stats.name));
			}
		})
		if(GLOBAL.Combat.turn===index&&turn.ID){
			Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
				ability.disabled=true;
			});
			//PrintToConsole(withpass)
			if(withpass){
				try{
					if(turn.Stats.debuffs.findIndex((debuff)=>debuff.name=="stun")==-1){
						if(turn.Attack){
							turn.Attack();
						}
					}
				}catch(e){PrintToConsole(`${e} during ${turn.ID}`)}
			}
			PASSBUTTON.disabled=true;
		}else if(GLOBAL.Combat.turn===index){
			if(withpass){
				TriggerStartOfTurnEffects();
				if(GLOBAL.Combat.round===0){
					turn.Stats.stamina=turn.Stats.startingStamina;
					//Party.Characters[turn].Stats.stamina=Party.Characters[turn].Stats.startingStamina;
				}else{
					turn.Stats.stamina=Math.min(turn.Stats.stamina+turn.Stats.staminaRegen,turn.Stats.maxStamina)
					//Party.Characters[turn].Stats.stamina=Math.min(Party.Characters[turn].Stats.stamina+Party.Characters[turn].Stats.staminaRegen,Party.Characters[turn].Stats.maxStamina);
				}
			}
			PASSBUTTON.disabled=false;
			UpdateCharacterDisplay(Party.Characters.findIndex((character)=>character.Stats.name==turn.Stats.name));
			Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
				ability.disabled=false;
			});
			
		}
		if(index===GLOBAL.Combat.turn){
			NEWTURNDISPLAY.style.color="blue";
		}
		TURNORDER.appendChild(NEWTURNDISPLAY);
	})
	Array.from(DOC.getElementsByClassName("character_ability")).forEach((ability)=>{
		ability.checkAbility();
	});
	}catch(e){PrintToConsole(e+error)}
}
function CheckForDeath(){
	if(Party.Characters.length>0){
		return 0;
	}else{
		location.reload();
	}
}
function PassTurn(){
	try{
	TriggerBuffs(1)
	TriggerDebuffs(1);
	TriggerEndOfTurnEffects();
	GLOBAL.Combat.turn++;
	if(GLOBAL.Combat.turn+1>GetTurnOrder().length){
		GLOBAL.Combat.turn=0;
		GLOBAL.Combat.round++;
	}
	Console(`${GetTurnOrder()[GLOBAL.Combat.turn].Stats.name}'s turn started!`,"")
	TriggerBuffs(0);
	TriggerDebuffs(0);
	error="1";
	UpdateTurnOrder(true);
	CheckForDeath()
	
	}catch(e){PrintToConsole(e+error)}
}
function GetFrontCharacter(){
	return Party.Characters[0];
	
}
function GetTurnOrder(){
	let output=[];
	GLOBAL.Combat.enemies.forEach((enemy)=>{
		output.push(enemy);
	});
	Party.Characters.forEach((character,index)=>{
		output.push(character);
	});
	output.sort((a,b)=>{
		let modput1;
		let modput2;
		if(typeof a==="number"){
			modput1=Party.Characters[a];
		}else{
			modput1=a;
		}
		if(typeof b==="number"){
			modput2=Party.Characters[b];
		}else{
			modput2=b;
		}
		return modput1.Stats.speed-modput2.Stats.speed>0?-1:modput1.Stats.speed-modput2.Stats.speed<0?1:0;
	});
	//PrintToConsole(JSON.stringify(output))
	return output;
}

async function PrintToConsole(message){
	consoleOutput.push(message)
	if(consoleOutput.length>10){
		consoleOutput=consoleOutput.slice(-10);
	}
	CONSOLEOUTPUT.innerHTML=consoleOutput.join("<br>");
	
}
function Console(message, sender="System"){
	if(sender==="COMBATLOG"){
		setTimeout(()=>{
			if(GLOBAL.Combat.inCombat||message=="<hr> New combat"){
				if(message=="<hr> New combat"){
					combatLogOutput.push(`${message}`);
				}else{
					combatLogOutput.push(`turn ${(GLOBAL.Combat.round+1)*(GLOBAL.Combat.turn)}: ${message}`);
				}
				if(combatLogOutput.length>13){
					combatLogOutput=combatLogOutput.slice(-13);
				}
				LOG.innerHTML=combatLogOutput.join("<br>");
			}
		},100);
	}else{
		activeMessages++;
		setTimeout(()=>{
			consoleOutput.push(`${sender}: ${message}`)
			if(consoleOutput.length>8){
				consoleOutput=consoleOutput.slice(-8);
			}
			//console.log(`${sender}: ${message} `);
			CONSOLEOUTPUT.innerHTML=consoleOutput.join("<br>");
			activeMessages--;
		},0+(activeMessages*100));
	}
}
function LevelEverybody(){
	Party.Characters.forEach((character)=>{
		character.Stats.gainXp(character.Stats.maxXp);
	})
}
function ConsoleLines(){
	//Console(consoleLines)
}
function autoScrollToBottom() {
    // Setting the scrollTop to the element's total scrollable height forces it down.
    CONSOLEOUTPUT.scrollTop += 999999999999;
}
function Clear(){
	CONSOLEOUTPUT.innerHTML="";
}
function FindValue(input){
	try{
		if(input.includes(".")){
			const properties=input.split(".");
			let currentValue=window;
			properties.forEach((prop,index)=>{
				if(currentValue[prop]!==undefined){
					Console(`window.${properties.slice(index).join(".")} found`);
					currentValue=currentValue[prop];
				}else{
					throw new TypeError(`window.${properties.slice(index).join(".")} is undefined`); // Property not found
				}
			});
			Console(safeStringify(currentValue));
		}
	}catch(e){Console(e)}
}
function generateCommandList() {
    const commands = [];
    // Iterate over all properties of the global window object
    for (const propertyName in window) {
        // Use hasOwnProperty to filter out inherited properties if necessary
        if (Object.prototype.hasOwnProperty.call(window, propertyName)) {
            const propertyValue = window[propertyName];
            // Check if the property is a function and filter out standard built-in functions 
            // you don't want the user to call (like 'alert', 'setTimeout', 'Math', etc.)
            if (typeof propertyValue === 'function' && !isBuiltIn(propertyName)) {
                commands.push(propertyName);
            }
        }
    }
    return commands;
}

function IsJSON(value){
	try{
		JSON.parse(value);
		return true;
	}catch(e){
		return false;
	}
}

function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, function(key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    });
}

/**
 * Tries to resolve a string argument into either a global function 
 * or a parsed JSON value.
 * @param {string} segment The string argument from the console input.
 * @returns {*} The resolved value (function reference or data).
 */
function resolveArgument(segment) {
    // 1. Check if the segment name corresponds to a function on the window object
    if (typeof window[segment] === 'function') {
        return window[segment]; // Return the actual function reference
    }

    // 2. Try to parse as JSON
    try {
        // This will return the value (string, number, object, etc.)
        return JSON.parse(segment);
    } catch (e) {
        // If it fails both checks, return the raw string or handle as an error
        // Depending on your application's rules, you might throw an error here.
        // For this example, we'll return null or undefined to signify failure
        return undefined;
    }
}
function EndCombat(){
	GLOBAL.Combat.EndCombat();
}
function StartCombat(RANDENEMIES,ENEMYOBJECTS_OR_ENEMYTYPES){
	GLOBAL.Combat.StartCombat(RANDENEMIES,ENEMYOBJECTS_OR_ENEMYTYPES)
}
// Helper function to filter out most built-in browser functions
// This list can be customized based on your needs.

function getScaling(){
	Console(`Enemy level ${Party.level} (scaling ${GLOBAL.EnemyScaling.amount} per ${GLOBAL.EnemyScaling.rate}xp )(${Party.xp}/${Party.maxXp})`)
}
function getSpawncard(prop,level,zone){
	Console(GLOBAL.Combat.SpawnCard.Zone[0??zone].Card(prop,level));
}
Console("Turn based game/Scripts/functions.js loaded");

function MakeSeed(){
	try{
	let SeedOutput="";
	let part=[];
	part.push(ConvertToSeedString(rand(10,20)));
	part.push(ConvertToSeedString(rand(5,ConvertFromSeedString(part[0])/2)));
	for (let Zone = 0; Zone < 10; Zone++) {
		// determine how many events to pick for this zone
		let eventCount = ConvertFromSeedString(part[0]) - ConvertFromSeedString(part[1]);
		eventCount = Math.max(0, eventCount);
		Console(`Zone ${Zone}: Picking ${eventCount} events (of ${Events[Zone]?.length || 0} available)`,"SEEDGEN");
		const available = (Events[Zone] && Events[Zone].length) ? Events[Zone].length : 0;
		const picks = Math.min(eventCount, available);
		if (picks <= 0) continue;

		// build list of indices and shuffle (Fisher-Yates)
		const indices = Array.from({ length: available }, (_, i) => i);
		for (let i = indices.length - 1; i > 0; i--) {
			const j = rand(0, i + 1);
			const tmp = indices[i];
			indices[i] = indices[j];
			indices[j] = tmp;
		}

		// take the first `picks` indices (unique) and add to seed
		for (let k = 0; k < picks; k++) {
			part.push(ConvertToSeedString(indices[k]));
		}
		part.push(":")
		GLOBAL.Combat.SpawnCard.Zone[Zone].cards.forEach((card)=>{
			part.push(ConvertToSeedString(rand(0,card.easy.length)));
			part.push(ConvertToSeedString(rand(0,card.hard.length)));
		})
		part.push(".")
	}
	SeedOutput=part.join("");
	Console(`Generated Seed: ${SeedOutput}`,"SEEDGEN");
	return SeedOutput;
	}catch(e){alert(e)}

}
function ReadSeed(seed){
	try{
	let out={};
	let numberOfCombats=ConvertFromSeedString(seed[0]);
	out.numberOfCombats=numberOfCombats;
	Console(`Number of combats: ${numberOfCombats}`,"SEEDGEN");
	let numberOfEvents=ConvertFromSeedString(seed[1]);
	Console(`Number of Equip pickups per zone: ${numberOfEvents}`,"SEEDGEN");
	EventIds= seed.slice(2);
	let Zones=seed.split(".").slice(0,seed.split(".")-1)
	Console(`Zones:${JSON.stringify(Zones)}`)
	out.EventNames=[[],[],[],[],[],[],[],[],[],[]];
	out.Cards=[]
	Zones.forEach((Zone,index)=>{
		if(Zone.split(":")[1].length>0){
			for (let currentIndex=0;currentIndex<Zone.split(":")[0].length;currentIndex++){
			if(Events[index]){
					Console(`out.EventNames[${index}].push((Events[${index}][${ConvertFromSeedString(Zone.split(":")[0][currentIndex])}]).name)`)
					out.EventNames[index].push((Events[index][ConvertFromSeedString(Zone.split(":")[0][currentIndex+2])]).name);
				}
			}
			Console(JSON.stringify(Zone.split(":")[1]),"SEEDREADER")
			for(let currentIndex=0;currentIndex<Zone.split(":")[1].length;currentIndex++){
				Console(`${Zone.split(":")[1][currentIndex]}`,"SEEDREADER");
				out.Cards.push({easy:GLOBAL.Combat.SpawnCard.Zone[index].easy[Zone.split(":")[1][currentIndex]],hard:GLOBAL.Combat.SpawnCard.Zone[index].hard[Zone.split(":")[1][currentIndex]]})
			}
		}
	})
	return out;
	}catch(e){
		Console(`${e}`,"SEEDREADER")
	}
}
function getSeed(){
	Console(`${GLOBAL.seed}`,"SEED")
}
function ConvertFromSeedString(value){
	if(typeof value=="number"||!isNaN(parseInt(value))){
		return parseInt(value);
	}else{
		return ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"].findIndex((char)=>char===value)+10;
	}
}
function ConvertToSeedString(value){
	if(typeof value=="number"){
		if(value<10){
			return value;
		}else{
			return ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"][value-10];
		}
	}else{
		return parseInt(value);
	}
}