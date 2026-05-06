//Party.Characters[0].Equipment.Weapons.Unequip();
Party.money.gain("copper",0)
REPUTATION.innerHTML=`Reputation ${Party.Alignment.name} (${Party.reputationPercent*100}%)`;
//Party.Characters.push(Characters[2]);
//MakeEvent(3)
//localStorage.clear()
//Console("Turn based game/Scripts/startup.js loaded");
//Console(Object.values(Party.Characters[0].Stats).filter((stat)=>typeof stat=="number").average())
SETTINGS_ATTACKINTERVAL.value=settings.Other.Attack_interval_delay;
padSelectedDifficulty();
GLOBAL.seed=MakeSeed();
SEED.innerHTML=`Seed: ${GLOBAL.seed}`;
ReadSeed(GLOBAL.seed).EventNames.forEach((zoneEvents,zoneIndex)=>{
    zoneEvents.forEach((eventName)=>{
        Console(`Zone ${zoneIndex} Event: ${eventName}`);
    })
})
VERSION.innerHTML=`v${findCurrentVersion().join(".")}`;