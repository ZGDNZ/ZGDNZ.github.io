/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */

function addAqiData() {
    
        var cityName = document.getElementById("aqi-city-input").value,
            aqiDegree = document.getElementById("aqi-value-input").value,
            cityError = document.getElementById("cityError"),
            aqiError = document.getElementById("aqiError"),
            cityflag = 1,
            aqiflag = 1;
        if(cityName == null){
            cityError.innerHTML = "城市名称不能为空";
            cityflag = 0;
        }else if(!cityName.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
            cityError.innerHTML = "城市名必须为中英文字符";
            cityflag = 0;
        }else{
            cityError.innerHTML = "";
            cityflag = 1;
        }

        if(aqiDegree == null){
            aqiError.innerHTML = "空气质量指数不能为空";
            aqiflag = 0;
        }else if(!aqiDegree.match(/^\d+$/)){
            aqiError.innerHTML = "空气质量指数必须为整数";
            aqiflag = 0;
        }else{
            aqiError.innerHTML = "";
            aqiflag = 1;
        }

        if((cityflag == 1) && (aqiflag == 1)){
            aqiData[cityName] = parseInt(aqiDegree);
        }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var aqiTable = document.getElementById("aqi-table"),
        list = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    aqiTable.innerHTML = list;
    for(var city in aqiData){
        aqiTable.innerHTML += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button>删除</button></td>"
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
     // do sth.
    delete aqiData[city];
    renderAqiList();
}

function init() {
    var addBtn = document.getElementById("add-btn"),
        aqiTable = document.getElementById("aqi-table");
        addBtn.onclick = addBtnHandle;
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    daqiTable.onclick = function(event){
        if(event.target.nodeName.toLowerCase() === 'button') 
            delBtnHandle(event.target.dataset.city);
    })
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}
window.onload = function(){
    init();
}