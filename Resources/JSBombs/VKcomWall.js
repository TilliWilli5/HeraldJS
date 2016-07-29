function VKcomWall()
{
    //debugger;
    var all = document.querySelector(".wl_replies_wrap .wl_replies").querySelectorAll("div[id^='post-']");
    var messages = Array.prototype.map.call(all, function(pItem){
        var _result = {author:"", article:""};
        _result.author = pItem.querySelector(".reply_author").textContent.trim();
        _result.article = pItem.querySelector(".reply_text").textContent.trim();
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