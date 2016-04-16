window.onload = function(){
    var queue = document.getElementsByName("queue")[0];
    var wrap = document.getElementById("wrap"),
        leftIn = queue.leftIn,
        leftOut = queue.leftOut,
        rightIn = queue.rightIn,
        rightOut = queue.rightOut,
        input = queue.input,
        oSort = queue.sort,
        randomCreate = queue.randomCreate,
        signal = "",
        sorting = false,
        oUl = document.createElement("ul");

    /*
    *随机生成颜色
     */
    function colorCreate(){
        var color = Math.ceil(Math.random() * 4080).toString(16);
        return color;
    }


    wrap.appendChild(oUl);
    /*
     *渲染
     */
    function createElement(signal,event){
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        var oLi = document.createElement("li");
        oLi.style.height = input.value * 5 + "px";
        oLi.style.marginLeft = "2px";
        oLi.style.backgroundColor = "#" + colorCreate();
        switch(signal){
            case "leftIn":
                oUl.insertBefore(oLi, oUl.firstChild);
                eventUtil.addHandler(oLi, "click", function(){
                    oUl.removeChild(oLi);
                });
                break;
            case "rightIn":
                oUl.appendChild(oLi);
                eventUtil.addHandler(oLi, "click", function(){
                    oUl.removeChild(oLi);
                });
                break;
            case "leftOut":
                oUl.removeChild(oUl.firstChild);
                break;
            case "rightOut":
                oUl.removeChild(oUl.lastChild);
                break;
            default:
                break;
        }
    }
    /*
     *检测输入
     */
    function select(event){
        var patten = (/^[0-9]+$/);
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        if(patten.test(input.value) && input.value >= 10 && input.value <= 100){
            signal = event.target.name;
            if((oUl.innerHTML == "") && (signal == "leftOut" || signal == "rightOut")){
                alert("已经没有元素可以弹出了！");
            }else if(oUl.children.length > 100){
                alert("不能超过100个元素！");
            }else{
                createElement(signal);
            }
        }else{
            alert("只能输入10到100之间的整数");
        }
    }


    /*
    *随机产生数据
     */
    function initData() {
        oUl.innerHTML = "";
        for (var i = 0; i < 60; i++) {
            input.value = Math.floor(Math.random() * 90 + 10);
            createElement("leftIn");
        }
        input.value = "";
    }

    /*
     *获取当前ul下全部li的高度
     */
    function getData(){
        var data = [];
        for(var i = 0; i < oUl.children.length; i++){
            data[data.length] = parseInt(oUl.children[i].style.height);
        }
        return data;
    }

    /*
     *交换两个节点的位置
     */
    function exchangeElem(elem1, elem2){
         var t1 = elem1.nextSibling,
             t2 = elem2.nextSibling;
        if(t1){
            oUl.insertBefore(elem2,t1);
        }else{
            oUl.appendChild(elem2);
        }
        if(t2){
            oUl.insertBefore(elem1,t2);
        }else{
            oUl.appendChild(elem1);
        }
    }

    var timer1 = null,
        timer2 = null;
    /*
     *冒泡排序
     */
    function sortBubble(data){
        var len = data.length,
            i = len-1;
        if (len < 1) {
            return data;
        }
        var temp;
        out();
        function out(){
            clearInterval(timer2);
            timer1 = setTimeout(function(){
                if(i >= 1){
                    var j = 0;
                    timer2 = setInterval(function(){
                        clearTimeout(timer1);
                        if(j <= i){
                            if(data[j] > data[j+1]){
                                exchangeElem(oUl.children[j], oUl.children[j+1]);
                                temp = data[j+1];
                                data[j+1] = data[j];
                                data[j] = temp;
                            }
                        }else{
                            clearTimeout(timer1);
                            out();
                        }
                        j++;
                    },8);
                }
                else{
                    sorting = false;
                    clearTimeout(timer1);
                }
                i--;
            },30);
        }
        return data;
    }

    /*
     *绑定事件
     */
    eventUtil.addHandler(leftIn, "click", select);
    eventUtil.addHandler(rightIn, "click", select);
    eventUtil.addHandler(leftOut, "click", select);
    eventUtil.addHandler(rightOut, "click", select);
    eventUtil.addHandler(randomCreate, "click", initData);
    eventUtil.addHandler(oSort, "click", function(event){
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        if(sorting){
            alert("in sorting");
            return 0;
        }
        sorting = true;
        sortBubble(getData());
    });
}