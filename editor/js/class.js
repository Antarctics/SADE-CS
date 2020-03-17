/**
 * Represents the data for a dynamic class
 *
 * @param {string} name - name of the class
 *
 * @constructor
 */ 
function Class(name) 
{
	this.dataKey = 'attributes';
	this.componentKey = 'classes do not have components';
    this.attribCount = 0;
	
	// Class data
	this.data = [
		new StringValue('名称', 'name', name).setTooltip('职业名称 [不可使用彩色代码]'),
		new StringValue('称号', 'prefix', '&6' + name).setTooltip('职业前缀 [可使用彩色代码]'),
		new StringValue('种群', 'group', 'class').setTooltip('职业种群 [可用来划分种族/阵营等]'),
		new StringValue('魔力名称', 'mana', '&2Mana').setTooltip('当前职业所使用的魔力的名称'),
		new IntValue('最大等级', 'max-level', 40).setTooltip('当前职业所能达到的最大等级'),
		new ListValue('父职业', 'parent', ['None'], 'None').setTooltip('转职 [若A职业可以转职为B职业，则B的父职业为A]'),
		new ListValue('权限', 'needs-permission', ['True', 'False'], 'False').setTooltip('玩家是否需要 "skillapi.class.{名称}" 权限才能获取此职业'),
        new ByteListValue('经验获取', 'exp-source', [ '生物', '方块破坏', '方块放置', '合成', '指令', '特殊', '经验瓶', '冶炼', '任务' ], 273).setTooltip('能从何处获取职业经验。大部分需要前往 config.yml 启用 "use-exp-orbs" 才能生效'),
		new AttributeValue('体力值', 'health', 20, 0).setTooltip('基础体力值'),
		new AttributeValue('魔力值', 'mana', 20, 0).setTooltip('基础魔力值'),
		new DoubleValue('魔力恢复', 'mana-regen', 1, 0).setTooltip('每秒恢复的魔力值 [时间间隔可前往 config.yml 修改,默认为1秒]'),
		new ListValue('技能树', 'tree', [ 'Basic Horizontal', 'Basic Vertical', 'Level Horizontal', 'Level Vertical', 'Flood', 'Requirement' ], 'Requirement').setTooltip('技能树的排列方式'),
		new StringListValue('技能', 'skills', []).setTooltip('当前职业所能使用的技能 [一行一个]'),
		new ListValue('图标', 'icon', getMaterials, 'Jack O Lantern').setTooltip('在GUI中显示的职业图标'),
		new IntValue('图标 Data', 'icon-data', 0).setTooltip('职业图标的副ID/耐久 [不会填请默认]'),
		new StringListValue('图标 Lore', 'icon-lore', [
			'&4技能名称 : &2' + name,
			'&a技能列表 : &b'
		]).setTooltip('职业图标的描述'),
		new StringListValue('禁用物品', 'blacklist', [ ]).setTooltip('当前职业无法使用的物品 [一行一个]'),
		new StringValue('状态栏', 'action-bar', '').setTooltip('状态栏的格式 [空白则默认]')
	];
    
    this.updateAttribs(10);
}

Class.prototype.updateAttribs = function(i)
{
    var j = 0;
    var back = {};
    while (this.data[i + j] instanceof AttributeValue)
    {
        back[this.data[i + j].key.toLowerCase()] = this.data[i + j];
        j++;
    }
    this.data.splice(i, this.attribCount);
    this.attribCount = 0;
    for (j = 0; j < ATTRIBS.length; j++)
    {
        var attrib = ATTRIBS[j].toLowerCase();
        var format = attrib.charAt(0).toUpperCase() + attrib.substr(1);
        this.data.splice(i + j, 0, new AttributeValue(format, attrib.toLowerCase(), 0, 0)
            .setTooltip('这个职业所拥有的 ' + attrib + ' 数值')
        );
        if (back[attrib]) 
        {
            var old = back[attrib];
            this.data[i + j].base = old.base;
            this.data[i + j].scale = old.scale;
        }
        this.attribCount++;
    }
};

/**
 * Creates the form HTML for editing the class and applies it to
 * the appropriate area on the page
 */
Class.prototype.createFormHTML = function()
{
	var form = document.createElement('form');
	
	var header = document.createElement('h4');
	header.innerHTML = '职业 属性';
	form.appendChild(header);
	
	var h = document.createElement('hr');
	form.appendChild(h);
	
	this.data[5].list.splice(1, this.data[5].list.length - 1);
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i] != this) 
		{
			this.data[5].list.push(classes[i].data[0].value);
		}
	}
	for (var i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);
        
        // Append attributes
        if (this.data[i].name == '魔力值')
        {
            var dragInstructions = document.createElement('label');
            dragInstructions.id = 'attribute-label';
            dragInstructions.innerHTML = '拖入 attributes.yml 来导入属性';
            form.appendChild(dragInstructions);
            this.updateAttribs(i + 1);
        }
	}
	
	var hr = document.createElement('hr');
	form.appendChild(hr);
	
	var save = document.createElement('h5');
	save.innerHTML = '保存',
	save.classData = this;
	save.addEventListener('click', function(e) {
		this.classData.update();
		saveToFile(this.classData.data[0].value + '.yml', this.classData.getSaveString());
	});
	form.appendChild(save);
	
	var del = document.createElement('h5');
	del.innerHTML = '删除',
	del.className = 'cancelButton';
	del.addEventListener('click', function(e) {
		var list = document.getElementById('classList');
		var index = list.selectedIndex;
		
		classes.splice(index, 1);
		if (classes.length == 0)
		{
			newClass();
		}
		list.remove(index);
		index = Math.min(index, classes.length - 1);
		activeClass = classes[index];
		list.selectedIndex = index;
	});
	form.appendChild(del);
	
	var target = document.getElementById('classForm');
	target.innerHTML = '';
	target.appendChild(form);
};

/**
 * Updates the class data from the details form if it exists
 */
Class.prototype.update = function()
{
	var index;
	var list = document.getElementById('classList');
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i] == this)
		{
			index = i;
			break;
		}
	}
	var prevName = this.data[0].value;
	for (var j = 0; j < this.data.length; j++)
	{
		this.data[j].update();
	}
	var newName = this.data[0].value;
	this.data[0].value = prevName;
	if (isClassNameTaken(newName)) return;
	this.data[0].value = newName;
	list[index].text = this.data[0].value;
};

/**
 * Creates and returns a save string for the class
 */ 
Class.prototype.getSaveString = function()
{
	var saveString = '';
	
	saveString += this.data[0].value + ":\n";
	for (var i = 0; i < this.data.length; i++)
	{
		if (this.data[i] instanceof AttributeValue) continue;
		saveString += this.data[i].getSaveString('  ');
	}
	saveString += '  attributes:\n';
	for (var i = 0; i < this.data.length; i++)
	{
		if (this.data[i] instanceof AttributeValue)
		{
			saveString += this.data[i].getSaveString('    ');
		}
	}
	return saveString;
};

/**
 * Loads class data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this class
 */
Class.prototype.load = loadSection;

/**
 * Creates a new class and switches the view to it
 *
 * @returns {Class} the new class
 */ 
function newClass()
{
	var id = 1;
	while (isClassNameTaken('职业 ' + id)) id++;
	
	activeClass = addClass('职业 ' + id);
	
	var list = document.getElementById('classList');
	list.selectedIndex = list.length - 2;
	
	activeClass.createFormHTML();
	
	return activeClass;
}

/**
 * Adds a skill to the editor without switching the view to it
 *
 * @param {string} name - the name of the skill to add
 *
 * @returns {Skill} the added skill
 */ 
function addClass(name) 
{
	var c = new Class(name);
	classes.push(c);
	
	var option = document.createElement('option');
	option.text = name;
	var list = document.getElementById('classList');
	list.add(option, list.length - 1);
	
	return c;
}

/**
 * Checks whether or not a class name is currently taken
 *
 * @param {string} name - name to check for
 *
 * @returns {boolean} true if the name is taken, false otherwise
 */ 
function isClassNameTaken(name)
{
	return getClass(name) != null;
}

/**
 * Retrieves a class by name
 *
 * @param {string} name - name of the class to retrieve
 *
 * @returns {Class} the class with the given name or null if not found
 */
function getClass(name)
{
	name = name.toLowerCase();
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i].data[0].value.toLowerCase() == name) return classes[i];
	}
	return null;
}

var activeClass = new Class('Class 1');
var classes = [activeClass];
activeClass.createFormHTML();
