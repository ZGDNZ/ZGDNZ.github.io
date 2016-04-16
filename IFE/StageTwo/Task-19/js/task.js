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
        oUl = document.createElement("ul");

    /*
    *随机生成颜色
     */
    function colorCreate(){
        var color = Math.ceil(Math.random() * 4080).toString(16);
        return color;
    }


    wrap.appendChild(oUl);

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
    //
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

    function getData(){
        var data = [];
        for(var i = 0; i < oUl.children.length; i++){
            data[data.length] = parseInt(oUl.children[i].style.height);
        }
        return data;
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
    }




    function exchangeElem(elem1, elem2){
            var temp = elem1;
            oUl.insertBefore(elem1, elem2);
            oUl.insertBefore(elem2, temp);
    }
    /*
    *冒泡排序
     */
    function sortBubble(array){
        var len=array.length,
            i = len-1,
            j,
            timer1 = null,
            timer2 = null;
        if (len < 1) {
            return array;
        }
        var temp;
        clearTimeout(timer1);
        out();
        function out(){
            clearInterval(timer2);
            timer1 = setTimeout(function(){
                clearInterval(timer2);
                if(i >= 1){
                    j = 0;
                    timer2 = setInterval(function(){
                        clearTimeout(timer1);
                        if(j <= i){
                            if(array[j] > array[j+1]){
                                exchangeElem(oUl.children[j], oUl.children[j+1]);
                                temp = array[j+1];
                                array[j+1] = array[j];
                                array[j] = temp;
                            }
                        }else{
                            out();
                        }
                        j++;
                    },8);
                }
                else{
                    clearTimeout(timer1);
                }
                i--;
            },30);
        }
        return array;
    }
    function sort(event){
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        sortBubble(getData());
    }

    eventUtil.addHandler(leftIn, "click", select);
    eventUtil.addHandler(rightIn, "click", select);
    eventUtil.addHandler(leftOut, "click", select);
    eventUtil.addHandler(rightOut, "click", select);
    eventUtil.addHandler(oSort, "click", sort);
    eventUtil.addHandler(randomCreate, "click", initData);
}