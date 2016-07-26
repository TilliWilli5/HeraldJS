//
//Объявление класса
//
function CBase(pCore)
{
    this.Initialize(pCore);
};
// module.exports = CBase;
//Настройки по умолчанию для всех экземпляров класса кроются в этом ядре
//
CBase.core = {};
CBase.core.isDefault = true;
//Общедоступные функции разделяемые между всеми экзеплярами
//
CBase.prototype.Initialize = function(pCore)
{
	if(pCore)
	{
		Object.assign(this, pCore);
		this.isDefault = false;
	}
	else
	{
		Object.assign(this, this.constructor.core);
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
CBase.prototype.GetClass = function()
{
    return this.constructor;
};
CBase.prototype.GetClassName = function()
{
    return this.constructor.name;
};
CBase.prototype.GetParentClass = function()
{
	// return this.constructor.prototype.__proto__.constructor;
	//code below has the same effect
	return this.__proto__.__proto__.constructor;
};
CBase.prototype.GetParentClassName = function()
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
