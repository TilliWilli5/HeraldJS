// function CEventEmitter(pCore)
// {
//     this.Initialize(pCore);
// };
// //Настройка наследования
// CEventEmitter.prototype = Object.create(CBase.prototype);
// CEventEmitter.prototype.constructor = CEventEmitter;
var CEventEmitter = CBase.Extend(function (pCore){
    this.Initialize(pCore);
});
//Статические функции самого класса
CEventEmitter.heap = new WeakMap();
//Начало описания core класса
// CEventEmitter.core = {};
// CEventEmitter.core.isDefault = true;

CEventEmitter.prototype.AddListener = function(pEventName, pListener){
    function ExecShell(){
        pListener();
        this.count++;
    };
    ExecShell.count = 0;
    //this - ссылка на текущий объект, кый может быть любого класса (например я унаследовался от CEventEmitter и создал экземпляр)
    if(CEventEmitter.heap.has(this))
    {
        if(CEventEmitter.heap.get(this)[pEventName])
        {
            CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
        }
        else
        {
            //Вначале создаем массив кый будет содержать все callback ф-ии
            CEventEmitter.heap.get(this)[pEventName] = [];
            CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
        }
    }
    else
    {
        CEventEmitter.heap.set(this, {});
        CEventEmitter.heap.get(this)[pEventName] = [];
        CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
    }
    return this;
};
CEventEmitter.prototype.RemoveListener = function(pEventName, pListener){
    if(CEventEmitter.heap.has(this))
    {
        if(CEventEmitter.heap.get(this)[pEventName])
        {
            var iListener = CEventEmitter.heap.get(this)[pEventName].length;
            while(--iListener>=0)
            {
                if(CEventEmitter.heap.get(this)[pEventName][iListener] === pListener)
                {
                    CEventEmitter.heap.get(this)[pEventName].splice(iListener, 1);
                }
            }
            // for(var iX=0; iX<CEventEmitter.heap.get(this)[pEventName].length; ++iX)
            // {
            //     if(CEventEmitter.heap.get(this)[pEventName][iX] === pListener)
            //     {
            //         CEventEmitter.heap.get(this)[pEventName].splice(iX, 1);
            //     }
            // }
        }
    }
    return this;
};
CEventEmitter.prototype.RemoveAllListeners = function(pEventName, pListener){
    if(CEventEmitter.heap.has(this))
    {
        if(CEventEmitter.heap.get(this)[pEventName])
        {
            CEventEmitter.heap.get(this)[pEventName] = [];
        }
    }
    return this;
};
CEventEmitter.prototype.AddListenerOnce = function(pEventName, pListener){
    function ExecShell(){
        pListener();
        this.count++;
    };
    ExecShell.count = 0;
    ExecShell.onlyOnce = true;
    //this - ссылка на текущий объект, кый может быть любого класса (например я унаследовался от CEventEmitter и создал экземпляр)
    if(CEventEmitter.heap.has(this))
    {
        if(CEventEmitter.heap.get(this)[pEventName])
        {
            CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
        }
        else
        {
            //Вначале создаем массив кый будет содержать все callback ф-ии
            CEventEmitter.heap.get(this)[pEventName] = [];
            CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
        }
    }
    else
    {
        CEventEmitter.heap.set(this, {});
        CEventEmitter.heap.get(this)[pEventName] = [];
        CEventEmitter.heap.get(this)[pEventName].push(ExecShell);
    }
    return this;
};
CEventEmitter.prototype.ListenerCount = function(pEventName){
    if(!pEventName)
        return 0;
    if(CEventEmitter.heap.has(this))
    {
        return CEventEmitter.heap.get(this)[pEventName].length;
    }
    else
    {
        return 0;
    }
};
CEventEmitter.prototype.Emit = function(pEventName){
    if(CEventEmitter.heap.has(this))
    {
        var allListeners = CEventEmitter.heap.get(this)[pEventName];
        if(allListeners)
        {
            for(var listener of allListeners)
                listener();
            var iListener = allListeners.length;
            while(--iListener>=0)
            {
                if(allListeners[iListener].onlyOnce)
                    allListeners.splice(iListener, 1);
            }
        }
    }
    return this;
};
CEventEmitter.prototype.ReplaceListener;