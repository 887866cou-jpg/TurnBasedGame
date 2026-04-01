function ModSpawncard(zone, level, path, mode="add", value){
	try{
		switch(mode){
			case "add":
				if(arguments.length<5){
					throw new TypeError(`ModSpawncard expected at least 5 arguments with "add" mode`)
				}
				if(typeof value=="string"&&typeof arguments[5]=="number"){
					GLOBAL.Combat.SpawnCard.Zone[zone].cards[level][path][arguments[5]].push(value);
					Console(`ModSpawncard added ${value} to Zone ${zone} level ${level} ${path} path (encounter ${arguments[5]})`);
					Console(`New spawncard: ${JSON.stringify(GLOBAL.Combat.SpawnCard.Zone[zone].cards[level][path][arguments[5]])}`)
				}else if(typeof value!=="string"&&typeof arguments[5]=="number"){
					throw new TypeError(`ModSpawncard expected argument[4] ("value") to be a string when argument[5] is a number, but got type of "${typeof value}"`)
				}else if(!arguments[5]){
					if(Array.isArray(value)){
						value.forEach((addition)=>{
							GLOBAL.Combat.SpawnCard.Zone[zone].cards[level][path].forEach((encounter,index)=>{
								ModSpawncard(zone, level, path, "add", addition, index);
							});
						})
					}else{
						throw new TypeError(`ModSpawncard expected argument[4] ("value") to be an array when argument[5] isnt defined, but got type of "${typeof value}"`)
					}
				}
				//argument[5] is 
				break;
			case "replace":
				if(!Array.isArray(value)){
					throw new TypeError(`ModSpawncard expected argument[4] ("value") to be an array when in replace mode, but got type of "${typeof value}"`);
				}else if(typeof arguments[5]!=="number"){
					throw new TypeError(`ModSpawncard expected argument[5] to be a number, but got type of "${typeof arguments[5]}"`)
				}else{
					Console(`ModSpawncard replacing Zone ${zone} level ${level} ${path} path (encounter ${arguments[5]}) (${JSON.stringify(GLOBAL.Combat.SpawnCard.Zone[zone].cards[level][path][arguments[5]])}) with ${JSON.stringify(value)}`);
					GLOBAL.Combat.SpawnCard.Zone[zone].cards[level][path][arguments[5]]=value;
				}
				break;
		}
	}catch(e){Console(e)}
}
function Mod(){
	try{
	return {
		get Add(){
			return {
				get Equipment(){
					return {
						Weapon(name){
							let EquipLength=Equipment.Weapons.length;
							Equipment.Weapons.push({
								name:name,
								equippedTo:0,
								modifier:{},
								Actions:{}
							})
							Object.assign(Equipment.Weapons[EquipLength].Actions[name],[]);
							Console(`New weapon added ${name}`);
						}
					}
				}
			}
		},
		get Create(){
			return {
				Action(name, damage, target, damageType, cost, desc, procCo, procs, additionalEffects){
					return {
						name:name,
						damage:damage,
						target:target,
						damageType:damageType,
						cost:cost,
						desc:desc,
						procCo:procCo,
						procs:procs,
						effect(){
							additionalEffects();
							this.procs.forEach((proc)=>{
								if(new Chance(proc.procChance*this.procCo,Party.luck).succeed){
									if(proc.type==="debuff"){
										ApplyDebuff(proc.name,GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)],proc.stacks)
									}
								}
							})
							Damage({Amount:this.damage,Type:this.damageType,get to(){return GLOBAL.Combat.enemies[GLOBAL.Combat.enemies.findIndex((thing)=>thing.Stats.target===true)]}});
						}
					}
				}
			}
		},
		get Assign(){
			return {
				get to(){
					return {
						get Equipment(){
							return {
								Weapon(index, mode){
									/*modes are
										"Action"
									*/
									return {
										Action(action_object){
											Equipment.Weapons[index].Actions[Equipment.Weapons[index].name].push(action_object);
										}
									}[mode]
								}
							}
						}
					}
				}
			}
		}
	};
	}catch(e){Console(e)}
}


