//alert("events");
Array.from(DIFFICULTY_CHECKS).forEach((difficulty,index)=>{
	/*This code loops through all of the difficulty checkboxes and
	*tells them what to do when they are checked/unchecked*/
	difficulty.addEventListener("click",()=>{
		Console(`difficulty: ${GLOBAL.difficulty}`);
		DIFFICULTYMETER.min=0;
		DIFFICULTYMETER.max=Array.from(DIFFICULTY_CHECKS).length;
		DIFFICULTYMETER.value=GLOBAL.difficulty;
		GLOBAL.difficultySelected[index]=difficulty.checked?1:0;
		padSelectedDifficulty();
		Array.from(PRESETS).forEach((preset,index1)=>{
				preset.style.backgroundColor="lightgrey";
		})
		if(typeof getDifficultyPreset()=="string"){
			Array.from(PRESETS).forEach((preset,index1)=>{
				if(GLOBAL.presetNames[index1]==getDifficultyPreset()){
					preset.style.backgroundColor="lightblue";
				}else{
					preset.style.backgroundColor="lightgrey";
				}
			})
		}
	})
})
Array.from(PRESETS).forEach((preset,index1)=>{
	/*This code loops through all of the different difficulty presets and
	*tells the buttons what difficulty modifiers to check/uncheck when clicked*/
	preset.addEventListener("click",()=>{
		preset.style.backgroundColor="lightgrey";
		Array.from(DOC.getElementsByClassName("difficulties")).forEach((element, index)=>{
			element.checked=false;
			if(GLOBAL.presets[index1][index]){
				element.click();
			}
			padSelectedDifficulty();
			if(typeof getDifficultyPreset()=="string"){
				Array.from(PRESETS).forEach((preset,index1)=>{
					if(GLOBAL.presetNames[index1]==getDifficultyPreset()){
						preset.style.backgroundColor="lightblue";
					}else{
						preset.style.backgroundColor="lightgrey";
					}
				})
			}
		});
		padSelectedDifficulty();
		Console(`difficulty: ${GLOBAL.difficulty}`);
		GLOBAL.difficultySelected=GLOBAL.presets[index1]
		DIFFICULTYMETER.min=0;
		DIFFICULTYMETER.max=Array.from(DIFFICULTY_CHECKS).length;
		DIFFICULTYMETER.value=GLOBAL.difficulty;
	})
	preset.addEventListener("mouseover",()=>{
		/*This code tells is an indicator for when you hover over a difficulty preset
		*It will turn the text of the difficulty modifiers that will be enabled blue
		*It will turn the text of the difficulty modifiers that will be disabled black
		*And finally turns the difficulty modifiers text black when your mouse exits the preset button*/
		Array.from(DOC.getElementsByClassName("difficulties")).forEach((element, index)=>{
			if(GLOBAL.presets[index1][index]){
				element.labels[0].style.color="blue";
			}else{
				element.labels[0].style.color="black";
			}
		})
	})
	preset.addEventListener("mouseout",()=>{
		Array.from(DOC.getElementsByClassName("difficulties")).forEach((element, index)=>{
			element.labels[0].style.color="black";
		})
	})
})
NEWGAMEBUTTON.addEventListener("click",()=>{
	/*This is the code that starts the game!
	*1.It closes the main menu and opens the game dialog
	*2.It gives the player a random enchanted book
	*3.It gives you the achievement for starting your first game and if the difficulty has been increased
	*3.1 gives you the achievement for starting a game on a higher difficulty
	*4. Then it increments the number of games you have played by 1 and checks if you have played >10,25,50,100, or 500 games
	and gives you the corisponding achievement(s).
	*5. Then it applies the difficulty modifiers that influece your starting stats.
	*6. And finaly give you a shortsword with a random modifier*/
	try{
	MENUDIALOG.close();
	PATHDIALOG.show();
	giveRandomBook()
	if(games===0){
		addAchievement(0);
	}
	if(GLOBAL.difficulty>=1){
		addAchievement(26);
	}
	games++;
	if(games>=10){
		addAchievement(10);
		if(games>=25){
			addAchievement(11);
			if(games>=50){
				addAchievement(12);
				if(games>=100){
					addAchievement(13);
					if(games>=500){
						addAchievement(14);
					}
				}
			}
		}
	}
	UpdateLocalStorage("games");
	if(DIFFICULTY_WEAKNESS.checked){
		Object.keys(Party.Characters[0].Stats.resistances).forEach((key)=>{
			Party.Characters[0].Stats.resistances[key]-=0.1;
		})
	}
	if(DIFFICULTY_UNLUCKY.checked){
		Party.luck=-2;
	}
	if(DIFFICULTY_WEAK_STRIKES.checked){
		Equipment.Weapons.forEach((weapon)=>{
			weapon.Actions[weapon.name].forEach((action)=>{
				action.procCo-=0.1;
			})
		})
	}
	Equipment.Weapons[0].Equip(0);
	}catch(e){Console(e)}
});
OPENACHIEVEMENTS.addEventListener("click",()=>{
	//Opens the achievements menu
	GLOBAL.alerts=["achievements",0]
	ACHIEVEMENTSMENU.show();
	UpdateAchievementsDisplay();
});
CLOSEACHIEVEMENTS.addEventListener("click",()=>{
	//Closes the achievment menu
	ACHIEVEMENTSMENU.close();
})
SETTINGSBUTTON.addEventListener("click",()=>{
	//opens the settings menu
	SETTINGSMENU.show();
});
DIFFICULTYBUTTON.addEventListener("click",()=>{
	//opens the difficulty dialog
	DIFFICULTYSELECT.show();
})
CLOSEDIFFICULTYBUTTON.addEventListener("click",()=>{
	//Closes the difficulty dialog
	DIFFICULTYSELECT.close();
})
CLOSESETTINGSBUTTON.addEventListener("click",()=>{
	//Closes the settings dialog
	SETTINGSMENU.close();
});
PASSBUTTON.addEventListener("click",()=>{
	//Passes the turn
	PassTurn();
});
CLOSEOPTIONSMENUBUTTON.addEventListener("click",()=>{
	//Closes the options menu
	OPTIONSDIALOG.close();
});
OPTIONSBUTTON.addEventListener("click",()=>{
	//Opens the options menu
	OPTIONSDIALOG.show();
})
EASYPATH.addEventListener("click",()=>{
	//Starts the easy combat
	GLOBAL.Combat.StartCombat(true, GLOBAL.Combat.SpawnCard.Zone[GLOBAL.mapNode[0]].Card("easy"));
});
HARDPATH.addEventListener("click",()=>{
	//starts the hard combat
	GLOBAL.Combat.StartCombat(true, GLOBAL.Combat.SpawnCard.Zone[GLOBAL.mapNode[0]].Card("hard"));
	
});
CLOSEPAUSEMENU.addEventListener("click",()=>{
	//closes the pause menu
	PAUSEMENU.close();
})
ENABLEALLDIFFICULTIES.addEventListener("click",()=>{
	//clicks all of the difficulty checkboxes
	Array.from(DOC.getElementsByClassName("difficulties")).forEach((element)=>{
		element.click();
	})
})
EXITINVENTORYBUTTON.addEventListener("click",()=>{
	//closes the inventory
	INVENTORYMENU.close();
})
INVENTORYBUTTON.addEventListener("click",()=>{
	//opens and updates the inventory
	GLOBAL.alerts=["inventory",0]
	INVENTORYBUTTON.innerHTML="Inventory";
	updateInventory();
	INVENTORYMENU.show();
});
STATSBUTTON.addEventListener("click",()=>{
	//Opens and updates the stats display
	UpdateStats();
})
CLOSESTATSDIALOG.addEventListener("click",()=>{
	STATSDIALOG.close()
})
SETTINGS_ATTACKINTERVAL.addEventListener("change",(event)=>{
	try{
		settings.Other.Attack_interval_delay=event.target.value;
		UpdateLocalStorage("settings");
	}catch(e){Console(e)}
});
PAUSEBUTTON.addEventListener("click",()=>{
	UpdatePauseScreen();
	PAUSEMENU.show();
})
document.addEventListener("keydown",(event)=>{
	if(!GLOBAL.KeysPressed.includes(event.keyCode)){
		GLOBAL.KeysPressed.push(event.keyCode);
	}
	KEYSPRESSED.innerHTML=JSON.stringify(GLOBAL.KeysPressed)
	if(GLOBAL.KeysPressed.includes(16)&&GLOBAL.KeysPressed.includes(8)){
		if(CONSOLE.style.opacity==="0.75"){
			CONSOLE.style.opacity=0;
			CONSOLE.style.pointerEvents="none";
			CONSOLEINPUT.style.pointerEvents="none";
		}else{
			CONSOLE.style.opacity=0.75;
			CONSOLE.style.pointerEvents="scroll";
			CONSOLEINPUT.style.pointerEvents="all";
		}
	}
})

// Add this new event listener:


// Keep your existing keyup listener for the game logic (like 'Enter' key processing) 
// but remove the console logic related to displaying the "functions" text.

document.addEventListener("keyup",(event)=>{
    try{
        // ... (existing keyup logic) ...
        GLOBAL.KeysPressed=GLOBAL.KeysPressed.filter((key)=>key!==event.keyCode);
        KEYSPRESSED.innerHTML=JSON.stringify(GLOBAL.KeysPressed)
        event.preventDefault();
        if(event.key===" "&&GLOBAL.Combat.inCombat){
            PASSBUTTON.click();
        }else if(event.key==="1"){
            PassTurn()
        }else if(event.key==="2"){
            STARTINGWEAPONSELECTBUTTON.disabled=false;
        }else if(event.keyCode===27){
			UpdatePauseScreen();
			PAUSEMENU.show();
		}
		
        if(CONSOLEINPUT.value[0]==="/"){
            CONSOLEALERTTEXT.innerHTML="functions";
            const inputSegments=CONSOLEINPUT.value.slice(1).split("|")
			//Console(inputSegments)
			if(typeof window[inputSegments[0]]==="function"){
				CONSOLEALERTTEXT.innerHTML=`function ${inputSegments[0]}`
				let args=[];
				inputSegments.forEach((segment,index)=>{
					if(index!==0&&resolveArgument(segment)){
						args.push(resolveArgument(segment));
					}else if(!resolveArgument(segment)&&index!==0){
						Console(`argument ${index+1} (${segment}) is not valid JSON`);
					}else if(index===0){
						if(typeof window[segment]==="function"){
							Console(`function ${segment} is a valid function`)
						}
					}
				});
				Console(`Args:${args}`)
                    // Call the main command function using the spread operator
				if(event.keyCode===13){
					Clear();
					window[inputSegments[0]](...args);
					CONSOLEINPUT.value="";
            		CONSOLEALERTTEXT.innerHTML="";
				}
			}
        }else if(CONSOLEINPUT.value){
		}else{
            CONSOLEALERTTEXT.innerHTML="";
        }
    } catch(e){
        Console(e);
    }
});


STARTINGWEAPONSELECTBUTTON.addEventListener("click",()=>{
	SELECTSTARTINGWEAPONDIALOG.show();
	MakeStartingWeaponSelect();
});
Console("Turn based game/Scripts/events.js loaded");