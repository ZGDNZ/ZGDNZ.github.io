window.onload=function()
{
	var oDiv2 = document.getElementById('div2');
	var oImg = oDiv2.getElementsByTagName('img');
	var oDiv1 = document.getElementById('div1');
	var oDiv3 = document.getElementById('div3');
	var oSpan = oDiv3.getElementsByTagName('span')[0];

	var text = "自挂东南枝";
	var k = 0;
	var timer = null;
	setTimeout(function(){
		timer = setInterval(function(){
		oSpan.innerHTML = text.substr(0,k);
		k++;
		if(k>text.length)
		{
			clearInterval(timer);
		}
		},300);
	},400);
	
	setTimeout(function()
	{
		for(var i=0;i<(oImg.length);i++)
		{
			oImg[i].onmouseover = function()
			{
				startMove(this,{borderRadius : 20,opacity : 100},15);
			}
			oImg[i].onmouseout = function()
			{
				startMove(this,{borderRadius : 100,opacity : 60},15);
			}
		}
		startMove(oDiv1,{fontSize : 70,left : 465},8);
		startMove(oDiv3,{fontSize : 70,top : 433,left : 185},8,function(){
			oDiv3.innerHTML = oDiv3.innerHTML.replace('<br>', '');
			oDiv2.style.display = "block";
			startMove(oDiv2,{opacity : 100},150);
		})
		startMove(oSpan,{width : 350},8);
	},3000)
	
}