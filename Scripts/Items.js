let Items=[
	{
		//0
		type:"material",
		name:"tattered cloth",
		desc:"A piece of cloth, frayed at the edges",
		ID:0
	},
	{
		//1
		type:"material",
		name:"scrap of metal",
		desc:"the name is pretty descriptive as to what it is",
		ID:1,
	},
	{
		//2
		type:"consumable",
		name:"Small Healing Potion",
		desc:"a Healing potion",
		uses:1,
		maxUses:1,
		options:[
			{
				name:"Drink",
				desc:"Heals 20 hp on the selected character",
				effect(){
					try{
					PAUSEMENU.close();
					INVENTORYMENU.close();
					PlayerChooseTarget(function (index){
						heal({from:{type:"item"},to:Party.Characters[index],amount:20,isPercent:false});
					})
					}catch(e){
						Console(e,"ERROR");
					}
				},
			}
		],
		ID:2,
	},
	{
		//2
		type:"consumable",
		name:"Healing Potion",
		desc:"a Healing potion",
		uses:2,
		maxUses:2,
		options:[
			{
				name:"Drink",
				desc:"Heals 20 hp on the selected character",
				effect(){
					try{
					PAUSEMENU.close();
					INVENTORYMENU.close();
					PlayerChooseTarget(function (index){
						heal({from:{type:"item"},to:Party.Characters[index],amount:20,isPercent:false});
					})
					}catch(e){
						Console(e,"ERROR");
					}
				},
			}
		],
		ID:3,
	},
	{
		//2
		type:"consumable",
		name:"Big Healing Potion",
		desc:"a Healing potion",
		uses:3,
		maxUses:3,
		options:[
			{
				name:"Drink",
				desc:"Heals 20 hp on the selected character",
				effect(){
					try{
					PAUSEMENU.close();
					INVENTORYMENU.close();
					PlayerChooseTarget(function (index){
						heal({from:{type:"item"},to:Party.Characters[index],amount:20,isPercent:false});
					})
					}catch(e){
						Console(e,"ERROR");
					}
				},
			}
		],
		ID:4,
	},
	{
		//2
		type:"consumable",
		name:"Titanic Healing Potion",
		desc:"A healing potion of epic proportions.",
		uses:3,
		maxUses:3,
		options:[
			{
				name:"Drink",
				desc:"Heals 50% of the selected character's hp",
				effect(){
					try{
					PAUSEMENU.close();
					INVENTORYMENU.close();
					PlayerChooseTarget(function (index){
						heal({from:{type:"item"},to:Party.Characters[index],amount:50,isPercent:true});
					})
					}catch(e){
						Console(e,"ERROR");
					}
				},
			}
		],
		ID:5,
	},
	{
		//1
		type:"material",
		name:"Log",
		desc:"A log",
		ID:6,
	},
	{
		//1
		type:"material",
		name:"Wolf pelt",
		desc:"the name is pretty descriptive as to what it is",
		ID:7,
	},
	{
		//1
		type:"material",
		name:"",
		desc:"the name is pretty descriptive as to what it is",
		ID:8,
	},
];
let crafting=[
	//recipe 1
	{
		station:"",
		materials:[
		
		],
		result:[]
	}
]