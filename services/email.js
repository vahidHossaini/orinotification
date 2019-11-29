const nodemailer = require('nodemailer');
const uuid = require("uuid");
module.exports = class emailService
{
  constructor(config)
  {
    this.context=config.context
    this.config=config 
    console.log()
    this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port | 465,
            secure: config.secure | true, // true for 465, false for other ports
            auth: {
                user: config.username, // generated ethereal user
                pass: config.password  // generated ethereal password
            }
        });
  }
  
    async SendMessage(msg, func,self)
    {
		
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
		let mailOptions = {
			from: self.config.fromEmail, // sender address
			to: obj.to, // list of receivers
			subject: tmp.title, // Subject line
			text: tmp.text, // plain text body
			html: tmp.html // html body
		};
		var log={
			type:"email",
			text:tmp.text,
			html:tmp.html,
			title:tmp.title,
			to:obj.to
		}
		self.transporter.sendMail(mailOptions, async(error, info) => {
			if (error) {
				log.error=error;
				await global.db.Save(self.context,'notification_log',["_id"],log)
				return func({message:'notification002'})
			}  
			await global.db.Save(self.context,'notification_log',["_id"],log)
			return func(null,{isDone:true}) 
		}); 
    }
}