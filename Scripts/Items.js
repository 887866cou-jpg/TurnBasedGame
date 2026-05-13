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
		type:"potion",
		name:"Healing Potion",
		desc:"a Healing potion",
		options:[
			{
				description:"",
				effect(){
					PlayerChooseTarget(function (index){
						heal()
					})
				},
			}
		],
		ID:2,
	}
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