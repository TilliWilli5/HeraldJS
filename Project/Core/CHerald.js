function CHerald(pCore)
{
    this.Initialize(pCore);
    this.voices = [];
    this.OnVoicesLoaded = function(){console.log("[Herald]: Voices loaded");};
    var loadVoicesTimer = setInterval(function(pSelf){
        pSelf.voices = speechSynthesis.getVoices();
        if(pSelf.voices.length != 0)
        {
            clearInterval(loadVoicesTimer);
            pSelf.OnVoicesLoaded();
        }
    }, 1, this);
};
//Настройка наследования
CHerald.prototype = Object.create(CBase.prototype);
CHerald.prototype.constructor = CHerald;
//Статические функции самого класса
CHerald.textOverflowDecision = {
    omit:0,
    cut:1,
    cutappend:2
};
//Начало описания core класса
CHerald.core = {};
CHerald.core.isDefault = true;
CHerald.core.lang = "";
CHerald.core.text = "";
// CHerald.core._phrases = {};
CHerald.core.pitch = 1;
CHerald.core.rate = 1;
CHerald.core.volume = 0.95;
CHerald.core.voice = null;
CHerald.core.errorList = [];
CHerald.core.maxTextLength = 150;
CHerald.core.afterwords = ". и так далее";
CHerald.core.ifTextOverflow = CHerald.textOverflowDecision.cut;
//Бьёт входной текст на нужное количество абзацев
// CHerald.prototype.Prepare = function(pText)
// {
//     this.oration.phrases = pText.split(/[\.\;\!\?\,\:]+/g);
// };
// CHerald.prototype.megaphone =
CHerald.prototype.textOverflowDecision = CHerald.textOverflowDecision;
CHerald.prototype.Analyse = function(pPhrases)
{
    var _result = [];
    _result.maxLength = 0;
    _result.isOkay = true;
    _result.total = pPhrases.length;
    _result.badCount = 0;
    for(var item of pPhrases)
    {
        _result.push({
            phrase:item,
            symbolCount:item.length,
            isOkay:(item.length > this.maxTextLength?false:true)
        });
        if(_result.maxLength < item.length)
            _result.maxLength = item.length;
        if(item.length > this.maxTextLength)
            _result.badCount++;
    }
    _result.badPercent = parseInt(_result.badCount/_result.total*100) + "%";
    return _result;
}
CHerald.prototype.Check = function(pPhrases)
{
    if(Array.isArray(pPhrases))
    {
        for(var item of pPhrases)
        {
            if(item.length > this.maxTextLength)
                return false;
        }
    }
    return true;
}
CHerald.prototype._SayOneByOne = function()
{
    this._speech.index++;
    if(this._speech.index < this._speech.length)
    {
        var phrase = this._speech[this._speech.index];
        if(phrase.length > this.maxTextLength)
        {
            var theClass = this.GetClass();
            switch(this.ifTextOverflow)
            {
                case theClass.textOverflowDecision.omit: this._SayOneByOne(); return;
                case theClass.textOverflowDecision.cut:{
                    phrase = phrase.substr(0, this.maxTextLength);
                    break;
                }
                case theClass.textOverflowDecision.cutappend:{
                    phrase = phrase.substr(0, this.maxTextLength - this.afterwords.length) + this.afterwords;
                    break;
                }
            }
        }
        var utter = new SpeechSynthesisUtterance(phrase);
        utter.lang = this.lang;
        utter.voice = this.voice;
        utter.pitch = this.pitch;
        utter.rate = this.rate;
        utter.volume = this.volume;
        var self = this;
        utter.onend = function(){
            self._SayOneByOne();
        };
        speechSynthesis.cancel();
        console.log(utter);
        speechSynthesis.speak(utter);
    }
};
CHerald.prototype.Say = function(pPhrases){
    this._speech = pPhrases;
    this._speech.index = -1;
    this._SayOneByOne();
    console.log("[Herald]: Saying");
    return this;
};
CHerald.prototype.Proclaim = CHerald.prototype.Say;
CHerald.prototype.GetVoices = function()
{
    return this.voices;
};
CHerald.prototype.SelectVoice = function(pVoice)
{
    if(Number.isInteger(pVoice))
    {
        if(pVoice>=this.voices.length || pVoice < 0)
        {
            this.errorList.push("[Herald]: Index outside of range");
        }
        else
        {
            this.voice = this.voices[pVoice];
            this.lang = this.voices[pVoice].lang;
        }
    }
    else if(pVoice && pVoice.constructor)
    {
        if(pVoice.constructor.name === "SpeechSynthesisVoice")
        {
            this.voice = pVoice;
        }
        else
        {
            this.errorList.push("[Herald]: Bad argument");
        }
    }
    else
    {
        this.errorList.push("[Herald]: Bad argument");
    }
    return this;
};
CHerald.prototype.ClearErrorList = function()
{
    this.errorList = [];
};