//常量：停止状态
var STOP = 0;
//常量：飞行状态
var START = 1;
//飞船类
function SpaceShip (orbit) {
	var obj ={
		//所在轨道
		_orbit:orbit,
		//动力系统
		drive:{
			//飞行
			start: function(){
				if (obj._energy > 0) {
					obj._status = START;
				}
			},
			//停止飞行
			stop: function(){
				obj._status = STOP;
			},
			//由宇宙管理员操作的飞行功能
			_fly: function(){
				if(obj._status == START){
					obj._angle += obj._rate;
				}
				obj._angle = obj._angle%360;
			}
		},
		//能源系统
		energy:{
			//添加能源
			add: function(num){
				obj._energy += num;
				if(obj._energy > 100){
					obj._energy = 100;
				}
			},
			consume: function(num){
				if(obj._status == START){
					obj._energy -= num;
				}
				if(obj._energy <= 0){
					obj._status = STOP;
					obj._energy = 0;
				}
			},
			//取当前能源值
			get: function() {
				return obj._energy;
			}
		},
		//信号系统
		telegraph:{
			//向飞船发送信号
			sendMessage: function(message){
				//检查消息是否是发给自己的
				if(message.id != obj._orbit){
					return;
				}
				//执行命令
				switch (message.command) {
					//开始飞行
					case 'start':
						obj.drive.start();// statements_1
						break;
					//停止飞行
					case 'stop':
						obj.drive.stop();// statements_def
						break;
					case 'destroy':
						obj.destroy.destroy();
						break;
					case 'rate':
						obj._rate = message.value;
						break;
				}
			}
		},
		//自爆系统
		destroy:{
			//立即销毁自身
			destroy:function(){
				obj._destroyed = true;
			}
		},
		//当前状态
		_status: STOP,
		//当前能源
		_energy: 100,
		//已经销毁
		_destroyed: false,
		//速度
		_rate: 1,
		//所在位置
		_angle:0
	};
	return obj;// body... 

}