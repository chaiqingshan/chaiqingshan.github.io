window.onload = function(){
	var ulpp = document.getElementById("policeAndPeople");
	var lis = ulpp.getElementsByTagName("li");
	var police = document.getElementById("police");
	var people = document.getElementById("people");
	for(var i=0;i<lis.length;i++){
		lis[i].onclick = function(){
			for(var k=0;k<lis.length;k++){
				lis[k].className="";
			}
			this.className="active";
			if(lis[0].className === "active"){
				police.className = "show";
				people.className = "hide";
			}else{
				police.className = "hide";
				people.className = "show";
			}
		}
		
	}
}