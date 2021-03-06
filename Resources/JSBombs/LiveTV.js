function LiveTV()
{
    //debugger;
    var allDMSG = document.querySelector("#commentsblock").querySelectorAll("table[id^='dmsg']");
    // var all = document.querySelector("#commentsblock").querySelectorAll("table[id^='msg'] td");
    var messages = Array.prototype.map.call(allDMSG, function(pItem){
        var _result = {author:"", article:""};
        _result.author = pItem.querySelector(".comment nobr a").textContent.trim();
        //var msg = pItem
        var checkCensured = pItem.querySelector("span[id^='censured']");
        if(checkCensured)
        {
            _result.article = checkCensured.innerText.replace(/\s+/g, ' ').trim();
        }
        else
        {
            _result.article = pItem.querySelector("table[id^='msg']").innerText.replace(/\s+/g, ' ').trim();
        }
        return _result;
    });
    messages.GetAuthors = function(){
        var _result = [];
        for(var record of this)
        {
            _result.push(record.author);
        }
        return _result;
    };
    messages.GetArticles = function(){
        var _result = [];
        for(var record of this)
        {
            _result.push(record.article);
        }
        return _result;
    };
    return messages;
}