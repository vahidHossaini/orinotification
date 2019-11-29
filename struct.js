module.exports={
	MessageInterface:{
        struct:{
			template:{type:"string"},
			obj:{type:"object"},  
		}
	}, 
	TemplateInterface:{
        struct:{
			_id:{type:"string",nullable:true},
			name:{type:"string"}, 
			title:{type:"string"}, 
			text:{type:"string"}, 
			html:{type:"string"}, 
		}
	}, 
	
}