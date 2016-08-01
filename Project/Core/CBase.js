//
//Объявление класса
//
function CBase(pCore)
{
    this.Initialize(pCore);
};
// module.exports = CBase;
//Статические функции самого класса
CBase.parentClass = null;
CBase.Extend = function(pConstructor, pSuppressMode)
{
	var newClassConstructor;
	if(typeof pConstructor === "function")
	{
		newClassConstructor = pConstructor;
		newClassConstructor.prototype = Object.create(this.prototype);
		newClassConstructor.prototype.constructor = pConstructor;
	}
	else if(typeof pConstructor === "string")
	{
		newClassConstructor = function(pCore){
			this.Initialize(pCore);
		};
		newClassConstructor.name = pConstructor;
		newClassConstructor.prototype = Object.create(this.prototype);
		newClassConstructor.prototype.constructor = newClassConstructor;
	}
	newClassConstructor.parentClass = this;
	newClassConstructor.core = {};
	//pSuppressMode == false - не наследовать core в новый класс
	if(!pSuppressMode)
		Object.assign(newClassConstructor.core, this.core);
	newClassConstructor.Extend = this.Extend;
	newClassConstructor.ParentClass = this.ParentClass;
	newClassConstructor.ParentClassName = this.ParentClassName;
	newClassConstructor.ReplaceCore = this.ReplaceCore;
	newClassConstructor.LoadCore = this.LoadCore;
	return newClassConstructor;
};
CBase.ParentClass = function()
{
	return this.parentClass;
};
CBase.ParentClassName = function()
{
	if(this.parentClass === null)
		return null;
	else
		return this.parentClass.name;
};
CBase.ReplaceCore = function(pCore)
{
	this.core = pCore;
};
CBase.LoadCore = function(pCore)
{
	Object.assign(this.core, pCore);
};
//Настройки по умолчанию для всех экземпляров класса кроются в этом ядре
//
CBase.core = {};
CBase.core.isDefault = true;
//Общедоступные функции разделяемые между всеми экзеплярами
//
CBase.prototype.Initialize = function(pCore)
{
	Object.assign(this, this.constructor.core);
	if(pCore)
	{
		Object.assign(this, pCore);
		this.isDefault = false;
	}
};
CBase.prototype.Setup = function(pCore)
{
    if(pCore)
	{
		Object.assign(this, pCore);
		this.isDefault = false;
	}
};
CBase.prototype.Class = function()
{
    return this.constructor;
};
CBase.prototype.ClassName = function()
{
    return this.constructor.name;
};
CBase.prototype.ParentClass = function()
{
	// return this.constructor.prototype.__proto__.constructor;
	//code below has the same effect
	return this.__proto__.__proto__.constructor;
};
CBase.prototype.ParentClassName = function()
{
	// return this.constructor.prototype.__proto__.constructor.className;
	return this.__proto__.__proto__.constructor.name;
};
//toString(),toJSON(),Serialize(),Deserialize()
//
CBase.prototype.toString = function()
{
	return this.constructor.name;
};
CBase.prototype.toString = function()
{
	return this.constructor.name;
};
CBase.prototype.toJSON = function()
{
	var _result = {};
	for(var property in this)
	{
		if(this.hasOwnProperty(property))
			_result[property] = this[property];
	}
	return JSON.stringify(_result);
};
CBase.prototype.Serialize = function()
{
	return this.toJSON();
};
CBase.prototype.Deserialize = function(pJSONCore)
{
	return new this.constructor(JSON.parse(pJSONCore));
};
