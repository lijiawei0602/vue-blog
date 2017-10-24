export default function(fn, time){
    let timer;
    let first = true;
    return function(){
        var args = arguments;
        if(first){
            fn.apply(this, arguments);
            return first = false;
        }
        if(timer){
            return false;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer  = null;
            fn.apply(this, args);
        }, time || 300)
    }
}