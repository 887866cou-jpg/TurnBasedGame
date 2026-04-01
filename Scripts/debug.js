function give(EQUIPMENTTYPE,INDEX,MODIFIERNAME,CHARACTERINDEX){
	Equipment[EQUIPMENTTYPE][INDEX].Equip(CHARACTERINDEX,{name:MODIFIERNAME});
}
function test(){
	ApplyBuff("regeneration",Party.Characters[Party.Characters.findIndex((character)=>character.Stats.name==="Hen Farfield")],5);
}
