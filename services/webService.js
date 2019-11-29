
module.exports = class nofifyWebService
{
    constructor(config)
    {
        this.context=config.context
        this.config=config 
        this.connection={}
        if(config.protocol=='http')
        {
            this.connection = require('http');
            this.connection.post = require('http-post'); 
        }
        if(config.protocol=='https')
        {
            this.connection = require('https');
            this.connection.post = require('https-post'); 
        }
    }
    async SendMessage(msg, func,self)
    {
        var data=msg.data
        var data=msg.data
		var tmp=await global.db.SearchOne(self.context,'notification_template',{where:{name:data.template}})
		if(!tmp)
			return func({m:"notification001"})
		
		var obj=data.obj
		for(var x in obj)
		{
			tmp.title= tmp.title.replaceAll('{{'+x+'}}',obj[x])
			tmp.text= tmp.text.replaceAll('{{'+x+'}}',obj[x])
			tmp.html= tmp.html.replaceAll('{{'+x+'}}',obj[x])
		}
		var option=JSON.parse(JSON.stringify(self.config.option))
		option[self.config.toField]=obj.to
		option[self.config.textField]=tmp.text
		if(self.config.titleField)
			option[self.config.titleField]=tmp.title
		if(self.config.htmlField)
			option[self.config.htmlField]=tmp.html 
		var log={
			type:"webService",
			text:tmp.text,
			html:tmp.html,
			title:tmp.title,
			to:obj.to
		}
		this.connection.post(this.config.sendUrl,option,async function(res){
			res.setEncoding('utf8');
			var dt=''
			res.on('data', function(chunk) { 
				dt+=chunk  
			});
			res.on('end', () => {
				
					await global.db.Save(self.context,'notification_log',["_id"],log)
				 return func(null,dt)
			})
		}); 
		 
    }
}