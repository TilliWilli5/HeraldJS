function CHerald(pCore)
{
    this.Initialize(pCore);
    this.voices = [];
    this.AddListener("VoicesLoaded", function(){console.log("[Herald]: Voices loaded");});
    // this.OnVoicesLoaded = function(){console.log("[Herald]: Voices loaded");};
    var loadVoicesTimer = setInterval(function(pSelf){
        pSelf.voices = speechSynthesis.getVoices();
        if(pSelf.voices.length != 0)
        {
            clearInterval(loadVoicesTimer);
            pSelf.Emit("VoicesLoaded");
        }
    }, 1, this);
};
//Настройка наследования
CHerald.prototype = Object.create(CEventEmitter.prototype);
CHerald.prototype.constructor = CHerald;
//Статические функции самого класса
CHerald.textOverflowDecision = {
    donothing:0,//мы полностью доверяем поставщику фраз - никаких преобразований ненадо - потому что фразы точно не превышают норм по длине
    omit:1,//фраза будет усечена до пустой строки ""
    cut:2,//фраза будет усечена до нужной длинны, могут обрезаться слова
    cutappend:3//фраза будет усечена до нужной длинны и будет добавлен afterwords, могут обрезаться слова
};
//Начало описания core класса
CHerald.core = {};
CHerald.core.isDefault = true;
CHerald.core.lang = "";
CHerald.core.text = "";
CHerald.core.pitch = 1;
CHerald.core.rate = 1;
CHerald.core.volume = 0.95;
CHerald.core.voice = null;
CHerald.core.errorList = [];
CHerald.core.maxTextLength = 150;
CHerald.core.afterwords = ". и так далее";
CHerald.core.ifTextOverflow = CHerald.textOverflowDecision.cut;
CHerald.core.megaphone = speechSynthesis;
//State machine parameters with prefix _sm
CHerald.core._smPaused = false;
CHerald.core._smStopped = true;
CHerald.core._smSpeaking = false;

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
};
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
};
CHerald.prototype._PhrasePreConvert = function(pPhrase)
{
    if(pPhrase && pPhrase.length)
    {
        if(pPhrase.length > this.maxTextLength)
        {
            var theClass = this.GetClass();
            switch(this.ifTextOverflow)
            {
                case theClass.textOverflowDecision.donothing:{
                    /*This code here really do nothing - because its just a comment line*/
                    break;
                }
                case theClass.textOverflowDecision.omit:{
                    pPhrase = "";
                    break;
                }
                case theClass.textOverflowDecision.cut:{
                    pPhrase = pPhrase.substr(0, this.maxTextLength);
                    break;
                }
                case theClass.textOverflowDecision.cutappend:{
                    pPhrase = pPhrase.substr(0, this.maxTextLength - this.afterwords.length) + this.afterwords;
                    break;
                }
            }
        }
    }
    else
    {
        pPhrase = "";
    }
    return pPhrase;
};
CHerald.prototype._PhrasePreFilter = function(pPhrase)
{
    return pPhrase;
};
CHerald.prototype._CreatePhraseUtter = function(pPhrase)
{
    var utter = new SpeechSynthesisUtterance(pPhrase);
    utter.lang = this.lang;
    utter.voice = this.voice;
    utter.pitch = this.pitch;
    utter.rate = this.rate;
    utter.volume = this.volume;
    var self = this;
    utter.onend = function(){
        if(self._smSpeaking === true)
        {
            self._SayOneByOne();
        }
    };
    return utter;
};
CHerald.prototype._SayOneByOne = function()
{
    this._speech.index++;
    var phrase = this._speech[this._speech.index];
    phrase = this._PhrasePreConvert(phrase);
    phrase = this._PhrasePreFilter(phrase);
    if(this._speech.index < this._speech.length)
    {
        var utter = this._CreatePhraseUtter(phrase);
        this.megaphone.cancel();
        console.log(utter);
        this.megaphone.speak(utter);
    }
};
CHerald.prototype.Say = function(pPhrases){
    this._speech = pPhrases;
    this._speech.index = -1;
    this._smSpeaking = true;
    this._smStopped = false;
    this._smPaused = false;
    this._SayOneByOne();
    console.log("[Herald]: Saying");
    return this;
};
CHerald.prototype.Proclaim = CHerald.prototype.Say;
CHerald.prototype.ShutUp = function()
{
    this.megaphone.cancel();
    this._smSpeaking = false;
    this._smStopped = true;
    this._smPaused = false;
};
CHerald.prototype.Pause = function()
{
    this.megaphone.pause();
    this._smSpeaking = false;
    this._smStopped = false;
    this._smPaused = true;
};
CHerald.prototype.Resume = function()
{
    this.megaphone.resume();
    this._smSpeaking = true;
    this._smStopped = false;
    this._smPaused = false;
};
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
            console.log(`[Herald]: ${this.voice.voiceURI} (${this.voice.lang}) chosen`);
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