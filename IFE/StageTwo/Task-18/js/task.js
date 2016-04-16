window.onload = function(){
    var queue = document.getElementsByName("queue")[0];
    var wrap = document.getElementById("wrap"),
        leftIn = queue.leftIn,
        leftOut = queue.leftOut,
        rightIn = queue.rightIn,
        rightOut = queue.rightOut,
        input = queue.input,
        signal = "",
        oUl = document.createElement("ul");

    wrap.appendChild(oUl);

    function createElement(signal){
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        var oLi = document.createElement("li");
        oLi.innerHTML = input.value;
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

    function select(event){
        event = eventUtil.getEvent(event);
        eventUtil.preventDefault(event);
        signal = event.target.name;
        if((oUl.innerHTML == "") && (signal == "leftOut" || signal == "rightOut")){
            alert("已经没有元素可以弹出了！")
        }else{
            createElement(signal);
        }
    }


    eventUtil.addHandler(leftIn, "click", select);
    eventUtil.addHandler(rightIn, "click", select);
    eventUtil.addHandler(leftOut, "click", select);
    eventUtil.addHandler(rightOut, "click", select);
}