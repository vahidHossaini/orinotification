var uuid=require("uuid");
class notificationRouter
{
    constructor(disc) {
        this.disc = disc 
    }
    send(context, template, data, func) {
        if (!func)
            func = () => {}
        this.disc.run('notification', 'send', {
            name: context,
            data: {
                obj: data,
                template: template
            }
        }, func)

    }
}
module.exports = class defaultIndex
{
	constructor(config,dist)
	{
		this.config=config.statics
		this.context=this.config.context 
		global.notification=new notificationRouter(dist)
        this.drivers = {}
        for (var a of config.drivers) {
            this.drivers[a.name] = new(require('./services/' + a.type + '.js'))(a.config)
        }
	}
	async getTemplate(msg,func,self)
	{
		var dt = msg.data; 
		await global.db.Search(self.context,'notification_template',{},dt );
		return func(null,{})
		
	}
	async saveTemplate(msg,func,self)
	{
		var dt = msg.data;
		var template=dt.template
		await global.db.Save(self.context,'notification_template',['name'],template);
		return func(null,{})
	}
	async send(msg,func,self)
	{

        if (!msg.name || !self.drivers[msg.name])
            return func({
                message: 'driver not exist'
            })
        self.drivers[msg.name].SendMessage(msg, func, self.drivers[msg.name])
	}
}