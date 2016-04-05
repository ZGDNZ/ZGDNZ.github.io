window.onload = function () {
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
        day: [],
        week: [],
        month: []
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
// 用于渲染图表的数据
    var chartData = {
        day: [],
        week: [],
        month: []
    };

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: "北京",
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0],
            oUl = document.createElement("ul"),
            j = 1;
            wrap.innerHTML = "";
            wrap.appendChild(oUl);
        for(var i in chartData[pageState.nowGraTime]){
            var oLi = document.createElement("li");
            oLi.style.backgroundColor = "#" + color[pageState.nowGraTime][j++];
            oLi.style.height = parseInt(chartData[pageState.nowGraTime][i][1] * (document.body.clientHeight / oUl.offsetHeight)) + "px";
            oLi.style.width = ((pageState.nowGraTime === "day") ? 1 : ((pageState.nowGraTime === "week") ? 6 : 30)) + "%";
            oLi.style.marginLeft = ((pageState.nowGraTime === "day") ? "1px" : ((pageState.nowGraTime === "week") ? "1%" : "3%")) ;
            oUl.appendChild(oLi);
        }
        oUl.innerHTML += "<div class=" + "information" + "></div>";
        oUl.firstChild.style.marginLeft = "0px";
    }



    /**
     * 随机颜色生成函数
     */
    function colorCreate() {
        color["day"][0] = 91;
        color["week"][0] = 14;
        color["month"][0] = 3;
        for (var i in color) {
            var j = 1;
            while (j <= color[i][0]) {
                color[i][j] = Math.ceil(Math.random() * 4080);
                if (color[i][j] <= 255) {
                    color[i][j] = ( "0" + color[i][j].toString(16));
                } else {
                    color[i][j] = color[i][j].toString(16);
                }
                j++;

            }
        }
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        // 设置对应数据
        var formGraTime = document.getElementById("form-gra-time"),
            oRadio = formGraTime.children;
        for (var l = 1; l < oRadio.length; l++) {
            if (oRadio[l].children[0].checked) {
                pageState.nowGraTime = oRadio[l].children[0].value;
            }
        }
        // 调用图表渲染函数
        renderChart();
        infor();
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 设置对应数据
        initAqiChartData();
        // 调用图表渲染函数
        renderChart();
        infor();

    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var formGraTime = document.getElementById("form-gra-time");
        eventUtil.addHandler(formGraTime, "click", graTimeChange);
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        var citySelect = document.getElementById("city-select");
        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        eventUtil.addHandler(citySelect, "change", citySelectChange);
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
                pageState.nowSelectCity = oSelect[k].value;
            }
        }
        for (var dateType in chartData) {
            if (dateType === "day") {
                var i = 0;
                for (var day in aqiSourceData[pageState.nowSelectCity]) {
                    chartData[dateType][i] = [];
                    chartData[dateType][i][0] = day;
                    chartData[dateType][i][1] = aqiSourceData[pageState.nowSelectCity][day];
                    i++;
                }
            } else if (dateType === "week") {
                var weekBegin = 0,
                    weekEnd = 0,
                    weekSum = 0,
                    weekDays = 1,
                    i = 0;
                for (var day in aqiSourceData[pageState.nowSelectCity]) {
                    weekSum = weekSum + aqiSourceData[pageState.nowSelectCity][day];
                    if (day == "2016-01-01") {
                        weekBegin = 5;
                        weekEnd = 5;
                    }else if (weekEnd % 7 == 0 || weekDays == 91) {
                            chartData[dateType][i] = [];
                            chartData[dateType][i][0] = "第" + (i + 1) + "个星期";
                            chartData[dateType][i][1] = parseInt(weekSum / (7 - weekBegin + 1));
                            weekSum = 0;
                            weekBegin = 1;
                            weekEnd = 0;
                            i++;
                    }
                    weekEnd++;
                    weekDays++;
                }
            } else {
                var monthSum = 0,
                    i = 0;
                for (var day in aqiSourceData[pageState.nowSelectCity]) {
                    monthSum += aqiSourceData[pageState.nowSelectCity][day];
                    if (day === "2016-01-31" || day === "2016-02-29" || day === "2016-03-31") {
                        chartData[dateType][i] = [];
                        chartData[dateType][i][0] = "第" + (i + 1) + "个月";
                        monthSum /= (day > "2016-01-31") ?31:((day > "2016-02-29") ?29:31);
                        chartData[dateType][i][1] = parseInt(monthSum) ;
                        monthSum = 0;
                        i++;
                    }
                }
            }
        }
        return dateType;
    }


    var timer1 = null,
        timer2 = null;
    function infor() {
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0],
            oUl = wrap.children[0],
            oLi = oUl.children;
        for (var i = 0; i < oLi.length - 1; i++) {
            oLi[i].i = i;
            eventUtil.addHandler(oLi[i], "mousemove", movein);
            eventUtil.addHandler(oLi[i], "mouseout", moveout);

        }

    }
    function movein(event) {
        var wrap = document.getElementsByClassName("aqi-chart-wrap")[0];
        var oUl = wrap.children[0];
        clearTimeout(timer2);
        event = eventUtil.getEvent(event);
        //eventUtil.stopPropagation(event);


        var infor = document.getElementsByClassName("information")[0],
            mouseNow = mousePosition(event);

        if (this.innerHTML == "") {
            infor.innerHTML = chartData[pageState.nowGraTime][this.i][0] + ": " + chartData[pageState.nowGraTime][this.i][1];
            infor.style.width = "120px"
        }
        infor.style.display = "block";
        //timer1 = setInterval(function(){

        infor.style.left = mouseNow[0] - oUl.offsetLeft + "px";
        infor.style.top = mouseNow[1] - oUl.offsetTop + "px";
        if(parseInt(infor.style.left) >= (oUl.offsetWidth - infor.offsetWidth)){
            infor.style.left = mouseNow[0] - oUl.offsetLeft - infor.offsetWidth + "px";
        }
        if(parseInt(infor.style.top) >= (oUl.offsetHeight - infor.offsetHeight)){
            infor.style.top = mouseNow[1] - oUl.offsetTop - infor.offsetHeight + "px";
        }

        //},30)
    }

    function moveout(event) {
        event = eventUtil.getEvent(event);
        eventUtil.stopPropagation(event);
        //clearInterval(timer1);
        timer2 = setTimeout(function () {
            var infor = document.getElementsByClassName("information")[0];
            infor.style.display = "none";
        }, 300);

    }

    function mousePosition(evt) {
        var xPos, yPos;
        evt = evt || window.event;
        if (evt.pageX) {
            xPos = evt.pageX;
            yPos = evt.pageY;
        } else {
            xPos = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
            yPos = evt.clientY + document.body.scrollTop - document.body.clientTop - move.offsetHeight;
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
        renderChart();
        infor();

    }

    init();


}