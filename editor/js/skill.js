/**
 * Represents the data for a dynamic skill
 *
 * @param {string} name - the name of the skill
 *
 * @constructor
 */
function Skill(name)
{
	this.components = [];

	// Included to simplify code when adding components
	this.html = document.getElementById('builderContent');
	
	this.dataKey = 'attributes';
	this.componentKey = 'components';
	
	// Skill data
	this.data = [
		new StringValue('名称', 'name', name).setTooltip('技能名称 [不可使用彩色代码]'),
		new StringValue('类别', 'type', 'AOE').setTooltip('技能类型 [在介绍中展示的内容,可随意填写]'),
		new IntValue('最大等级', 'max-level', 5).setTooltip('当前技能所能到达的最大等级'),
		new ListValue('前置技能', 'skill-req', ['None'], 'None').setTooltip('学习此技能前需要先学习哪个技能'),
		new IntValue('前置等级', 'skill-req-lvl', 1).setTooltip('学习此技能所需要的前置技能等级'),
		new ListValue('权限', 'needs-permission', ['True', 'False'], 'False').setTooltip('玩家是否需要 "skillapi.skill.{'+ name +'} 权限才能解锁此技能"'),
		new AttributeValue('等级要求', 'level', 1, 0).setTooltip('玩家解锁/升级此技能所需要的职业等级'),
		new AttributeValue('技能点数', 'cost', 1, 0).setTooltip('玩家解锁/升级此技能所需要的技能点数'),
		new AttributeValue('冷却', 'cooldown', 0, 0).setTooltip('技能冷却(秒) [仅限主动触发]'),
		new AttributeValue('消耗', 'mana', 0, 0).setTooltip('消耗魔力 [仅限主动触发]'),
		new AttributeValue('最少技能点数', 'points-spent-req', 0, 0).setTooltip('在学习此技能前最少使用技能点数'),
		new StringValue('释放信息', 'msg', '&6{player} &2使用了 &6{skill}').setTooltip('释放时向周围发送提示信息 [提示半径在 config.yml 中修改]'),
        new StringValue('组合键', 'combo', '').setTooltip('[付费版] 通过组合键释放技能 [L 左键 R 右键 S 下蹲 LS 左Shift RS 右Shift P 跳跃 Q 丢弃]	[使用空格隔开,若填 "L R LS P" 则可使用 左键＋右键＋左Shift＋跳跃 来释放技能]'),
        new ListValue('指示器', 'indicator', [ '2D', '3D', 'None' ], '2D').setTooltip('[付费版] 用于显示的类型 [适用于悬浮栏]'),
		new ListValue('图标', 'icon', getMaterials, 'Jack O Lantern').setTooltip('在GUI中显示的技能图标'),
		new IntValue('图标 Data', 'icon-data', 0).setTooltip('技能图标的副ID/耐久 [不会请默认]'),
		new StringListValue('技能 Lore', 'icon-lore', [
			'&d{name} &7({level}/{max})',
			'&2类型: &6{type}',
			'',
			'{req:level}等级: {attr:level}',
			'{req:cost}技能点: {attr:cost}',
			'',
			'&2法力值: {attr:mana}',
			'&2冷却: {attr:cooldown}'
		]).setTooltip('在GUI中的技能描述'),
		new StringListValue('相克技能', 'incompatible', []).setTooltip('不兼容技能 [学习此技能后不能学习的技能]')
	];
}

/**
 * Applies the skill data to the HTML page, overwriting any previous data
 */ 
Skill.prototype.apply = function() 
{
	var builder = document.getElementById('builderContent');
	builder.innerHTML = '';
	
	// Set up the builder content
	for (var i = 0; i < this.components.length; i++)
	{
		this.components[i].createBuilderHTML(builder);
	}
}

/**
 * Creates the form HTML for editing the skill and applies it to
 * the appropriate area on the page
 */
Skill.prototype.createFormHTML = function()
{
	var form = document.createElement('form');
	
	var header = document.createElement('h4');
	header.innerHTML = '技能 属性';
	form.appendChild(header);
	
    form.appendChild(document.createElement('hr'));
    form.appendChild(this.createEditButton(form));
    form.appendChild(document.createElement('hr'));
	
	this.data[3].list.splice(1, this.data[3].list.length - 1);
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i] != this) 
		{
			this.data[3].list.push(skills[i].data[0].value);
		}
	}
	for (var i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);
	}
	
	var hr = document.createElement('hr');
	form.appendChild(hr);
	
	form.appendChild(this.createEditButton(form));
	
	var target = document.getElementById('skillForm');
	target.innerHTML = '';
	target.appendChild(form);
}

Skill.prototype.createEditButton = function(form) {
    var done = document.createElement('h5');
	done.className = 'doneButton';
	done.innerHTML = '编辑 效果',
	done.skill = this;
	done.form = form;
	done.addEventListener('click', function(e) {
		this.skill.update();
		var list = document.getElementById('skillList');
		list[list.selectedIndex].text = this.skill.data[0].value;
		this.form.parentNode.removeChild(this.form);
		showSkillPage('builder');
	});
    return done;
}

/**
 * Updates the skill data from the details form if it exists
 */
Skill.prototype.update = function()
{
	var index;
	var list = document.getElementById('skillList');
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i] == this)
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
	if (isSkillNameTaken(newName)) return;
	this.data[0].value = newName;
	list[index].text = this.data[0].value;
}

/**
 * Checks whether or not the skill is using a given trigger
 *
 * @param {string} trigger - name of the trigger to check
 *
 * @returns {boolean} true if using it, false otherwise
 */ 
Skill.prototype.usingTrigger = function(trigger)
{
	for (var i = 0; i < this.components.length; i++)
	{
		if (this.components[i].name == trigger) return true;
	}
	return false;
}

/**
 * Creates and returns a save string for the skill
 */ 
Skill.prototype.getSaveString = function()
{
	var saveString = '';
	
	saveString += this.data[0].value + ":\n";
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i])) continue;
		saveString += this.data[i].getSaveString('  ');
	}
	saveString += '  attributes:\n';
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i]))
		{
			saveString += this.data[i].getSaveString('    ');
		}
	}
	if (this.components.length > 0)
	{
		saveString += '  components:\n';
		saveIndex = 0;
		for (var i = 0; i < this.components.length; i++)
		{
			saveString += this.components[i].getSaveString('    ');
		}
	}
	return saveString;
}

function isAttribute(input) {
    return (input instanceof AttributeValue) || (input.key == 'incompatible');
}

/**
 * Loads skill data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this skill
 */
Skill.prototype.load = function(data)
{
	if (data.active || data.embed || data.passive)
	{
		// Load old skill config for conversion
	}
	else 
	{
		this.loadBase(data);
	}
}

Skill.prototype.loadBase = loadSection;

/**
 * Creates a new skill and switches the view to it
 *
 * @returns {Skill} the new skill
 */ 
function newSkill()
{
	var id = 1;
	while (isSkillNameTaken('技能 ' + id)) id++;
	
	activeSkill = addSkill('技能 ' + id);
	
	var list = document.getElementById('skillList');
	list.selectedIndex = list.length - 2;
	
	activeSkill.apply();
	activeSkill.createFormHTML();
	showSkillPage('skillForm');
	
	return activeSkill;
}

/**
 * Adds a skill to the editor without switching the view to it
 *
 * @param {string} name - the name of the skill to add
 *
 * @returns {Skill} the added skill
 */ 
function addSkill(name) 
{
	var skill = new Skill(name);
	skills.push(skill);
	
	var option = document.createElement('option');
	option.text = name;
	var list = document.getElementById('skillList');
	list.add(option, list.length - 1);
	
	return skill;
}

/**
 * Checks whether or not a skill name is currently taken
 *
 * @param {string} name - name to check for
 *
 * @returns {boolean} true if the name is taken, false otherwise
 */ 
function isSkillNameTaken(name)
{
	return getSkill(name) != null;
}

/**
 * Retrieves a skill by name
 *
 * @param {string} name - name of the skill to retrieve
 *
 * @returns {Skill} the skill with the given name or null if not found
 */
function getSkill(name)
{
	name = name.toLowerCase();
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i].data[0].value.toLowerCase() == name) return skills[i];
	}
	return null;
}


var activeSkill = new Skill('技能 1');
var activeComponent = undefined;
var skills = [activeSkill];
activeSkill.createFormHTML();
showSkillPage('skillForm');
