window.onload = function(){
    /* 数据格式演示
     var aqiSourceData = {
     "北京": {
     "2016-01-01": 10,
     "2016-01-02": 10,
     "2016-01-03": 10,
     "2016-01-04": 10
     }
     };
     */
    var color = {
        day:[92],
        week:[14],
        month:[3]
    };

    colorCreate();
// 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(400),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(400),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(400)
    };
console.log(aqiSourceData);
// 用于渲染图表的数据
    var chartData = {
        day:[],
        week:[],
        month:[]
    };

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart(changed) {
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0];
        var citySelect = document.getElementById("city-select"),
            oUl = document.createElement("ul"),
            formGraTime = document.getElementById("form-gra-time"),
            oRadio = formGraTime.children,
            oSelect = citySelect.children,
            j = 0,
            city = "";
        for(var i = 0; i < oSelect.length; i++) {
            if (oSelect[i].selected) {
                city = oSelect[i].value;
            }
        }
        for(var l = 1; l < oRadio.length; l++) {
            if (oRadio[l].children[0].checked) {
                // 调用图表渲染函数
                changed = oRadio[l].children[0].value;
            }
        }
        wrap.innerHTML = "";
        wrap.appendChild(oUl);
        switch(changed){
            case "week":var weekSum = 0,
                            weekDays = 1,
                            weekBegin = 0,
                            weekEnd = 0,
                            lastWeekBegin = 92 - (92+4)%7;
                        for (var weekCount in aqiSourceData[city]) {
                            weekSum = weekSum + aqiSourceData[city][weekCount];
                            if(weekCount == "2016-01-01"){
                                weekBegin = 5;
                                weekEnd = 5;
                            }else {
                                if (weekEnd % 7 == 0) {
                                    var oLi = document.createElement("li");
                                    oLi.style.backgroundColor = "#" + color["week"][j];
                                    oLi.style.width = "6%";
                                    oLi.style.marginLeft = "1%"
                                    oLi.style.height = parseInt(weekSum / (7 - weekBegin + 1) * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                                    oUl.appendChild(oLi);
                                    weekSum = 0;
                                    weekBegin = 1;
                                    weekEnd = 0;
                                    j++;
                                }else if(weekDays >= lastWeekBegin){
                                    if(weekDays == 91){
                                        var oLi = document.createElement("li");
                                        oLi.style.backgroundColor = "#" + color["week"][j];
                                        oLi.style.width = "6%";
                                        oLi.style.marginLeft = "1%"
                                        oLi.style.height = parseInt(weekSum / (7 - weekBegin + 1) * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                                        oUl.appendChild(oLi);
                                        weekSum = 0;
                                    }
                                }
                            }
                            weekEnd++;
                            weekDays++;
                        };
                        break;
            case "month":var monthSum = 0;
                            for (var monthCount in aqiSourceData[city]) {
                                monthSum += aqiSourceData[city][monthCount];
                                if(monthCount === "2016-01-31"){
                                    var oLi = document.createElement("li");
                                    oLi.style.backgroundColor = "#" + color["week"][j++];
                                    oLi.style.height = parseInt(monthSum/31 * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                                    oLi.style.width = "30%";
                                    oUl.appendChild(oLi);
                                    monthSum = 0;
                                }else if(monthCount === "2016-02-29"){
                                    var oLi = document.createElement("li");
                                    oLi.style.backgroundColor = "#" + color["week"][j++];
                                    oLi.style.height = parseInt(monthSum/29 * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                                    oLi.style.width = "30%";
                                    oLi.style.marginLeft = "3%";
                                    oUl.appendChild(oLi);
                                    monthSum = 0;
                                }else if(monthCount === "2016-03-31"){
                                    var oLi = document.createElement("li");
                                    oLi.style.backgroundColor = "#" + color["week"][j++];
                                    oLi.style.height = parseInt(monthSum/31 * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                                    oLi.style.width = "30%";
                                    oLi.style.marginLeft = "3%";
                                    oUl.appendChild(oLi);
                                    monthSum = 0;
                                }
                            };
                        break;
            default:for (var i in aqiSourceData[city]) {
                        var oLi = document.createElement("li");
                        oLi.style.backgroundColor = "#" + color["day"][j++];
                        oLi.style.height = parseInt(aqiSourceData[city][i] * (document.body.clientHeight / oUl.offsetHeight)) + "px";
                        oUl.appendChild(oLi);
                    };
                    break;
        }
        oUl.innerHTML += "<div class="+"information"+"></div>";
    }
    renderChart("day");
    /**
     * 随机颜色生成函数
     */
    function colorCreate(){
        for(var i in color) {
            if(i === "day") {
                color["day"].length = 0;
                while(color["day"].length < 92){
                    color["day"][color["day"].length] = Math.ceil(Math.random() * 4080);
                    if(color["day"][color["day"].length-1] <= 255){
                        color["day"][color["day"].length-1] =  ( "0" + color["day"][color["day"].length-1].toString(16));
                    }else{
                        color["day"][color["day"].length-1] = color["day"][color["day"].length-1].toString(16);
                    }
                }
            }else if(i === "week"){
                color["week"].length = 0;
                while(color["week"].length < 14){
                    color["week"][color["week"].length] = Math.ceil(Math.random() * 4080);
                    if(color["week"][color["week"].length-1] <= 255){
                        color["week"][color["week"].length-1] =  ( "0" + color["week"][color["week"].length-1].toString(16));
                    }else{
                        color["week"][color["week"].length-1] = color["week"][color["week"].length-1].toString(16);
                    }
                }
            }else{
                color["month"].length = 0;
                while(color["month"].length < 3){
                    color["month"][color["month"].length] = Math.ceil(Math.random() * 4080);
                    if(color["month"][color["month"].length-1] <= 255){
                        color["month"][color["month"].length-1] =  ( "0" + color["month"][color["month"].length-1].toString(16));
                    }else{
                        color["month"][color["month"].length-1] = color["month"][color["month"].length-1].toString(16);
                    }
                }
            }

        }
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        // 确定是否选项发生了变化
        // 设置对应数据
        // 调用图表渲染函数
        renderChart(this.value);
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化
        renderChart(this.value);
        // 设置对应数据
        // 调用图表渲染函数
    }
    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var formGraTime = document.getElementById("form-gra-time");
        eventUtil.addHandler(formGraTime,"click",graTimeChange);
        eventUtil.addHandler(formGraTime,"click",infor);
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        var citySelect = document.getElementById("city-select");
        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        eventUtil.addHandler(citySelect,"change",citySelectChange);
        eventUtil.addHandler(citySelect,"change",infor);
    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        var citySelect = document.getElementById("city-select"),
            oSelect = citySelect.children;
        for (var k = 0; k < oSelect.length; k++) {
            if (oSelect[k].selected) {
                var city = oSelect[k].value;
            }
        }

        for (var dateType in chartData) {
            if (dateType === "day") {
                var i = 0;
                for (var day in aqiSourceData[city]) {
                    chartData[dateType][i] = [];
                    chartData[dateType][i][0] = day;
                    chartData[dateType][i][1] = aqiSourceData[city][day];
                    i++;
                }
            } else if (dateType === "week") {
                var weekBegin = 0,
                    weekEnd = 0,
                    weekSum = 0,
                    weekDays = 1,
                    i = 0;
                for (var day in aqiSourceData[city]) {
                    weekSum = weekSum + aqiSourceData[city][day];
                    if (day == "2016-01-01") {
                        weekBegin = 5;
                        weekEnd = 5;
                    } else {
                        if (weekEnd % 7 == 0) {
                            chartData[dateType][i] = [];
                            chartData[dateType][i][0] = "第" + (i+1) + "个星期";
                            chartData[dateType][i][1] = parseInt(weekSum / (7 - weekBegin + 1));
                            weekSum = 0;
                            weekBegin = 1;
                            weekEnd = 0;
                            i++;
                        } else if (weekDays >= 87) {
                            if (weekDays == 91) {
                                chartData[dateType][i] = [];
                                chartData[dateType][i][0] = "第" + (i+1) + "个星期";
                                chartData[dateType][i][1] = parseInt(weekSum / (7 - weekBegin + 1));
                                weekSum = 0;
                                i++;
                            }
                        }
                    }
                    weekEnd++;
                    weekDays++;
                }
            } else {
                var monthSum = 0,
                    i = 0;
                for (var day in aqiSourceData[city]) {
                    monthSum += aqiSourceData[city][day];
                    if (day === "2016-01-31") {
                        chartData[dateType][i] = [];
                        chartData[dateType][i][0] = "第" + (i+1) + "个月";
                        chartData[dateType][i][1] = parseInt(monthSum/31);
                        monthSum = 0;
                        i++;
                    } else if (day === "2016-02-29") {
                        chartData[dateType][i] = [];
                        chartData[dateType][i][0] = "第" + (i+1) + "个月";
                        chartData[dateType][i][1] = parseInt(monthSum/29) ;
                        monthSum = 0;
                        i++;
                    } else if (day === "2016-03-31") {
                        chartData[dateType][i] = [];
                        chartData[dateType][i][0] = "第" + (i+1) + "个月";
                        chartData[dateType][i][1] = parseInt(monthSum/31);
                        monthSum = 0;
                        i++;
                    }
                }
            }

        }

    }


    var timer1 = null,
        timer2 = null;
    function movein(event) {
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0];
        var oUl = wrap.children[0];
        clearTimeout(timer2);
        event = eventUtil.getEvent(event);
        //eventUtil.stopPropagation(event);

        var formGraTime = document.getElementById("form-gra-time"),
            oRadio = formGraTime.children;
        var infor = document.getElementsByClassName("information")[0],
            mouseNow = mousePosition(event);
        for (var l = 1; l < oRadio.length; l++) {
            if (oRadio[l].children[0].checked) {
                // 调用图表渲染函数
                var dayType = oRadio[l].children[0].value;
            }
        }
        console.log("in")
        if(this.innerHTML == ""){
            infor.innerHTML = chartData[dayType][this.i][0] + ": " + chartData[dayType][this.i][1];
        }
        infor.style.display = "block";
        //timer1 = setInterval(function(){
            infor.style.left = mouseNow[0] - oUl.offsetLeft + "px";
            infor.style.top = mouseNow[1] - oUl.offsetTop + "px";
            if (parseInt(infor.style.right) <= 0) {
                infor.style.right = "0px";
            }
        //},30)
    }
    function moveout(event){
        event = eventUtil.getEvent(event);
        eventUtil.stopPropagation(event);
        //clearInterval(timer1);
        timer2 = setTimeout(function(){
            console.log("out");
            var infor = document.getElementsByClassName("information")[0];
            infor.style.display = "none";
        },300);

    }
    function mousePosition(evt) {
        var xPos, yPos;
        evt = evt || window.event;
        if (evt.pageX) {
            xPos = evt.pageX;
            yPos = evt.pageY;
        } else {
            xPos = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
            yPos = evt.clientY + document.body.scrollTop - document.body.clientTop;
        }
        return [xPos, yPos];
    }

    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
        infor();

    }

    init();
    console.log(chartData);
    function infor(){
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0],
            oUl = wrap.children[0],
            oLi = oUl.children;
        for(var i = 0; i < oLi.length-1; i++){
            oLi[i].i = i;
            eventUtil.addHandler(oLi[i], "mousemove", movein);
            eventUtil.addHandler(oLi[i], "mouseout", moveout);

        }

    }


}