/*
Zone 2 enemies: Gallnipper
*/
class Chance{
	constructor(percent,adv=1,purpose){
		//high rolls are always favored
		//adv is how many times it should roll to get a favorable outcome, if negative rolls for an unfavorable outcome
		//for example, if adv is -3, it will roll 3 times and if any of the rolls don't succeed then the roll fails
		try{
			this.rolls=[];
			for(let i=0;i<((adv===0)?1:Math.abs(adv));i++){
				let val=rand(0,10001)/10000;
				this.rolls.push({roll:val,pass:(val>=1-percent)});
			}
			Console(`${purpose?`${purpose} `:``}rolls for chance ${JSON.stringify(this.rolls)}>=${percent}`,"Rolls")
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
				if(new Chance((0.5**(this.Enchants.length)),Party.luck,`Book enchantment ${this.Enchants.length+1}`).succeed){
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