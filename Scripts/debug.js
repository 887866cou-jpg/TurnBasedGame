function give(EQUIPMENTTYPE,INDEX,MODIFIERNAME,CHARACTERINDEX){
	Equipment[EQUIPMENTTYPE][INDEX].Equip(CHARACTERINDEX,{name:MODIFIERNAME});
}
function bossProg(){
	Console(`${Math.ceil(GLOBAL.Combat.fights/(GLOBAL.mapNode[0]+1))}/${ReadSeed(GLOBAL.seed).numberOfCombats}`,`Combats till boss`)
}
function hide(sender){
	hidelist.push(sender);
}