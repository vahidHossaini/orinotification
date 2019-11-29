module.exports = class defaultBootstrap{
  constructor(config)
  {
    this.funcs=[
      {
          name:'saveTemplate',
          title:'saveTemplate' ,
          inputs:[
			{
				name:'template',
				type:'TemplateInterface',
				nullable:false
			}
          ]
      },  
      {
          name:'send',
          title:'send' , 
      }, 
      {
          name:'getTemplate',
          title:'getTemplate' , 
      }, 
	  
	   
    ]
    this.auth=[ 
        ]
  }
}