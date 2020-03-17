var hoverSpace;

var DAMAGE_TYPES = [ 'Block Explosion', 'Contact', 'Cramming', 'Dragon Breath', 'Drowning', 'Entity Attack', 'Entity Explosion', 'Fall', 'Falling Block', 'Fire', 'Fire Tick', 'Fly Into Wall', 'Hot Floor', 'Lava', 'Lightning', 'Magic', 'Melting', 'Poison', 'Projectile', 'Starvation', 'Suffocation', 'Suicide', 'Thorns', 'Void', 'Wither' ];

function canDrop(thing, target) {
    if (thing == target) return false;

    var temp = target;
    while (temp.parentNode) {
        temp = temp.parentNode;
        if (temp == thing) return false;
    }
    return true;
}

/**
 * Types of components
 */
var Type = {
    TRIGGER   : 'trigger',
    TARGET    : 'target',
    CONDITION : 'condition',
    MECHANIC  : 'mechanic'
};

/**
 * Available triggers for activating skill effects
 */
var Trigger = {
    BLOCK_BREAK          : { name: '破坏方块触发',          container: true, construct: TriggerBlockBreak,        premium: true },
    BLOCK_PLACE          : { name: '放置方块触发',          container: true, construct: TriggerBlockPlace,        premium: true },
    CAST                 : { name: '主动触发',                 container: true, construct: TriggerCast               },
    CLEANUP              : { name: '清除触发',              container: true, construct: TriggerCleanup            },
    CROUCH               : { name: '下蹲触发',               container: true, construct: TriggerCrouch             },
    DEATH                : { name: '死亡触发',                container: true, construct: TriggerDeath              },
    ENVIRONMENT_DAMAGE   : { name: '受到环境伤害触发',   container: true, construct: TriggerEnvironmentDamage, premium: true },
    INITIALIZE           : { name: '复活触发',           container: true, construct: TriggerInitialize         },
    KILL                 : { name: '击杀触发',                 container: true, construct: TriggerKill               },
    LAND                 : { name: '落地触发',                 container: true, construct: TriggerLand               },
    LAUNCH               : { name: '射击触发',               container: true, construct: TriggerLaunch             },
    MOVE                 : { name: '移动触发',                 container: true, construct: TriggerMove,              premium: true },
    PHYSICAL_DAMAGE      : { name: '造成物理伤害触发',      container: true, construct: TriggerPhysicalDamage     },
    SKILL_DAMAGE         : { name: '造成技能伤害触发',         container: true, construct: TriggerSkillDamage        },
    TOOK_PHYSICAL_DAMAGE : { name: '受到物理伤害触发', container: true, construct: TriggerTookPhysicalDamage },
    TOOK_SKILL_DAMAGE    : { name: '受到技能伤害触发',    container: true, construct: TriggerTookSkillDamage    }
};

/**
 * Available target component data
 */
var Target = {
    AREA     : { name: '区域',     container: true, construct: TargetArea     },
    CONE     : { name: '圆锥',     container: true, construct: TargetCone     },
    LINEAR   : { name: '直线',   container: true, construct: TargetLinear   },
    LOCATION : { name: '坐标', container: true, construct: TargetLocation },
    NEAREST  : { name: '最近',  container: true, construct: TargetNearest  },
    OFFSET   : { name: '偏移',   container: true, construct: TargetOffset   },
    REMEMBER : { name: '锁定', container: true, construct: TargetRemember },
    SELF     : { name: '自身',     container: true, construct: TargetSelf     },
    SINGLE   : { name: '单体',   container: true, construct: TargetSingle   }
};

/**
 * Available condition component data
 */
var Condition = {
    ARMOR:       { name: '护甲',       container: true, construct: ConditionArmor      },
    ATTRIBUTE:   { name: '属性',   container: true, construct: ConditionAttribute  },
    BIOME:       { name: '群系',       container: true, construct: ConditionBiome      },
    BLOCK:       { name: '方块',       container: true, construct: ConditionBlock      },
    CEILING:     { name: '顶棚',     container: true, construct: ConditionCeiling,   premium: true },
    CHANCE:      { name: '几率',      container: true, construct: ConditionChance     },
    CLASS:       { name: '职业',       container: true, construct: ConditionClass      },
    CLASS_LEVEL: { name: '职业等级', container: true, construct: ConditionClassLevel },
    COMBAT:      { name: '战斗',      container: true, construct: ConditionCombat     },
    CROUCH:      { name: '下蹲',      container: true, construct: ConditionCrouch     },
    DIRECTION:   { name: '方向',   container: true, construct: ConditionDirection  },
    ELEVATION:   { name: '高度',   container: true, construct: ConditionElevation  },
    ELSE:        { name: '否则',        container: true, construct: ConditionElse,      premium: true },
    ENTITY_TYPE: { name: '实体类型', container: true, construct: ConditionEntityType,premium: true },
    FIRE:        { name: '燃烧',        container: true, construct: ConditionFire       },
    FLAG:        { name: '标记',        container: true, construct: ConditionFlag       },
    GROUND:      { name: '地面',      container: true, construct: ConditionGround,    premium: true },
    HEALTH:      { name: '体力',      container: true, construct: ConditionHealth     },
    INVENTORY:   { name: '背包物品',   container: true, construct: ConditionInventory  },
    ITEM:        { name: '手持物品',        container: true, construct: ConditionItem       },
    LIGHT:       { name: '亮度',       container: true, construct: ConditionLight      },
    MANA:        { name: '魔力',        container: true, construct: ConditionMana       },
    NAME:        { name: '名称',        container: true, construct: ConditionName       },
    OFFHAND:     { name: '副手',     container: true, construct: ConditionOffhand    },
    PERMISSION:  { name: '权限',  container: true, construct: ConditionPermission,premium: true },
    POTION:      { name: '药水',      container: true, construct: ConditionPotion     },
    SKILL_LEVEL: { name: '技能等级', container: true, construct: ConditionSkillLevel },
    SLOT:        { name: '槽位',        container: true, construct: ConditionSlot,      premium: true },
    STATUS:      { name: '状态',      container: true, construct: ConditionStatus     },
    TIME:        { name: '时间',        container: true, construct: ConditionTime       },
    TOOL:        { name: '工具',        container: true, construct: ConditionTool       },
    VALUE:       { name: '属性范围',       container: true, construct: ConditionValue      },
    WATER:       { name: '水',       container: true, construct: ConditionWater      },
    WEATHER:     { name: '天气',     container: true, construct: ConditionWeather,   premium: true }
};

/**
 * Available mechanic component data
 */
var Mechanic = {
    ATTRIBUTE:           { name: '属性加成',           container: false, construct: MechanicAttribute          },
    BLOCK:               { name: '方块替换',               container: false, construct: MechanicBlock              },
    BUFF:                { name: 'Buff',                container: false, construct: MechanicBuff,              premium: true },
    CANCEL:              { name: '取消',              container: false, construct: MechanicCancel             },
    CHANNEL:             { name: '吟唱',             container: true,  construct: MechanicChannel            },
    CLEANSE:             { name: '负面净化',             container: false, construct: MechanicCleanse            },
    COMMAND:             { name: '指令',             container: false, construct: MechanicCommand            },
    COOLDOWN:            { name: '冷却缩减',            container: false, construct: MechanicCooldown           },
    DAMAGE:              { name: '造成伤害',              container: false, construct: MechanicDamage             },
    DAMAGE_BUFF:         { name: '伤害加成',         container: false, construct: MechanicDamageBuff         },
    DAMAGE_LORE:         { name: '伤害Lore',         container: false, construct: MechanicDamageLore         },
    DEFENSE_BUFF:        { name: '防御加成',        container: false, construct: MechanicDefenseBuff        },
    DELAY:               { name: '延迟',               container: true,  construct: MechanicDelay              },
    DISGUISE:            { name: '伪装',            container: false, construct: MechanicDisguise           },
    DURABILITY:          { name: '降低耐久',          container: false, construct: MechanicDurability,        premium: true },
    EXPLOSION:           { name: '爆炸',           container: false, construct: MechanicExplosion          },
    FIRE:                { name: '点燃',                container: false, construct: MechanicFire               },
    FLAG:                { name: '标记',                container: false, construct: MechanicFlag               },
    FLAG_CLEAR:          { name: '清除标记',          container: false, construct: MechanicFlagClear          },
    FLAG_TOGGLE:         { name: '切换标记',         container: false, construct: MechanicFlagToggle         },
    FOOD:                { name: '饱食度',                container: false, construct: MechanicFood,              premium: true },
    FORGET_TARGETS:      { name: '遗忘目标',      container: false, construct: MechanicForgetTargets,     premium: true },
    REMEMBER_TARGETS:    { name: '记忆目标',    container: false, construct: MechanicRememberTargets    },
    HEAL:                { name: '生命恢复',                container: false, construct: MechanicHeal               },
    HEALTH_SET:          { name: '生命设置',          container: false, construct: MechanicHealthSet,         premium: true },
    HELD_ITEM:           { name: '手持物品',           container: false, construct: MechanicHeldItem,          premium: true },
    IMMUNITY:            { name: '免疫伤害',            container: false, construct: MechanicImmunity           },
    INTERRUPT:           { name: '吟唱打断',           container: false, construct: MechanicInterrupt          },
    ITEM:                { name: '物品给予',                container: false, construct: MechanicItem               },
    ITEM_PROJECTILE:     { name: '抛射物',     container: true,  construct: MechanicItemProjectile     },
    ITEM_REMOVE:         { name: '物品删除',         container: false, construct: MechanicItemRemove         },
    LAUNCH:              { name: '冲刺',              container: false, construct: MechanicLaunch             },
    LIGHTNING:           { name: '闪电',           container: false, construct: MechanicLightning          },
    MANA:                { name: '魔力回复',                container: false, construct: MechanicMana               },
    MESSAGE:             { name: '消息提示',             container: false, construct: MechanicMessage            },
    PARTICLE:            { name: '粒子',            container: false, construct: MechanicParticle           },
    PARTICLE_ANIMATION:  { name: '粒子动画',  container: false, construct: MechanicParticleAnimation  },
    PARTICLE_EFFECT:     { name: '粒子效果',     container: false, construct: MechanicParticleEffect,    premium: true },
    CANCEL_EFFECT:       { name: '取消粒子效果',       container: false, construct: MechanicCancelEffect,      premium: true },
    PARTICLE_PROJECTILE: { name: '粒子抛射', container: true,  construct: MechanicParticleProjectile },
    PASSIVE:             { name: '被动',             container: true,  construct: MechanicPassive            },
    PERMISSION:          { name: '权限',          container: false, construct: MechanicPermission         },
    POTION:              { name: '药水效果',              container: false, construct: MechanicPotion             },
    POTION_PROJECTILE:   { name: '药水抛射',   container: true,  construct: MechanicPotionProjectile   },
    PROJECTILE:          { name: '抛射物',          container: true,  construct: MechanicProjectile         },
    PURGE:               { name: '全面净化',               container: false, construct: MechanicPurge              },
    PUSH:                { name: '击退',                container: false, construct: MechanicPush               },
    REPEAT:              { name: '循环',              container: true,  construct: MechanicRepeat             },
    SOUND:               { name: '音效',               container: false, construct: MechanicSound              },
    SPEED:               { name: '移速',               container: false, construct: MechanicSpeed              },
    STATUS:              { name: '状态',              container: false, construct: MechanicStatus             },
    TAUNT:               { name: '嘲讽',               container: false, construct: MechanicTaunt              },
    TRIGGER:             { name: '监听',             container: true,  construct: MechanicTrigger,           premium: true },
    VALUE_ADD:           { name: '添加变量值',           container: false, construct: MechanicValueAdd           },
    VALUE_ATTRIBUTE:     { name: '获取属性值',     container: false, construct: MechanicValueAttribute     },
    VALUE_COPY:          { name: '复制变量值',          container: false, construct: MechanicValueCopy,         premium: true },
    VALUE_DISTANCE:      { name: '获取距离值',      container: false, construct: MechanicValueDistance,     premium: true },
    VALUE_HEALTH:        { name: '获取生命值',        container: false, construct: MechanicValueHealth,       premium: true },
    VALUE_LOCATION:      { name: '获取坐标值',      container: false, construct: MechanicValueLocation      },
    VALUE_LORE:          { name: '获取描述值',          container: false, construct: MechanicValueLore          },
    VALUE_LORE_SLOT:     { name: '获取描述行值',     container: false, construct: MechanicValueLoreSlot,     premium: true},
    VALUE_MANA:          { name: '获取魔力值',          container: false, construct: MechanicValueMana,         premium: true },
    VALUE_MULTIPLY:      { name: '获取倍率值',      container: false, construct: MechanicValueMultiply      },
    VALUE_PLACEHOLDER:   { name: '获取占位符值',   container: false, construct: MechanicValuePlaceholder,  premium: true },
    VALUE_RANDOM:        { name: '添加随机值',        container: false, construct: MechanicValueRandom        },
    VALUE_SET:           { name: '设置变量值',           container: false, construct: MechanicValueSet           },
    WARP:                { name: '传送',                container: false, construct: MechanicWarp               },
    WARP_LOC:            { name: '坐标传送',       container: false, construct: MechanicWarpLoc            },
    WARP_RANDOM:         { name: '随机传送',         container: false, construct: MechanicWarpRandom         },
    WARP_SWAP:           { name: '互换传送',           container: false, construct: MechanicWarpSwap           },
    WARP_TARGET:         { name: '目标传送',         container: false, construct: MechanicWarpTarget         },
    WARP_VALUE:          { name: '变量传送',          container: false, construct: MechanicWarpValue          },
    WOLF:                { name: '狼',                container: true,  construct: MechanicWolf               }
};

var saveIndex;

/**
 * Represents a component of a dynamic skill
 *
 * @param {string}    name      - name of the component
 * @param {string}    type      - type of the component
 * @param {boolean}   container - whether or not the component can contain others
 * @param {Component} [parent]  - parent of the component if any
 *
 * @constructor
 */
function Component(name, type, container, parent)
{
    this.name = name;
    this.type = type;
    this.container = container;
    this.parent = parent;
    this.html = undefined;
    this.components = [];
    this.data = [new StringValue('图标 Key', 'icon-key', '').setTooltip('用于在图标Lore中进行应用的Key值 [可以使用 "{attr:X.Y}" 引用,X为所填Key值,Y为上方绿色文字].')];
    if (this.type == Type.MECHANIC) {
        this.data.push(new ListValue('主动释放', 'counts', [ 'True', 'False' ], 'True')
            .setTooltip('是否需要主动释放技能 [被动技能请选择False]')
        );
    }
    else if (this.type == Type.TRIGGER && name != 'Cast' && name != 'Initialize' && name != 'Cleanup')
    {
        this.data.push(new ListValue('魔力需求', 'mana', [ 'True', 'False' ], 'False')
            .setTooltip('是否需要魔力释放技能')
        );
        this.data.push(new ListValue('冷却需求', 'cooldown', [ 'True', 'False' ], 'False')
            .setTooltip('是否需要冷却结束才能释放技能')
        );
    }

    this.dataKey = 'data';
    this.componentKey = 'children';
}

Component.prototype.dupe = function(parent)
{
    var i;
    var ele = new Component(this.name, this.type, this.container, parent);
    for (i = 0; i < this.components.length; i++)
    {
        ele.components.push(this.components[i].dupe(ele));
    }
    ele.data = ele.data.slice(0, 1);
    for (i = ele.data.length; i < this.data.length; i++)
    {
        ele.data.push(copyRequirements(this.data[i], this.data[i].dupe()));
    }
    ele.description = this.description;
    return ele;
};

/**
 * Creates the builder HTML element for the component and
 * appends it onto the target HTML element.
 *
 * @param {Element} target - the HTML element to append the result to
 */
Component.prototype.createBuilderHTML = function(target)
{
    // Create the wrapping divs with the appropriate classes
    var container = document.createElement('div');
    container.comp = this;
    if (this.type == Type.TRIGGER) {
        container.className = 'componentWrapper';
    }

    var div = document.createElement('div');
    div.className = 'component ' + this.type;
    if (this.type != Type.TRIGGER) {
        div.draggable = true;
        div.ondragstart = this.drag;
    }
    div.ondrop = this.drop;
    if (this.container) {
        div.ondragover = this.allowDrop;
    }

    // Component label
    var label = document.createElement('h3');
    label.title = 'Edit ' + this.name + ' options';
    label.className = this.type + 'Label';
    label.innerHTML = this.name;
    label.component = this;
    label.addEventListener('click', function(e) {
        this.component.createFormHTML();
        showSkillPage('skillForm');
    });
    div.appendChild(label);

    // Container components can add children so they get a button
    if (this.container)
    {
        var add = document.createElement('div');
        add.className = 'builderButton';
        add.innerHTML = '＋ 新 项目';
        add.component = this;
        add.addEventListener('click', function(e) {
            activeComponent = this.component;
            showSkillPage('componentChooser');
        });
        div.appendChild(add);

        var vision = document.createElement('div');
        vision.title = '隐藏 项目';
        vision.className = 'builderButton smallButton';
        vision.style.background = 'url("editor/img/eye.png") no-repeat center #222';
        vision.component = this;
        vision.addEventListener('click', function(e) {
            var comp = this.component;
            if (comp.childrenHidden)
            {
                comp.childDiv.style.display = 'block';
                this.style.backgroundImage = 'url("editor/img/eye.png")';
            }
            else
            {
                comp.childDiv.style.display = 'none';
                this.style.backgroundImage = 'url("editor/img/eyeShaded.png")';
            }
            comp.childrenHidden = !comp.childrenHidden;
        });
        div.appendChild(vision);
        this.childrenHidden = false;
    }

    // Add the duplicate button
    if (this.type != Type.TRIGGER)
    {
        var duplicate = document.createElement('div');
        duplicate.className = 'builderButton smallButton';
        duplicate.title = 'Duplicate';
        duplicate.style.background = 'url("editor/img/duplicate.png") no-repeat center #222';
        duplicate.component = this;
        duplicate.addEventListener('click', function(e) {
            var comp = this.component;
            var copy = comp.dupe(comp.parent);
            comp.parent.components.push(copy);
            copy.createBuilderHTML(comp.parent.html);
        });
        div.appendChild(duplicate);
    }

    // Add the remove button
    var remove = document.createElement('div');
    remove.title = '移除 项目';
    remove.className = 'builderButton smallButton cancelButton';
    remove.style.background = 'url("editor/img/delete.png") no-repeat center #f00';
    remove.component = this;
    remove.addEventListener('click', function(e) {
        var list = this.component.parent.components;
        for (var i = 0; i < list.length; i++)
        {
            if (list[i] == this.component)
            {
                list.splice(i, 1);
                break;
            }
        }
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    });
    div.appendChild(remove);

    container.appendChild(div);

    // Apply child components
    var childContainer = document.createElement('div');
    childContainer.className = 'componentChildren';
    if (this.components.length > 0) {
        for (var i = 0; i < this.components.length; i++)
        {
            this.components[i].createBuilderHTML(childContainer);
        }
    }
    container.appendChild(childContainer);
    this.childDiv = childContainer;

    // Append the content
    target.appendChild(container);

    this.html = childContainer;
};

Component.prototype.allowDrop = function(e) {
    e.preventDefault();
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace.onmouseout = undefined;
    }
    hoverSpace = e.target;
    while (hoverSpace.className.indexOf('component') < 0) {
        hoverSpace = hoverSpace.parentNode;
    }
    var thing = document.getElementById('dragComponent');
    if (hoverSpace.id != 'dragComponent' && hoverSpace.parentNode.comp.container && canDrop(thing, hoverSpace)) {
        hoverSpace.style.marginBottom = '30px';
        hoverSpace.onmouseout = function() {
            if (!hoverSpace) {
                this.onmouseout = undefined;
                return;
            }
            hoverSpace.style.marginBottom = '0px';
            hoverSpace.onmouseout = undefined;
            hoverSpace = undefined;
        }
    }
    else hoverSpace = undefined;
};

Component.prototype.drag = function(e) {
    e.dataTransfer.setData('text', 'anything');
    var dragged = document.getElementById('dragComponent');
    if (dragged) {
        dragged.id = '';
    }
    e.target.id = 'dragComponent';
};

Component.prototype.drop = function(e) {
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace = undefined;
    }

    e.preventDefault();
    var thing = document.getElementById('dragComponent').parentNode;
    var target = e.target;
    while (target.className.indexOf('component') < 0) {
        target = target.parentNode;
    }
    if (target.id == 'dragComponent' || !target.parentNode.comp.container || !canDrop(thing, target)) {
        return;
    }
    var targetComp = target.parentNode.comp;
    var thingComp = thing.comp;
    target = target.parentNode.childNodes[1];
    thing.parentNode.removeChild(thing);
    target.appendChild(thing);

    thingComp.parent.components.splice(thingComp.parent.components.indexOf(thingComp), 1);
    thingComp.parent = targetComp;
    thingComp.parent.components.push(thingComp);
};

/**
 * Creates the form HTML for editing the component data and
 * applies it to the appropriate part of the page.
 */
Component.prototype.createFormHTML = function()
{
    var target = document.getElementById('skillForm');

    var form = document.createElement('form');

    var header = document.createElement('h4');
    header.innerHTML = this.name;
    form.appendChild(header);

    if (this.description)
    {
        var desc = document.createElement('p');
        desc.innerHTML = this.description;
        form.appendChild(desc);
    }

    if (this.data.length > 1)
    {
        var h = document.createElement('hr');
        form.appendChild(h);

        var i = 1;
        for (var j = 1; j < this.data.length; j++) {
            if (this.data[j] instanceof AttributeValue) {
                i = 0;
                break;
            }
        }
        for (; i < this.data.length; i++)
        {
            this.data[i].hidden = false;
            this.data[i].createHTML(form);
        }
    }

    var hr = document.createElement('hr');
    form.appendChild(hr);

    var done = document.createElement('h5');
    done.className = 'doneButton';
    done.innerHTML = '完成';
    done.component = this;
    done.addEventListener('click', function(e) {
        this.component.update();
        document.getElementById('skillForm').removeChild(this.component.form);
        showSkillPage('builder');
    });
    form.appendChild(done);

    this.form = form;

    target.innerHTML = '';
    target.appendChild(form);
    activeComponent = this;

    for (var i = 0; i < this.data.length; i++)
    {
        this.data[i].applyRequireValues();
    }
}

/**
 * Updates the component using the form data if it exists
 */
Component.prototype.update = function()
{
    for (var j = 0; j < this.data.length; j++)
    {
        this.data[j].update();
    }
};

/**
 * Gets the save string for the component
 *
 * @param {string} spacing - spacing to put before the data
 */
Component.prototype.getSaveString = function(spacing)
{
    this.createFormHTML();

    var id = '';
    var index = saveIndex;
    while (index > 0 || id.length == 0)
    {
        id += String.fromCharCode((index % 26) + 97);
        index = Math.floor(index / 26);
    }
    var result = spacing + this.name + '-' + id + ":\n";
    saveIndex++;

    result += spacing + "  type: '" + this.type + "'\n";
    if (this.data.length > 0)
    {
        result += spacing + '  data:\n';
        for (var i = 0; i < this.data.length; i++)
        {
            if (!this.data[i].hidden)
                result += this.data[i].getSaveString(spacing + '    ');
        }
    }
    if (this.components.length > 0)
    {
        result += spacing + '  children:\n';
        for (var j = 0; j < this.components.length; j++)
        {
            result += this.components[j].getSaveString(spacing + '    ');
        }
    }
    return result;
};

/**
 * Loads component data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this component
 */
Component.prototype.load = loadSection;

// -- Custom constructor ------------------------------------------------------- //

extend('CustomComponent', 'Component');
function CustomComponent(data) {
    this.super(data.display, data.type.toLowerCase(), data.container);
    this.description = data.description;

    for (var i = 0; i < data.options.length; i++) {
        var option = data.options[i];
        switch (option.type) {
            case 'NUMBER':
                this.data.push(new AttributeValue(option.display, option.key, option.base, option.scale)
                    .setTooltip(option.description)
                );
                break;
            case 'TEXT':
                this.data.push(new StringValue(option.display, option.key, option.default)
                    .setTooltip(option.description)
                );
                break;
            case 'DROPDOWN':
                this.data.push(new ListValue(option.display, option.key, option.options, option.options[0])
                    .setTooltip(option.description)
                );
                break;
            case 'LIST':
                this.data.push(new MultiListValue(option.display, option.key, option.options, [ ])
                    .setTooltip(option.description)
                );
                break;
            default:
                throw new Error("Invalid component with key " + data.key);
        }
    }
}

// -- Trigger constructors ----------------------------------------------------- //

extend('TriggerBlockBreak', 'Component');
function TriggerBlockBreak() {
    this.super('Block Break', Type.TRIGGER, true);
    this.description = '当玩家破坏方块时，触发效果';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('破坏方块的类型')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('破坏的数量 [-1为任何数量]')
    );
}

extend('TriggerBlockPlace', 'Component');
function TriggerBlockPlace() {
    this.super('Block Place', Type.TRIGGER, true);
    this.description = '当玩家放置方块时，触发效果';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('放置方块的类型')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('放置的数量 [-1为任何数量]')
    );
}

extend('TriggerCast', 'Component');
function TriggerCast()
{
    this.super('Cast', Type.TRIGGER, true);

    this.description = '当玩家使用指令/技能栏/组合键使用技能时，触发效果';
}

extend('TriggerCleanup', 'Component');
function TriggerCleanup()
{
    this.super('Cleanup', Type.TRIGGER, true);

    this.description = '当玩家删除/遗忘技能时，触发效果';
}

extend('TriggerCrouch', 'Component');
function TriggerCrouch()
{
    this.super('Crouch', Type.TRIGGER, true);

    this.description = '当玩家开始/结束下蹲时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .setTooltip('下蹲类型 [按下Shift/松开Shift/单击Shift]')
    );
}

extend('TriggerDeath', 'Component');
function TriggerDeath()
{
    this.super('Death', Type.TRIGGER, true);

    this.description = '当玩家死亡时，触发效果';
}

extend('TriggerEnvironmentDamage', 'Component');
function TriggerEnvironmentDamage()
{
    this.super('Environment Damage', Type.TRIGGER, true);

    this.description = '当玩家受到环境伤害时，触发效果';

    this.data.push(new ListValue('类型', 'type', DAMAGE_TYPES, 'FALL')
        .setTooltip('伤害类型')
    );
}


extend('TriggerInitialize', 'Component');
function TriggerInitialize()
{
    this.super('Initialize', Type.TRIGGER, true);

    this.description = '当玩家复活时，触发效果 [可用于制作被动技能]';
}

extend('TriggerKill', 'Component');
function TriggerKill()
{
    this.super('Kill', Type.TRIGGER, true);

    this.description = '当玩家击杀实体时，触发效果';
}

extend('TriggerLand', 'Component');
function TriggerLand()
{
    this.super('Land', Type.TRIGGER, true);

    this.description = '当玩家落地时，触发效果';

    this.data.push(new DoubleValue('最小高度', 'min-distance', 0)
        .setTooltip('触发效果的最小高度')
    );
}

extend('TriggerLaunch', 'Component');
function TriggerLaunch()
{
    this.super('Launch', Type.TRIGGER, true);

    this.description = '当玩家射击/投掷时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .setTooltip('射击/投掷类型')
    );
}

extend('TriggerMove', 'Component');
function TriggerMove()
{
    this.super('Move', Type.TRIGGER, true);

    this.description = '当玩家移动时，触发效果 [可以使用"api-moved"来查看/使用移动距离]';
}

extend('TriggerPhysicalDamage', 'Component');
function TriggerPhysicalDamage()
{
    this.super('Physical Damage', Type.TRIGGER, true);

    this.description = '当玩家造成物理伤害时，触发效果 [非技能伤害]';

    this.data.push(new ListValue('施法目标', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('施法目标 [True为自身,False为受害者]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('伤害类型 [所有/近战/远程]')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('触发所需的最小伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('触发所需的最大伤害')
    );
}

extend('TriggerSkillDamage', 'Component');
function TriggerSkillDamage()
{
    this.super('Skill Damage', Type.TRIGGER, true);

    this.description = '当玩家造成技能伤害时，触发效果';

    this.data.push(new ListValue('施法目标', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('施法目标 [True为自身,False为受害者]')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('触发所需的最小伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('触发所需的最大伤害')
    );
    this.data.push(new StringListValue('允许技能', 'category', [ '默认' ] )
        .setTooltip('允许触发的技能名称 [一行一个,留空默认全部].')
    );
}

extend('TriggerTookPhysicalDamage', 'Component');
function TriggerTookPhysicalDamage()
{
    this.super('Took Physical Damage', Type.TRIGGER, true);

    this.description = '当玩家受到物理伤害时，触发效果 [非技能伤害]';

    this.data.push(new ListValue('施法目标', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('施法目标 [True为自身,False为攻击者]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('伤害类型 [所有/近战/远程]')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('触发所需的最小伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('触发所需的最大伤害')
    );
}

extend('TriggerTookSkillDamage', 'Component');
function TriggerTookSkillDamage()
{
    this.super('Took Skill Damage', Type.TRIGGER, true);

    this.description = '当玩家受到技能伤害时，触发效果';

    this.data.push(new ListValue('施法目标', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('施法目标 [True为自身,False为攻击者]')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('触发所需的最小伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('触发所需的最大伤害')
    );
    this.data.push(new StringListValue('允许技能', 'category', [ '默认' ] )
        .setTooltip('允许触发的技能名称 [一行一个,留空默认全部].')
    );
}

// -- Target constructors ------------------------------------------------------ //

extend('TargetArea', 'Component');
function TargetArea()
{
    this.super('Area', Type.TARGET, true);

    this.description = '以施法者为半径范围内的所有生物';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('半径范围 [格数]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击的群组 [盟友 敌人 全部]')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否能穿墙选取目标')
    );
    this.data.push(new ListValue("施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('是否包括施法者')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('最多生效人数')
    );
    this.data.push(new ListValue("随机", "random", [ 'True', 'False' ], 'False')
        .setTooltip('是否随机选取范围内目标')
    );
}

extend('TargetCone', 'Component');
function TargetCone()
{
    this.super('Cone', Type.TARGET, true);

    this.description = '施法者前方所有生物 [圆锥]';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('长度距离 [格数]')
    );
    this.data.push(new AttributeValue("角度", "angle", 90, 0)
        .setTooltip('圆锥角度 [度数]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击的群组 [盟友 敌人 全部]')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否能穿墙选取目标')
    );
    this.data.push(new ListValue("施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('是否包括施法者')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('最多生效人数')
    );
}

extend('TargetLinear', 'Component');
function TargetLinear()
{
    this.super('Linear', Type.TARGET, true);

    this.description = '施法者前方所有生物 [直线]';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('长度距离 [格数]')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('宽度距离 [格数]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击的群组 [盟友 敌人 全部]')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否能穿墙选取目标')
    );
    this.data.push(new ListValue("施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('是否包括施法者')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('最多生效人数')
    );
}

extend('TargetLocation', 'Component');
function TargetLocation()
{
    this.super('Location', Type.TARGET, true);

    this.description = '目标/施法者所在坐标';

    this.data.push(new AttributeValue('距离', 'range', 5, 0)
        .setTooltip('最远距离 [格数]')
    );
    this.data.push(new ListValue('地面生效', 'ground', [ 'True', 'False' ], 'True')
        .setTooltip('仅限地面坐标 [True为仅地面,False为所有]')
    );
}

extend('TargetNearest', 'Component');
function TargetNearest()
{
    this.super('Nearest', Type.TARGET, true);

    this.description = '施法者最近的生物';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('半径范围 [格数]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击的群组 [盟友 敌人 全部]')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否能穿墙选取目标')
    );
    this.data.push(new ListValue("施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('是否包括施法者')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('最多生效人数')
    );
}

extend('TargetOffset', 'Component');
function TargetOffset()
{
    this.super('Offset', Type.TARGET, true);

    this.description = '获取所有目标的偏移量';

    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('向目标前方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 2, 0.5)
        .setTooltip('向目标上方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('向目标右方偏移 [负数相反]')
    );
}

extend('TargetRemember', 'Component');
function TargetRemember()
{
    this.super('Remember', Type.TARGET, true);

    this.description = '使用 "Remember Targets [记忆目标]" 的Key值选定目标，若无则失败';

    this.data.push(new StringValue('Key', 'key', 'target')
        .setTooltip('"Remember Targets [记忆目标]" 的Key值')
    );
}

extend('TargetSelf', 'Component');
function TargetSelf()
{
    this.super('Self', Type.TARGET, true);

    this.description = '将施法者选为目标';
}

extend('TargetSingle', 'Component');
function TargetSingle()
{
    this.super('Single', Type.TARGET, true);

    this.description = '施法者前方的目标 [施法者为默认目标]';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('长度距离 [格数]')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('宽度距离 [格数]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击的群组 [盟友 敌人 全部]')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否能穿墙选取目标')
    );
}

// -- Condition constructors --------------------------------------------------- //

extend('ConditionArmor', 'Component');
function ConditionArmor()
{
    this.super('Armor', Type.CONDITION, true);
    this.description = "当玩家装备相应护甲时，触发效果";

    this.data.push(new ListValue('护甲位置', 'armor', [ 'Helmet', 'Chestplate', 'Leggings', 'Boots', 'Any' ], 'Any')
        .setTooltip('护甲位置 [头盔/护甲/护腿/靴子/任意]')
    );

    addItemOptions(this);
}

extend('ConditionAttribute', 'Component');
function ConditionAttribute()
{
    this.super('Attribute', Type.CONDITION, true);

    this.description = '当玩家具有相应属性数值时，触发效果';

    this.data.push(new StringValue('属性', 'attribute', 'Vitality')
        .setTooltip('属性名称')
    );
    this.data.push(new AttributeValue('最小值', 'min', 0, 0)
        .setTooltip('属性最小值')
    );
    this.data.push(new AttributeValue('最大值', 'max', 999, 0)
        .setTooltip('属性最大值')
    );
}

extend('ConditionBiome', 'Component');
function ConditionBiome()
{
    this.super('Biome', Type.CONDITION, true);

    this.description = '当玩家在相应的生物群系时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'In Biome', 'Not In Biome' ], 'In Biome')
        .setTooltip('目标是否在生物群系中 [是/否]')
    );
    this.data.push(new MultiListValue('群系', 'biome', getBiomes, [ 'Forest' ])
            .setTooltip('生物群系')
    );
}

extend('ConditionBlock', 'Component');
function ConditionBlock()
{
    this.super('Block', Type.CONDITION, true);

    this.description = '当玩家站在相应方块上时，触发效果';

    this.data.push(new ListValue('类型', 'standing', [ 'On Block', 'Not On Block', 'In Block', 'Not In Block' ], 'On Block')
        .setTooltip('触发类型 [身下有/身下没有/在方块上/不在方块上]')
    );
    this.data.push(new ListValue('方块类型', 'material', getMaterials, 'Dirt')
        .setTooltip('相应的方块类型')
    );
}

extend('ConditionCeiling', 'Component');
function ConditionCeiling()
{
    this.super('Ceiling', Type.CONDITION, true);

    this.description = '当玩家头顶方块到达相应高度时，触发效果';

    this.data.push(new AttributeValue('距离', 'distance', 5, 0)
        .setTooltip('检测头顶方块高度 [格数]')
    );
    this.data.push(new ListValue('如何', 'at-least', [ 'True', 'False' ], 'True')
        .setTooltip('至少/至多 [True则高度至少为距离,False则高度至多为距离]')
    );
}

extend('ConditionChance', 'Component');
function ConditionChance()
{
    this.super('Chance', Type.CONDITION, true);

    this.description = '有几率触发效果';

    this.data.push(new AttributeValue('几率', 'chance', 25, 0)
        .setTooltip('触发几率 [百分比]')
    );
}

extend('ConditionClass', 'Component');
function ConditionClass()
{
    this.super('Class', Type.CONDITION, true);

    this.description = '当玩家为相应职业时，触发效果';

    this.data.push(new StringValue('职业', 'class', 'Fighter')
        .setTooltip('职业名称')
    );
    this.data.push(new ListValue('精准', 'exact', [ 'True', 'False' ], 'False')
        .setTooltip('是否为相应职业')
    );
}

extend('ConditionClassLevel', 'Component');
function ConditionClassLevel()
{
    this.super('Class Level', Type.CONDITION, true);

    this.description = '当玩家为相应职业等级时，触发效果';

    this.data.push(new IntValue('最小等级', 'min-level', 2)
        .setTooltip('最小触发等级')
    );
    this.data.push(new IntValue('最大等级', 'max-level', 99)
        .setTooltip('最大触发等级')
    );
}

extend('ConditionCombat', 'Component');
function ConditionCombat()
{
    this.super('Combat', Type.CONDITION, true);

    this.description = '当玩家进入/脱离战斗时，触发效果';

    this.data.push(new ListValue('战斗状态', 'combat', [ 'True', 'False' ], 'True')
        .setTooltip('战斗状态 [True为进入战斗,False为脱离战斗]')
    );
    this.data.push(new DoubleValue('脱离时间', 'seconds', 10)
        .setTooltip('脱离战斗状态所需时间 [秒]')
    );
}

extend('ConditionCrouch', 'Component');
function ConditionCrouch()
{
    this.super('Crouch', Type.CONDITION, true);

    this.description = '当玩家下蹲时，触发效果';

    this.data.push(new ListValue('蹲伏', 'crouch', [ 'True', 'False' ], 'True')
        .setTooltip('是否下蹲')
    );
}

extend('ConditionDirection', 'Component');
function ConditionDirection()
{
    this.super('Direction', Type.CONDITION, true);

    this.description = '当目标/施法者相视时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Target', 'Caster' ], 'Target')
        .setTooltip('目标类型 [目标/施法者]')
    );
    this.data.push(new ListValue('视线方向', 'direction', [ 'Away', 'Towards' ], 'Away')
        .setTooltip('触发方向 [相离/相视]')
    );
}

extend('ConditionElevation', 'Component');
function ConditionElevation()
{
    this.super('Elevation', Type.CONDITION, true);

    this.description = '当玩家处于相应高度时，释放技能';

    this.data.push(new ListValue('类型', 'type', [ 'Normal', 'Difference' ], 'Normal')
        .setTooltip('高度类型 [Normal为准确数值,Difference为大致范围]')
    );
    this.data.push(new AttributeValue('最小高度', 'min-value', 0, 0)
        .setTooltip('所需最小高度 [两者适用]')
    );
    this.data.push(new AttributeValue('最大高度', 'max-value', 255, 0)
        .setTooltip('所需最大高度 [Difference适用]')
    );
}

extend('ConditionElse', 'Component');
function ConditionElse()
{
    this.super('Else', Type.CONDITION, true);

    this.description = '当前一个项目失败时，则触发效果 [若前一个成功,则无效]';
}

extend('ConditionEntityType', 'Component');
function ConditionEntityType()
{
    this.super('Entity Type', Type.CONDITION, true);

    this.description = '当目标为相应的实体类型时，触发效果'

    this.data.push(new MultiListValue('类型', 'types', getEntities)
        .setTooltip('实体类型')
    );
}

extend('ConditionFire', 'Component');
function ConditionFire()
{
    this.super('Fire', Type.CONDITION, true);

    this.description = '当目标被点燃时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'On Fire', 'Not On Fire' ], 'On Fire')
        .setTooltip('点燃类型 [是/否]')
    );
}

extend('ConditionFlag', 'Component');
function ConditionFlag()
{
    this.super('Flag', Type.CONDITION, true);

    this.description = '当玩家被标记时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Set', 'Not Set' ], 'Set')
        .setTooltip('是否被标记 [是/否]')
    );
    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('被标记的Key值')
    );
}

extend('ConditionGround', 'Component');
function ConditionGround()
{
    this.super('Ground', Type.CONDITION, true);

    this.description = '当目标位于地面时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'On Ground', 'Not On Ground' ], 'On Ground')
        .setTooltip('是否在地面 [是/否]')
    );
}

extend('ConditionHealth', 'Component');
function ConditionHealth()
{
    this.super('Health', Type.CONDITION, true);

    this.description = "当目标生命值达到相应数值时，触发效果";

    this.data.push(new ListValue('类型', 'type', [ 'Health', 'Percent', 'Difference', 'Difference Percent' ], 'Health')
        .setTooltip('体力类型 [目标生命值/目标生命百分比/施法者与目标生命差值/施法者与目标生命差值百分比]')
    );
    this.data.push(new AttributeValue('最小数值', 'min-value', 0, 0)
        .setTooltip('最小生命值')
    );
    this.data.push(new AttributeValue('最大数值', 'max-value', 10, 2)
        .setTooltip('最大生命值')
    );
}

extend('ConditionItem', 'Component');
function ConditionItem()
{
    this.super('Item', Type.CONDITION, true);
    this.description = "当目标手持相应物品时，触发效果";

    addItemOptions(this);
}

extend('ConditionInventory', 'Component');
function ConditionInventory()
{
    this.super('Inventory', Type.CONDITION, true);

    this.description = '当目标背包含有相应物品时，触发效果 [不包含非玩家生物]';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('所需物品数量')
    );

    addItemOptions(this);
}

extend('ConditionLight', 'Component');
function ConditionLight()
{
    this.super('Light', Type.CONDITION, true);

    this.description = "当目标所处光源等级相符时，触发效果";

    this.data.push(new AttributeValue('最小光源', 'min-light', 0, 0)
        .setTooltip('最小光源 [16为全亮,0为黑暗]')
    );
    this.data.push(new AttributeValue('最大光源', 'max-light', 16, 16)
        .setTooltip('最大光源 [16为全亮,0为黑暗]')
    );
}

extend('ConditionMana', 'Component');
function ConditionMana()
{
    this.super('Mana', Type.CONDITION, true);

    this.description = "当目标魔力值达到相应范围时，触发效果";

    this.data.push(new ListValue('类型', 'type', [ 'Mana', 'Percent', 'Difference', 'Difference Percent' ], 'Mana')
        .setTooltip('魔力类型 [目标魔力值/目标魔力百分比/施法者与目标魔力差值/施法者与目标魔力差值百分比]')
    );
    this.data.push(new AttributeValue('最小数值', 'min-value', 0, 0)
        .setTooltip('最小魔力值')
    );
    this.data.push(new AttributeValue('最大数值', 'max-value', 10, 2)
        .setTooltip('最大魔力值')
    );
}

extend('ConditionName', 'Component');
function ConditionName()
{
    this.super('Name', Type.CONDITION, true);

    this.description = '当目标名称相应时，触发效果';

    this.data.push(new ListValue('关键字', 'contains', [ 'True', 'False' ], 'True')
        .setTooltip('是否包含关键字')
    );
    this.data.push(new ListValue('正则表达式', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('是否为正则表达式文本')
    );
    this.data.push(new StringValue('文本', 'text', 'Admin')
        .setTooltip('名称文本')
    );
}

extend('ConditionOffhand', 'Component');
function ConditionOffhand()
{
    this.super('Offhand', Type.CONDITION, true);
    this.description = "当玩家副手手持相应物品时，触发效果";

    addItemOptions(this);
}

extend('ConditionPermission', 'Component');
function ConditionPermission()
{
    this.super('Permission', Type.CONDITION, true);

    this.description = '当玩家具有相应权限时，触发效果';

    this.data.push(new StringValue('权限', 'perm', 'some.permission')
        .setTooltip('拥有权限')
    );
}

extend('ConditionPotion', 'Component');
function ConditionPotion()
{
    this.super('Potion', Type.CONDITION, true);

    this.description = '当玩家具有相应药水效果时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('是否具有效果')
    );
    this.data.push(new ListValue('药水', 'potion', getAnyPotion, 'Any')
        .setTooltip('药水类型')
    );
    this.data.push(new AttributeValue('最小数值', 'min-rank', 0, 0)
        .setTooltip('最小药水等级')
    );
    this.data.push(new AttributeValue('最大数值', 'max-rank', 999, 0)
        .setTooltip('最大药水等级')
    );
}

extend('ConditionSkillLevel', 'Component');
function ConditionSkillLevel(skill)
{
    this.super('Skill Level', Type.CONDITION, true);

    this.description = '当施法者技能达到相应等级时，触发效果';

    this.data.push(new StringValue('技能', 'skill', skill)
        .setTooltip('技能名称')
    );
    this.data.push(new IntValue('最小等级', 'min-level', 2)
        .setTooltip('最小技能等级')
    );
    this.data.push(new IntValue('最大等级', 'max-level', 99)
        .setTooltip('最大技能等级')
    );
}

extend('ConditionSlot', 'Component');
function ConditionSlot()
{
    this.super('Slot', Type.CONDITION, true);
    this.description = "当玩家在相应的槽位中具有相应物品时，释放效果";

    this.data.push(new StringListValue('槽位', 'slot', [9])
        .setTooltip('槽位 [0-8为快捷键,9-35为背包,36-39为护甲,40为副手,一行一个]')
    );

    addItemOptions(this);
}

extend('ConditionStatus', 'Component');
function ConditionStatus()
{
    this.super('Status', Type.CONDITION, true);

    this.description = '当目标具有相应状态时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('是否具有状态')
    );
    this.data.push(new ListValue('状态', 'status', [ 'Any', 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Any')
        .setTooltip('状态类型 [所有/吸血/诅咒/缴械/无敌/禁锢/沉默/眩晕]')
    );
}

extend('ConditionTime', 'Component');
function ConditionTime()
{
    this.super('Time', Type.CONDITION, true);

    this.description = '当时间到达相应数值时，触发效果';

    this.data.push(new ListValue('时间', 'time', [ 'Day', 'Night' ], 'Day')
        .setTooltip('世界时间')
    );
}

extend('ConditionTool', 'Component');
function ConditionTool()
{
    this.super('Tool', Type.CONDITION, true);

    this.description = '当目标使用相应工具时，触发效果';

    this.data.push(new ListValue('类型', 'material', [ 'Any', 'Wood', 'Stone', 'Iron', 'Gold', 'Diamond' ], 'Any')
        .setTooltip('工具类型 [任何/木制/石制/金制/钻石]')
    );
    this.data.push(new ListValue('工具', 'tool', [ 'Any', 'Axe', 'Hoe', 'Pickaxe', 'Shovel', 'Sword' ], 'Any')
        .setTooltip('工具 [任何/斧子/锄头/镐子/铲子/剑]')
    );
}

extend('ConditionValue', 'Component');
function ConditionValue()
{
    this.super('Value', Type.CONDITION, true);

    this.description = '当Key值达到相应数值时，触发效果';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量Key')
    );
    this.data.push(new AttributeValue('最小数值', 'min-value', 1, 0)
        .setTooltip('最小数值')
    );
    this.data.push(new AttributeValue('最大数值', 'max-value', 999, 0)
        .setTooltip('最大数值')
    );
}

extend('ConditionWater', 'Component');
function ConditionWater()
{
    this.super('Water', Type.CONDITION, true);

    this.description = '当玩家在水中时，触发效果';

    this.data.push(new ListValue('类型', 'state', [ 'In Water', 'Out Of Water' ], 'In Water')
        .setTooltip('是否在水中')
    );
}

extend('ConditionWeather', 'Component');
function ConditionWeather()
{
    this.super('Weather', Type.CONDITION, true);

    this.description = '当天气相应时，触发效果';

    this.data.push(new ListValue('类型', 'type', [ 'None', 'Rain', 'Snow', 'Thunder' ], 'Rain')
        .setTooltip('天气类型 [无/雨天/雪天/雷]')
    );
}

// -- Mechanic constructors ---------------------------------------------------- //

extend('MechanicAttribute', 'Component');
function MechanicAttribute()
{
    this.super('Attribute', Type.MECHANIC, false);

    this.description = '暂时性属性增幅';

    this.data.push(new StringValue('属性', 'key', 'Intelligence')
        .setTooltip('属性名称')
    );
    this.data.push(new AttributeValue('数值', 'amount', 5, 2)
        .setTooltip('增幅数值')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('持续时间 [秒]')
    );
    this.data.push(new ListValue('叠加', 'stackable', [ 'True', 'False' ], 'False')
        .setTooltip('[付费版] 是否能叠加')
    );
}

extend('MechanicBlock', 'Component');
function MechanicBlock()
{
    this.super('Block', Type.MECHANIC, false);

    this.description = '暂时性替换方块';

    this.data.push(new ListValue('形状', 'shape', [ 'Sphere', 'Cuboid' ], 'Sphere' )
        .setTooltip('替换区域的形状 [球体/长方体]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Air', 'Any', 'Solid' ], 'Solid' )
        .setTooltip('替换类型 [空气/所有/方块]')
    );
    this.data.push(new ListValue('方块', 'block', getMaterials, 'Ice')
        .setTooltip('替换方块类型')
    );
    this.data.push(new IntValue('方块 Data', 'data', 0)
        .setTooltip('方块Data [适用于木牌,树木,台阶等]')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 5, 0)
        .setTooltip('持续时间')
    );
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('向目标前方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('向目标上方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('向目标右方偏移 [负数相反]')
    );

    // Sphere options
    this.data.push(new AttributeValue('半径', 'radius', 3, 0).requireValue('shape', [ 'Sphere' ])
        .setTooltip('替换区域半径 [球体]')
    );

    // Cuboid options
    this.data.push(new AttributeValue('长 (Z)', 'depth', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('长度 [长方体]')
    );
    this.data.push(new AttributeValue('宽 (X)', 'width', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('宽度 [长方体]')
    );
    this.data.push(new AttributeValue('高 (Y)', 'height', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('高度 [长方体]')
    );
}

extend('MechanicBuff', 'Component');
function MechanicBuff()
{
    this.super('Buff', Type.MECHANIC, false);

    this.description = '提高/减少目标的战斗状态';

    this.data.push(new ListValue('即时', 'immediate', [ 'True', 'False' ], 'False')
        .setTooltip('是否仅增幅当前 [是否常驻]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'DAMAGE', 'DEFENSE', 'SKILL_DAMAGE', 'SKILL_DEFENSE', 'HEALING' ], 'DAMAGE')
        .requireValue('immediate', [ 'False' ])
        .setTooltip('增幅类型 [物理伤害/物理抗性/技能伤害/技能抗性/体力恢复速率]')
    );
    this.data.push(new ListValue('幅度', 'modifier', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('加成幅度 [固定值/倍率]')
    );
    this.data.push(new StringValue('类别', 'category', '')
        .requireValue('type', [ 'SKILL_DAMAGE', 'SKILL_DEFENSE' ])
        .setTooltip('影响的技能 [留空默认全部]')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('增幅的数值 [可为负数]')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .requireValue('immediate', [ 'False' ])
        .setTooltip('增幅持续时间')
    );
}

extend('MechanicCancel', 'Component');
function MechanicCancel()
{
    this.super('Cancel', Type.MECHANIC, false);

    this.description = '取消所有效果';
}

extend('MechanicCancelEffect', 'Component');
function MechanicCancelEffect()
{
    this.super('Cancel Effect', Type.MECHANIC, false);

    this.description = '取消粒子效果';

    this.data.push(new StringValue('效果 Key', 'effect-key', 'default')
        .setTooltip('粒子效果的Key')
    );
}

extend('MechanicChannel', 'Component');
function MechanicChannel()
{
    this.super('Channel', Type.MECHANIC, true);

    this.description = '在原地无法移动/攻击/释放其他技能';

    this.data.push(new ListValue('静止', 'still', [ 'True', 'False' ], 'True')
        .setTooltip('吟唱时是否能移动')
    );
    this.data.push(new AttributeValue('时间', 'time', 3, 0)
        .setTooltip('吟唱持续时间 [秒]')
    );
}

extend('MechanicCleanse', 'Component');
function MechanicCleanse()
{
    this.super('Cleanse', Type.MECHANIC, false);

    this.description = '清除目标相应的负面药水效果与负面状态';

    this.data.push(new ListValue('药水', 'potion', getBadPotions, 'All')
        .setTooltip('药水类型')
    );
    this.data.push(new ListValue('状态', 'status', [ 'None', 'All', 'Curse', 'Disarm', 'Root', 'Silence', 'Stun' ], 'All')
        .setTooltip('状态类型 [无/所有/诅咒/缴械/禁锢/沉默/眩晕]')
    );
}

extend('MechanicCommand', 'Component');
function MechanicCommand()
{
    this.super('Command', Type.MECHANIC, false);

    this.description ='使所有目标执行相应指令 [无视权限]';

    this.data.push(new StringValue('指令', 'command', '')
        .setTooltip('执行指令')
    );
    this.data.push(new ListValue('执行类型', 'type', [ 'Console', 'OP' ], 'OP')
        .setTooltip('执行类型 [控制台执行/目标自身执行] [使用 "{player}" 可将玩家名称带入指令]')
    );
}

extend('MechanicCooldown', 'Component');
function MechanicCooldown()
{
    this.super('Cooldown', Type.MECHANIC, false);

    this.description = "降低冷却时间";

    this.data.push(new StringValue('技能', 'skill', 'all')
        .setTooltip('冷却缩减的技能 [all为所有]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Seconds', 'Percent' ], 'Seconds')
        .setTooltip('缩减类型 [秒数/百分比]')
    );
    this.data.push(new AttributeValue('数值', 'value', -1, 0)
        .setTooltip('缩减数值 [负数为增加]')
    );
}

extend('MechanicDamage', 'Component');
function MechanicDamage()
{
    this.super('Damage', Type.MECHANIC, false);

    this.description = '对所有目标造成技能伤害';

    this.data.push(new ListValue('类型', 'type', [ 'Damage', 'Multiplier', 'Percent Left', 'Percent Missing' ], 'Damage')
        .setTooltip('伤害类型 [固定值/最大生命百分比/剩余生命百分比/已损失生命百分比]')
    );
    this.data.push(new AttributeValue("数值", "value", 3, 1)
        .setTooltip('伤害数值')
    );
    this.data.push(new ListValue('真实伤害', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('是否忽略护甲,抗性及所有插件')
    );
    this.data.push(new StringValue('分类器', 'classifier', 'default')
        .setTooltip('[付费版] 伤害类型[例如elemental damage或fake physical damage]')
    );
}

extend('MechanicDamageBuff', 'Component');
function MechanicDamageBuff()
{
    this.super('Damage Buff', Type.MECHANIC, false);

    this.description = '增幅所有目标造成的伤害';

    this.data.push(new ListValue('类型', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('增幅类型 [固定值/倍率]')
    );
    this.data.push(new ListValue('技能伤害', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('是否增幅技能伤害')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('增幅数值 [可为负数]')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('增幅持续时间')
    );
}

extend('MechanicDamageLore', 'Component');
function MechanicDamageLore()
{
    this.super('Damage Lore', Type.MECHANIC, false);

    this.description = '检测施法者手持物品中一个Lore的值，并对所有目标造成伤害';

    this.data.push(new ListValue("手持", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('手持类型 [主手/副手]')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('采用正则表达式，"{value}" 为数值所在位置 [请尽量避免使用 "[ ] { } ( ) . + ? * ^ \\ |" 等特殊字符]')
    );
    this.data.push(new AttributeValue('倍率', 'multiplier', 1, 0)
        .setTooltip('倍率伤害 [基础值为 "{value}" ]')
    );
    this.data.push(new ListValue('真实伤害', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('是否忽略护甲,抗性及所有插件')
    );
    this.data.push(new StringValue('分类器', 'classifier', 'default')
        .setTooltip('[付费版] 伤害类型[例如elemental damage或fake physical damage]')
    );
}

extend('MechanicDefenseBuff', 'Component');
function MechanicDefenseBuff()
{
    this.super('Defense Buff', Type.MECHANIC, false);

    this.description = '增幅所有目标受到的伤害';

    this.data.push(new ListValue('类型', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('增幅类型 [固定值/倍率]')
    );
    this.data.push(new ListValue('技能伤害', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('是否增幅技能伤害')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('增幅数值 [可为负数]')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('增幅持续时间')
    );
}

extend('MechanicDelay', 'Component');
function MechanicDelay()
{
    this.super('Delay', Type.MECHANIC, true);

    this.description = '延迟触发';

    this.data.push(new AttributeValue('延迟', 'delay', 2, 0)
        .setTooltip('延迟数值 [秒]')
    );
}

extend('MechanicDisguise', 'Component');
function MechanicDisguise()
{
    this.super('Disguise', Type.MECHANIC, false);

    this.description = '伪装所有插件 [需安装LibsDisguise插件]';

    this.data.push(new AttributeValue('持续时间', 'duration', -1, 0)
        .setTooltip('持续时间 [负数为永久]')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Mob', 'Player', 'Misc' ], 'Mob')
        .setTooltip('伪装类型 [生物/玩家/其他]')
    );

    this.data.push(new ListValue('生物', 'mob', [ 'Bat', 'Blaze', 'Cave Spider', 'Chicken', 'Cow', 'Creeper', 'Donkey', 'Elder Guardian', 'Ender Dragon', 'Enderman', 'Endermite', 'Ghast', 'Giant', 'Guardian', 'Horse', 'Iron Golem', 'Magma Cube', 'Mule', 'Mushroom Cow', 'Ocelot', 'Pig', 'Pig Zombie', 'Rabbit', 'Sheep', 'Shulker', 'Silverfish', 'Skeleton', 'Slime', 'Snowman', 'Spider', 'Squid', 'Undead Horse', 'Villager', 'Witch', 'Wither', 'Wither Skeleton', 'Wolf', 'Zombie', 'Zombie Villager'], 'Zombie')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('可伪装的生物')
    );
    this.data.push(new ListValue('成年', 'adult', [ 'True', 'False', ], 'True')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('是否成年')
    );

    this.data.push(new StringValue('玩家', 'player', 'Eniripsa96')
        .requireValue('type', [ 'Player' ])
        .setTooltip('玩家名称')
    );

    this.data.push(new ListValue('其他', 'misc', [ 'Area Effect Cloud', 'Armor Stand', 'Arrow', 'Boat', 'Dragon Fireball', 'Dropped Item', 'Egg', 'Ender Crystal', 'Ender Pearl', 'Ender Signal', 'Experience Orb', 'Falling Block', 'Fireball', 'Firework', 'Fishing Hook', 'Item Frame', 'Leash Hitch', 'Minecart', 'Minecart Chest', 'Minecart Command', 'Minecart Furnace', 'Minecart Hopper', 'Minecart Mob Spawner', 'Minecart TNT', 'Painting', 'Primed TNT', 'Shulker Bullet', 'Snowball', 'Spectral Arrow', 'Splash Potion', 'Tipped Arrow', 'Thrown EXP Bottle', 'Wither Skull' ], 'Painting')
        .requireValue('type', [ 'Misc' ])
        .setTooltip('可伪装的物品')
    );
    this.data.push(new IntValue('Data', 'data', 0)
        .requireValue('type', [ 'Misc' ])
        .setTooltip('伪装物品的Data')
    );
}

extend('MechanicDurability', 'Component');
function MechanicDurability()
{
    this.super('Durability', Type.MECHANIC, false);

    this.description = '降低手持物品的耐久';

    this.data.push(new AttributeValue('数值', 'amount', 1, 0)
        .setTooltip('降低数值')
    );
    this.data.push(new ListValue('副手', 'offhand', [ 'True', 'False' ], 'False')
        .setTooltip('是否包括副手')
    );
}

extend('MechanicExplosion', 'Component');
function MechanicExplosion()
{
    this.super('Explosion', Type.MECHANIC, false);

    this.description = '在目标位置造成爆炸';

    this.data.push(new AttributeValue('等级', 'power', 3, 0)
        .setTooltip('爆炸等级')
    );
    this.data.push(new ListValue('破坏方块', 'damage', [ 'True', 'False' ], 'False')
        .setTooltip('是否破坏方块')
    );
    this.data.push(new ListValue('点燃方块', 'fire', [ 'True', 'False' ], 'False')
        .setTooltip('是否点燃方块')
    );
}

extend('MechanicFire', 'Component');
function MechanicFire()
{
    this.super('Fire', Type.MECHANIC, false);

    this.description = '点燃目标';

    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('持续时间')
    );
}

extend('MechanicFlag', 'Component');
function MechanicFlag()
{
    this.super('Flag', Type.MECHANIC, false);

    this.description = '标记目标';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('标记Key值')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('持续时间 [永久标记请使用 "Flag Toggle [切换标记]" 来固定]')
    );
}

extend('MechanicFlagClear', 'Component');
function MechanicFlagClear()
{
    this.super('Flag Clear', Type.MECHANIC, false);

    this.description = '清除目标标记';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('标记Key值')
    );
}

extend('MechanicFlagToggle', 'Component');
function MechanicFlagToggle()
{
    this.super('Flag Toggle', Type.MECHANIC, false);

    this.description = '开启/关闭目标标记';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('标记Key值')
    );
}

extend('MechanicFood', 'Component');
function MechanicFood()
{
    this.super('Food', Type.MECHANIC, false);

    this.description = '增加目标饱食度';

    this.data.push(new AttributeValue('饱食度', 'food', 1, 1)
        .setTooltip('增加数值 [可为负数]')
    );
    this.data.push(new AttributeValue('饱和度', 'saturation', 0, 0)
        .setTooltip('增加数值，它决定了何时开始减少饱食度 [可为负数]')
    );
}

extend('MechanicForgetTargets', 'Component');
function MechanicForgetTargets()
{
    this.super('Forget Targets', Type.MECHANIC, false);

    this.description = '清除 "Remember Targets [记忆目标]" 储存的目标';

    this.data.push(new StringValue('Key', 'key', 'key')
        .setTooltip('目标Key值')
    );
}

extend('MechanicHeal', 'Component');
function MechanicHeal()
{
    this.super('Heal', Type.MECHANIC, false);

    this.description = '回复目标体力';

    this.data.push(new ListValue("类型", "type", [ "Health", "Percent" ], "Health")
        .setTooltip('回复类型 [固定值/最大生命百分比]')
    );
    this.data.push(new AttributeValue("数值", "value", 3, 1)
        .setTooltip('回复数值')
    );
}

extend('MechanicHealthSet', 'Component');
function MechanicHealthSet()
{
    this.super('Health Set', Type.MECHANIC, false);

    this.description = '设置目标体力';

    this.data.push(new AttributeValue("体力", "health", 1, 0)
        .setTooltip('体力数值')
    );
}

extend('MechanicHeldItem', 'Component');
function MechanicHeldItem()
{
    this.super('Held Item', Type.MECHANIC, false);

    this.description = '将目标手持物品移动至指定槽位，若槽位为技能快捷键则失效';

    this.data.push(new AttributeValue("槽位", "slot", 0, 0)
        .setTooltip('目标槽位 [0-8为快捷键,9-35为背包,36-39为护甲,40为副手]')
    );
}

extend('MechanicImmunity', 'Component');
function MechanicImmunity()
{
    this.super('Immunity', Type.MECHANIC, false);

    this.description = '在一段时间内免疫伤害'

    this.data.push(new ListValue('类型', 'type', DAMAGE_TYPES, 'Poison')
        .setTooltip('伤害类型')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('持续时间')
    );
    this.data.push(new AttributeValue('倍率', 'multiplier', 0, 0)
        .setTooltip('受伤倍率 [百分比,0为免疫]')
    );
}

extend('MechanicInterrupt', 'Component');
function MechanicInterrupt()
{
    this.super('Interrupt', Type.MECHANIC, false);

    this.description = '打断目标吟唱';
}

extend('MechanicItem', 'Component');
function MechanicItem()
{
    this.super('Item', Type.MECHANIC, false);

    this.description = '给予目标物品';

    this.data.push(new ListValue('类型', 'material', getMaterials, 'Arrow')
        .setTooltip('物品类型')
    );
    this.data.push(new IntValue('数量', 'amount', 1)
        .setTooltip('给予数量')
    );
    this.data.push(new IntValue('耐久', 'data', 0)
        .setTooltip('物品耐久')
    );
    this.data.push(new IntValue('Data', 'byte', 0)
        .setTooltip('物品Date [适用于羊毛,蛋,树木等]')
    );
    this.data.push(new ListValue('自定义', 'custom', [ 'True', 'False' ], 'False')
        .setTooltip('是否拥有名称与Lore')
    );

    this.data.push(new StringValue('名称', 'name', 'Name').requireValue('custom', [ 'True' ])
        .setTooltip('物品名称')
    );
    this.data.push(new StringListValue('Lore', 'lore', []).requireValue('custom', [ 'True' ])
        .setTooltip('物品lore')
    );
}

extend('MechanicItemProjectile', 'Component');
function MechanicItemProjectile()
{
    this.super('Item Projectile', Type.MECHANIC, true);

    this.description = '抛射一个物品，着陆时变回方块，未着陆时可撞击目标';


    this.data.push(new ListValue('物品', 'item', getMaterials, 'Jack O Lantern')
        .setTooltip('抛射物')
    ),
    this.data.push(new IntValue('物品 Data', 'item-data', 0)
        .setTooltip('物品Data')
    ),

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicItemRemove', 'Component');
function MechanicItemRemove()
{
    this.super('Item Remove', Type.MECHANIC, false);

    this.description = '删除目标玩家物品';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('删除数量')
    );

    addItemOptions(this);
}

extend('MechanicLaunch', 'Component');
function MechanicLaunch()
{
    this.super('Launch', Type.MECHANIC, false);

    this.description = '向前冲刺';

    this.data.push(new ListValue('[付费] 相对方向', 'relative', [ 'Target', 'Caster', 'Between'], 'Target')
        .setTooltip('冲刺方向 [Target为目标所朝方向,Caster为施法者所朝方向,Between为施法者到目标的方向]')
    );
    this.data.push(new AttributeValue('前进距离', 'forward', 0, 0)
        .setTooltip('向前冲刺距离 [负数相反]')
    );
    this.data.push(new AttributeValue('上升距离', 'upward', 2, 0.5)
        .setTooltip('向上冲刺距离 [负数相反]')
    );
    this.data.push(new AttributeValue('右斜距离', 'right', 0, 0)
        .setTooltip('向右冲刺距离 [负数相反]')
    );
}

extend('MechanicLightning', 'Component');
function MechanicLightning()
{
    this.super('Lightning', Type.MECHANIC, false);

    this.description = '使目标所在坐标被闪电击中';

    this.data.push(new ListValue('伤害', 'damage', ['True', 'False'], 'True')
        .setTooltip('是否会造成伤害')
    );
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('向目标前方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('向目标右方偏移 [负数相反]')
    );
}

extend('MechanicMana', 'Component');
function MechanicMana()
{
    this.super('Mana', Type.MECHANIC, false);

    this.description = '回复目标魔力';

    this.data.push(new ListValue('类型', 'type', [ 'Mana', 'Percent' ], 'Mana')
        .setTooltip('回复类型 [固定值/最大魔力百分比]')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('回复数值 [负数相反]')
    );
}

extend('MechanicMessage', 'Component');
function MechanicMessage()
{
    this.super('Message', Type.MECHANIC, false);

    this.description = '向所有目标发送消息'

    this.data.push(new StringValue('消息', 'message', 'text')
        .setTooltip('消息内容 [可使用 "{key}" 应用Key值]')
    );
}

extend('MechanicParticle', 'Component');
function MechanicParticle()
{
    this.super('Particle', Type.MECHANIC, false);

    this.description = '在目标处释放粒子';

    addParticleOptions(this);

    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('向目标前方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 2, 0.5)
        .setTooltip('向目标上方偏移 [负数相反]')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('向目标右方偏移 [负数相反]')
    );
}

extend('MechanicParticleAnimation', 'Component');
function MechanicParticleAnimation()
{
    this.super('Particle Animation', Type.MECHANIC, false);

    this.description = '在目标处释放动态粒子 [随时间变动]';

    this.data.push(new IntValue('Steps', 'steps', 1, 0)
        .setTooltip('应用粒子的次数')
    );
    this.data.push(new DoubleValue('频率', 'frequency', 0.05, 0)
        .setTooltip('应用频率 [0.05为最低]')
    );
    this.data.push(new IntValue('角度', 'angle', 0)
        .setTooltip('粒子旋转角度 [度]')
    );
    this.data.push(new IntValue('起始角度', 'start', 0)
        .setTooltip('粒子起始角度')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 5, 0)
        .setTooltip('持续时间 [秒]')
    );
    this.data.push(new AttributeValue('水平缩放', 'h-translation', 0, 0)
        .setTooltip('在水平距离上缩放 [负数相反]')
    );
    this.data.push(new AttributeValue('垂直升降', 'v-translation', 0, 0)
        .setTooltip('在垂直平面上升降 [负数相反]')
    );
    this.data.push(new IntValue('水平缩放次数', 'h-cycles', 1)
        .setTooltip('水平缩放循环次数')
    );
    this.data.push(new IntValue('垂直升降次数', 'v-cycles', 1)
        .setTooltip('垂直升降循环次数')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('向前偏移', 'forward', 0)
        .setTooltip('向目标前方偏移 [负数相反]')
    );
    this.data.push(new DoubleValue('向上偏移', 'upward', 0)
        .setTooltip('向目标上方偏移 [负数相反]')
    );
    this.data.push(new DoubleValue('向右偏移', 'right', 0)
        .setTooltip('向目标右方偏移 [负数相反]')
    );
}

extend('MechanicParticleEffect', 'Component');
function MechanicParticleEffect()
{
    this.super('Particle Effect', Type.MECHANIC, false);

    this.description = '跟随目标的粒子效果';

    addEffectOptions(this, false);
}

extend('MechanicParticleProjectile', 'Component');
function MechanicParticleProjectile()
{
    this.super('Particle Projectile', Type.MECHANIC, true);

    this.description = '将粒子抛射，着落时触发子项目，未着陆时可撞击目标';

    addProjectileOptions(this);

    this.data.push(new DoubleValue('重力', 'gravity', 0)
        .setTooltip('粒子受到的重力影响 [负数下降,0为水平,正数上升]')
    );
    this.data.push(new ListValue('穿透', 'pierce', [ 'True', 'False' ], 'False')
        .setTooltip('粒子能否穿透目标')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('频率', 'frequency', 0.05)
        .setTooltip('应用频率 [不建议修改]')
    );
    this.data.push(new DoubleValue('持续时间', 'lifespan', 3)
        .setTooltip('粒子持续时间')
    );

    addEffectOptions(this, true);
}

extend('MechanicPassive', 'Component');
function MechanicPassive()
{
    this.super('Passive', Type.MECHANIC, true);

    this.description = '循环应用子项目';

    this.data.push(new AttributeValue('时间', 'seconds', 1, 0)
        .setTooltip('间隔时间')
    );
}

extend('MechanicPermission', 'Component');
function MechanicPermission()
{
    this.super('Permission', Type.MECHANIC, true);

    this.description = '暂时性给予权限';

    this.data.push(new StringValue('权限', 'perm', 'plugin.perm.key')
        .setTooltip('给予权限')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('持续时间 [秒]')
    );
}

extend('MechanicPotion', 'Component');
function MechanicPotion()
{
    this.super('Potion', Type.MECHANIC, false);

    this.description = '对目标造成药水效果';

    this.data.push(new ListValue('药水', 'potion', getPotionTypes, 'Absorption')
        .setTooltip('药水效果')
    );
    this.data.push(new ListValue('粒子', 'ambient', [ 'True', 'False' ], 'True')
        .setTooltip('是否显示粒子效果')
    );
    this.data.push(new AttributeValue('等级', 'tier', 1, 0)
        .setTooltip('药水等级')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('持续时间')
    );
}

extend('MechanicPotionProjectile', 'Component');
function MechanicPotionProjectile()
{
    this.super('Potion Projectile', Type.MECHANIC, true);

    this.description = '所有目标抛射一瓶无效果药水，着陆时触发子项目，目标为药水命中物品，若未命中，目标为药水所在位置';

    this.data.push(new ListValue('类型', 'type', getPotionTypes, 'Fire Resistance')
        .setTooltip('药水类型 [无实际效果]')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('可被选为目标的群组 [盟友/敌方/所有]')
    );
    this.data.push(new ListValue('龙息', 'linger', [ 'True', 'False' ], 'False')
        .setTooltip('是否为龙息药水 [1.9+限定]')
    );
}

extend('MechanicProjectile', 'Component');
function MechanicProjectile()
{
    this.super('Projectile', Type.MECHANIC, true);

    this.description = '发射抛射物，命中时触发子项目，目标为被击中目标';

    this.data.push(new ListValue('抛射物', 'projectile', [ 'Arrow', 'Egg', 'Ghast Fireball', 'Snowball' ], 'Arrow')
        .setTooltip('抛射物类型')
    );
    this.data.push(new ListValue('火焰', 'flaming', [ 'True', 'False' ], 'False')
        .setTooltip('是否点燃抛射物')
    );
    this.data.push(new ListValue('消耗', 'cost', [ 'None', 'All', 'One' ], 'None')
        .setTooltip('是否消耗相同物品')
    );

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicPurge', 'Component');
function MechanicPurge()
{
    this.super('Purge', Type.MECHANIC, false);

    this.description = '清除目标相应的正面药水效果与正面状态';

    this.data.push(new ListValue('药水', 'potion', getGoodPotions, 'All')
        .setTooltip('药水效果')
    );
    this.data.push(new ListValue('状态', 'status', [ 'None', 'All', 'Absorb', 'Invincible' ], 'All')
        .setTooltip('状态类型 [无/全部/吸血/无敌]')
    );
}

extend('MechanicPush', 'Component');
function MechanicPush()
{
    this.super('Push', Type.MECHANIC, false);

    this.description = '将目标击退 [非施法者]';

  this.data.push(new ListValue('类型', 'type', [ 'Fixed', 'Inverse', 'Scaled' ], 'Fixed')
    .setTooltip('击退类型 [固定击退/逆向加速/比例缩放]')
  );
    this.data.push(new AttributeValue('速度', 'speed', 3, 1)
      .setTooltip('击退速度 [负数相反]')
  );
    this.data.push(new StringValue('来源', 'source', 'none')
        .setTooltip('击退来源 ["Remember Targets 记忆目标" 中的Key值,若无默认为施法者]')
    );
}

extend('MechanicRememberTargets', 'Component');
function MechanicRememberTargets()
{
    this.super('Remember Targets', Type.MECHANIC, false);

    this.description = '储存当前目标';

    this.data.push(new StringValue('Key', 'key', 'target')
        .setTooltip('目标Key值')
    );
}

extend('MechanicRepeat', 'Component');
function MechanicRepeat()
{
    this.super('Repeat', Type.MECHANIC, true);

    this.description = '连续多次应用子项目';

    this.data.push(new AttributeValue('次数', 'repetitions', 3, 0)
        .setTooltip('重复次数')
    );
    this.data.push(new DoubleValue('周期', 'period', 1)
        .setTooltip('循环间隔 [秒]')
    );
    this.data.push(new DoubleValue('延迟', 'delay', 0)
        .setTooltip('开始延迟 [秒]')
    );
    this.data.push(new ListValue('失败停止', 'stop-on-fail', [ 'True', 'False' ], 'False')
        .setTooltip('子项目失败时，是否停止')
    );
}

extend('MechanicSound', 'Component');
function MechanicSound()
{
    this.super('Sound', Type.MECHANIC, false);

    this.description = "在目标位置播放声音";

    this.data.push(new ListValue('声音', 'sound', getSounds, 'Ambience Cave')
        .setTooltip('播放声音')
    );
    this.data.push(new AttributeValue('音量', 'volume', 100, 0)
        .setTooltip('播放音量 [百分比,超过100不会更大声,而是会更远]')
    );
    this.data.push(new AttributeValue('音高', 'pitch', 1, 0)
        .setTooltip('声音音高 [0.5-2]')
    );
}

extend('MechanicSpeed', 'Component');
function MechanicSpeed()
{
    this.super('Speed', Type.MECHANIC, false);

    this.description = '移速加成';

    this.data.push(new AttributeValue('倍率', 'multiplier', 1.2, 0)
        .setTooltip('移速倍率 [加速BUFF同为基本值]')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 3, 1)
        .setTooltip('持续时间 [秒]')
    );
}

extend('MechanicStatus', 'Component');
function MechanicStatus()
{
    this.super('Status', Type.MECHANIC, false);

    this.description = '对目标附加状态';

    this.data.push(new ListValue('状态', 'status', [ 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Stun')
        .setTooltip('状态类型 [吸血/诅咒/缴械/无敌/禁锢/沉默/眩晕]')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 3, 1)
        .setTooltip('持续时间 [秒]')
    );
}

extend('MechanicTaunt', 'Component');
function MechanicTaunt()
{
    this.super('Taunt', Type.MECHANIC, false);

    this.description = '吸引怪物 [旧版本可能无效]';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('嘲讽数量 [负数减少]')
    );
}

extend('MechanicTrigger', 'Component');
function MechanicTrigger()
{
    this.super('Trigger', Type.MECHANIC, true);

    this.description = '在一段时间内监听当前目标';

    this.data.push(new ListValue('监听类型', 'trigger', [ 'Crouch', 'Death', 'Environment Damage', 'Kill', 'Land', 'Launch', 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ], 'Death')
        .setTooltip('监听类型 [下蹲/死亡/受到环境伤害/击杀/着陆/射击/造成物理伤害/造成技能伤害/受到物理伤害/受到技能伤害]')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 5, 0)
        .setTooltip('持续时间 [秒]')
    );
    this.data.push(new ListValue('叠加', 'stackable', [ 'True', 'False', ], 'True')
        .setTooltip('不同玩家是否可以同时监听同一玩家')
    );
    this.data.push(new ListValue('单次', 'once', [ 'True', 'False' ], 'True')
        .setTooltip('是否在持续时间内仅可监听一次')
    );

    // CROUCH
    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .requireValue('trigger', [ 'Crouch' ])
        .setTooltip('下蹲类型 [按下Shift/松开Shift/单击Shift]')
    );

    // ENVIRONMENT_DAMAGE
    this.data.push(new ListValue('类型', 'type', DAMAGE_TYPES, 'FALL')
        .requireValue('trigger', [ 'Environment Damage' ])
        .setTooltip('受到环境伤害类型')
    );

    // LAND
    this.data.push(new DoubleValue('最小高度', 'min-distance', 0)
        .requireValue('trigger', [ 'Land' ])
        .setTooltip('最小触发高度')
    );

    // LAUNCH
    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .requireValue('trigger', [ 'Launch' ])
        .setTooltip('射击类型')
    );

    // PHYSICAL
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .requireValue('trigger', [ 'Physical Damage', 'Took Physical Damage' ])
        .setTooltip('造成伤害类型 [全部/近战/远程]')
    );

    // SKILL
    this.data.push(new StringValue('类别', 'category', '')
        .requireValue('trigger', [ 'Skill Damage', 'Took Skill Damage' ])
        .setTooltip('可被触发的技能 [留空默认全部]')
    );

    // DAMAGE
    var damageTriggers = [ 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ];
    this.data.push(new ListValue('目标监听', 'target', [ 'True', 'False' ], 'True')
        .requireValue('trigger', damageTriggers)
        .setTooltip('[使子目标成为已监听的目标/使子目标成为目标攻击的实体] 【啥意思？？？？我也不懂啊...】')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .requireValue('trigger', damageTriggers)
        .setTooltip('最小监听伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .requireValue('trigger', damageTriggers)
        .setTooltip('最大监听伤害')
    );
}

extend('MechanicValueAdd', 'Component');
function MechanicValueAdd()
{
    this.super('Value Add', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并赋值';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new AttributeValue('数值', 'amount', 1, 0)
        .setTooltip('变量数值')
    );
}

extend('MechanicValueAttribute', 'Component');
function MechanicValueAttribute() 
{
    this.super('Value Attribute', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以属性值赋值';
    
    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('变量关键词')
    );
    this.data.push(new StringValue('属性', 'attribute', 'Vitality')
        .setTooltip('属性名称')
    );
}

extend('MechanicValueCopy', 'Component');
function MechanicValueCopy()
{
    this.super('Value Copy', Type.MECHANIC, false);
    
    this.description = '将施法者的一个变量复制给目标，或者相反';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new StringValue('目标Key', 'destination', 'value')
        .setTooltip('被复制的变量关键词')
    );
    this.data.push(new ListValue('复制目标', 'to-target', [ 'True', 'False' ], 'True')
        .setTooltip('是否复制给目标')
    );
}

extend('MechanicValueDistance', 'Component');
function MechanicValueDistance()
{
    this.super('Value Distance', Type.MECHANIC, false);

    this.description = '添加一个变量，并以施法者与目标之间的距离赋值';

    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('变量关键词')
    );
}

extend('MechanicValueHealth', 'Component');
function MechanicValueHealth()
{
    this.super('Value Health', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以目标体力赋值';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('体力类型 [剩余体力/最大体力/损失体力/剩余体力百分比]')
    );
}

extend('MechanicValueLocation', 'Component');
function MechanicValueLocation() 
{
    this.super('Value Location', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以第一个目标的坐标赋值';
    
    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('变量关键词')
    );
}

extend('MechanicValueLore', 'Component');
function MechanicValueLore()
{
    this.super('Value Lore', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以目标手持物品中指定Lore数值赋值';
    
    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('变量关键词')
    );
    this.data.push(new ListValue("手持", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('手持类型 [主手/副手]')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('采用正则表达式，"{value}" 为数值所在位置 [请尽量避免使用 "[ ] { } ( ) . + ? * ^ \\ |" 等特殊字符]')
    );
    this.data.push(new AttributeValue('倍率', 'multiplier', 1, 0)
        .setTooltip('数值倍率 [基础值为 "{value}" ]')
    );
}

extend('MechanicValueLoreSlot', 'Component');
function MechanicValueLoreSlot()
{
    this.super('Value Lore Slot', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以目标指定槽位物品Lore行数赋值';
    
    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('变量关键词')
    );
    this.data.push(new IntValue("槽位", "slot", 9)
        .setTooltip('槽位 [0-8为快捷键,9-35为背包,36-39为护甲,40为副手]')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('采用正则表达式，"{value}" 为数值所在位置 [请尽量避免使用 "[ ] { } ( ) . + ? * ^ \\ |" 等特殊字符]')
    );
    this.data.push(new AttributeValue('倍率', 'multiplier', 1, 0)
        .setTooltip('数值倍率 [基础值为 "{value}" ]')
    );
}

extend('MechanicValueMana', 'Component');
function MechanicValueMana()
{
    this.super('Value Mana', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以目标魔力赋值';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('魔力类型 [剩余魔力/最大魔力/损失魔力/剩余魔力百分比]')
    );
}

extend('MechanicValueMultiply', 'Component');
function MechanicValueMultiply()
{
    this.super('Value Multiply', Type.MECHANIC, false);

    this.description = '使一个变量值×倍率 [若无变量值则失效]';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new AttributeValue('倍率', 'multiplier', 1, 0)
        .setTooltip('变量倍率')
    );
}

extend('MechanicValuePlaceholder', 'Component');
function MechanicValuePlaceholder()
{
    this.super('Value Placeholder', Type.MECHANIC, false);

    this.description = '添加一个变量，并以占位符字符串赋值';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new ListValue("类型", "type", [ 'Number', 'String' ], 'Number')
        .setTooltip('赋值类型 [数字/字符串（可在消息与指令中使用）]')
    );
    this.data.push(new StringValue('占位符', 'placeholder', '%player_food_level%')
        .setTooltip('赋值占位符 [使用字符串可包含多个占位符]')
    );
}

extend('MechanicValueRandom', 'Component')
function MechanicValueRandom()
{
    this.super('Value Random', Type.MECHANIC, false);
    
    this.description = '添加一个变量，并以随机值赋值';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Normal', 'Triangular' ], 'Normal')
        .setTooltip('随机类型 [完全随机/中间数随机]')
    );
    this.data.push(new AttributeValue('最小', 'min', 0, 0)
        .setTooltip('最小随机数')
    );
    this.data.push(new AttributeValue('最大', 'max', 0, 0)
        .setTooltip('最大随机数')
    );
}

extend('MechanicValueSet', 'Component');
function MechanicValueSet()
{
    this.super('Value Set', Type.MECHANIC, false);
    
    this.description = '将一个变量设置为固定值';
    
    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('变量关键词')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('变量数值')
    );
}

extend('MechanicWarp', 'Component');
function MechanicWarp()
{
    this.super('Warp', Type.MECHANIC, false);
    
    this.description = '传送目标';
    
    this.data.push(new ListValue('穿墙', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('能否穿墙')
    );
    this.data.push(new AttributeValue('向前距离', 'forward', 3, 1)
        .setTooltip('向前方传送距离 [负数相反]')
    );
    this.data.push(new AttributeValue('向上距离', 'upward', 0, 0)
        .setTooltip('向上方传送距离 [负数相反]')
    );
    this.data.push(new AttributeValue('向右距离', 'right', 0, 0)
        .setTooltip('向右方传送距离 [负数相反]')
    );
}

extend('MechanicWarpLoc', 'Component');
function MechanicWarpLoc()
{
    this.super('Warp Location', Type.MECHANIC, false);
    
    this.description = '传送目标到指定坐标';
    
    this.data.push(new StringValue('世界名称', 'world', 'current')
        .setTooltip('世界名称 [curren为当前世界]')
    );
    this.data.push(new DoubleValue('X', 'x', 0)
        .setTooltip('X坐标')
    );
    this.data.push(new DoubleValue('Y', 'y', 0)
        .setTooltip('Y坐标')
    );
    this.data.push(new DoubleValue('Z', 'z', 0)
        .setTooltip('Z坐标')
    );
    this.data.push(new DoubleValue('偏转', 'yaw', 0)
        .setTooltip('左右宽度')
    );
    this.data.push(new DoubleValue('间高', 'pitch', 0)
        .setTooltip('上下高度')
    );
}

extend('MechanicWarpRandom', 'Component');
function MechanicWarpRandom()
{
    this.super('Warp Random', Type.MECHANIC, false);
    
    this.description = '随机传送目标到前方';
    
    this.data.push(new ListValue('水平传送', 'horizontal', [ 'True', 'False' ], 'True')
        .setTooltip('是否仅能水平传送')
    );
    this.data.push(new ListValue('穿墙', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('是否能穿墙')
    );
    this.data.push(new AttributeValue('距离', 'distance', 3, 1)
        .setTooltip('传送距离')
    );
}

extend('MechanicWarpSwap', 'Component');
function MechanicWarpSwap()
{
    this.super('Warp Swap', Type.MECHANIC, false);
    
    this.description = '置换施法者与目标所在位置 [仅第一个目标]';
}

extend('MechanicWarpTarget', 'Component');
function MechanicWarpTarget()
{
    this.super('Warp Target', Type.MECHANIC, false);
    
    this.description = '将目标/施法者传送到对方所在位置 [目标为施法者则失效]';
    
    this.data.push(new ListValue('类型', 'type', [ 'Caster to Target', 'Target to Caster' ], 'Caster to Target')
        .setTooltip('传送类型 [施法者到目标/目标到施法者]')
    );
}

extend('MechanicWarpValue', 'Component');
function MechanicWarpValue() 
{
    this.super('Warp Value', Type.MECHANIC, false);
    
    this.description = '传送目标到变量值';
    
    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('坐标变量关键词')
    );
}

extend('MechanicWolf', 'Component');
function MechanicWolf()
{
    this.super('Wolf', Type.MECHANIC, true);
    
    this.description = '在所有目标位置召唤一只狼，且子项目将以狼为目标';
    
    this.data.push(new ListValue('项圈颜色', 'color', getDyes(), 'Black')
        .setTooltip('项圈颜色')
    );
    this.data.push(new StringValue('名称', 'name', "{player} 的狼")
        .setTooltip('狼的名称 [使用 "{player}" 来显示施法者名称]')
    );
    this.data.push(new AttributeValue('体力', 'health', 10, 0)
        .setTooltip('狼的体力')
    );
    this.data.push(new AttributeValue('伤害', 'damage', 3, 0)
        .setTooltip('狼的伤害')
    );
    this.data.push(new ListValue('蹲坐', 'sitting', [ 'True', 'False' ], 'False')
        .setTooltip('[付费版] 是否为蹲坐状态')
    );
    this.data.push(new AttributeValue('持续时间', 'seconds', 10, 0)
        .setTooltip('狼持续时间')
    );
    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('狼的数量')
    );
    this.data.push(new StringListValue('技能', 'skills', [])
        .setTooltip('狼的技能 [一行一个,技能等级为此技能等级,"Cast trigger [主动触发]" 无法生效]')
    );
}

// The active component being edited or added to
var activeComponent = undefined;

/**
 * Adds the options for item related effects to the component
 *
 * @param {Component} component - the component to add to
 */
function addItemOptions(component) {
    
    component.data.push(new ListValue('检测材质', 'check-mat', [ 'True', 'False' ], 'True')
        .setTooltip('是否必须是指定物品')
    );
    component.data.push(new ListValue('材质', 'material', getMaterials, 'Arrow')
        .requireValue('check-mat', [ 'True' ])
        .setTooltip('物品材质')
    );
    
    component.data.push(new ListValue('检测 Data', 'check-data', [ 'True', 'False' ], 'False')
        .setTooltip('是否必须是指定Date')
    );
    component.data.push(new IntValue('Data', 'data', 0)
        .requireValue('check-data', [ 'True' ])
        .setTooltip('物品Date')
    );
    
    component.data.push(new ListValue('检测 Lore', 'check-lore', [ 'True', 'False' ], 'False')
        .setTooltip('是否必须是指定Lore')
    );
    component.data.push(new StringValue('Lore', 'lore', 'text')
        .requireValue('check-lore', [ 'True' ])
        .setTooltip('物品lore')
    );
    
    component.data.push(new ListValue('检测名称', 'check-name', [ 'True', 'False' ], 'False')
        .setTooltip('是否物品必须是指定名称')
    );
    component.data.push(new StringValue('名称', 'name', 'name')
        .requireValue('check-name', [ 'True' ])
        .setTooltip('物品名称')
    );
    
    component.data.push(new ListValue('正则表达式', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('是否为正则表达式')
    );
}

function addProjectileOptions(component) {
    
    // General data
    component.data.push(new ListValue("群组", "group", ["Ally", "Enemy"], "Enemy")
        .setTooltip('可攻击群组 [盟友/敌方]')
    );
    component.data.push(new ListValue('圆锥', 'spread', [ 'Cone', 'Horizontal Cone', 'Rain' ], 'Cone')
        .setTooltip('抛射物方向 [Cone在圆锥范围内抛射/Horizontal Cone在水平扇形内抛射/Rain从目标头顶坠落]')
    );
    component.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('抛射物数量')
    );
    component.data.push(new AttributeValue('速度', 'velocity', 3, 0)
        .setTooltip('抛射物速度 [负数方向相反]')
    );
    
    // Cone values
    component.data.push(new AttributeValue('角度', 'angle', 30, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('圆锥/扇形角度,并平均分布抛射物 [仅一个抛射物可无视]')
    );
    component.data.push(new DoubleValue('高度', 'position', 0, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('抛射物起始高度')
    );
    
    // Rain values
    component.data.push(new AttributeValue('高度', 'height', 8, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('抛射物坠落高度')
    );
    component.data.push(new AttributeValue('半径', 'rain-radius', 2, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('坠落半径 [格数]')
    );
    
    // Offsets
    component.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('向前方偏移 [负数相反]')
    );
    component.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('向上方偏移 [负数相反]')
    );
    component.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('向右方偏移 [负数相反]')
    );
}

/**
 * Adds the options for particle effects to the components
 *
 * @param {Component} component - the component to add to
 */
function addParticleOptions(component) {
    component.data.push(new ListValue('粒子', 'particle', 
        [ 
            'Angry Villager', 
            'Barrier',
            'Block Crack', 
            'Bubble', 
            'Cloud', 
            'Crit', 
            'Damage Indicator',
            'Death', 
            'Death Suspend', 
            'Dragon Breath',
            'Drip Lava', 
            'Drip Water', 
            'Enchantment Table', 
            'End Rod',
            'Ender Signal', 
            'Explode', 
            'Firework Spark', 
            'Flame', 
            'Footstep', 
            'Happy Villager', 
            'Heart', 
            'Huge Explosion', 
            'Hurt', 
            'Icon Crack', 
            'Instant Spell', 
            'Large Explode', 
            'Large Smoke', 
            'Lava', 
            'Magic Crit', 
            'Mob Spell', 
            'Mob Spell Ambient', 
            'Mobspawner Flames', 
            'Note', 
            'Portal', 
            'Potion Break', 
            'Red Dust', 
            'Sheep Eat', 
            'Slime', 
            'Smoke', 
            'Snowball Poof', 
            'Snow Shovel', 
            'Spell', 
            'Splash', 
            'Sweep Attack',
            'Suspend', 
            'Town Aura', 
            'Water Drop',
            'Water Wake',
            'Witch Magic', 
            'Wolf Hearts', 
            'Wolf Shake', 
            'Wolf Smoke' 
        ], 'Angry Villager')
        .setTooltip('粒子类型')
    );
    
    component.data.push(new ListValue('类型', 'material', getMaterials, 'Dirt').requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('用于Block Crack以及Icon Crack的物品类型')
    );
    component.data.push(new IntValue('Date', 'type', 0).requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('用于Block Crack以及Icon Crack的物品Date')
    );
    
    component.data.push(new ListValue('布局', 'arrangement', [ 'Circle', 'Hemisphere', 'Sphere' ], 'Circle')
        .setTooltip('粒子布局 [圆形/半球/球体]')
    );
    component.data.push(new AttributeValue('半径', 'radius', 4, 0)
        .setTooltip('粒子半径')
    );
    component.data.push(new AttributeValue('数量', 'particles', 20, 0)
        .setTooltip('粒子数量')
    );
    
    // Circle arrangement direction
    component.data.push(new ListValue('圆形方向', 'direction', [ 'XY', 'XZ', 'YZ' ], 'XZ').requireValue('arrangement', [ 'Circle' ])
        .setTooltip('圆形方向 [垂直生成/水平生成/垂直生成]')
    );
    
    // Bukkit particle data value
    component.data.push(new IntValue('Data', 'data', 0).requireValue('particle', [ 'Smoke', 'Ender Signal', 'Mobspawner Flames', 'Potion Break' ])
        .setTooltip('粒子Date')
    );
    
    // Reflection particle data
    var reflectList = [ 'Angry Villager', 'Bubble', 'Cloud', 'Crit', 'Damage Indicator', 'Death Suspend', 'Dragon Breath', 'Drip Lava', 'Drip Water', 'Enchantment Table', 'End Rod', 'Explode', 'Fireworks Spark', 'Flame', 'Footstep', 'Happy Villager', 'Hear', 'Huge Explosion', 'Instant Spell', 'Large Explode', 'Large Smoke', 'Lava', 'Magic Crit', 'Mob Spell', 'Mob Spell Ambient', 'Note', 'Portal', 'Red Dust', 'Slime', 'Snowball Poof', 'Snow Shovel', 'Spell', 'Splash', 'Suspend', 'Sweep Attack', 'Town Aura', 'Water Drop', 'Water Wake', 'Witch Magic' ];
    component.data.push(new IntValue('可见半径', 'visible-radius', 25).requireValue('particle', reflectList)
        .setTooltip('玩家可以看到粒子的最远距离')
    );
    component.data.push(new DoubleValue('DX', 'dx', 0).requireValue('particle', reflectList)
        .setTooltip('粒子DX值，通常用于颜色')
    );
    component.data.push(new DoubleValue('DY', 'dy', 0).requireValue('particle', reflectList)
        .setTooltip('粒子DY值，通常用于颜色')
    );
    component.data.push(new DoubleValue('DZ', 'dz', 0).requireValue('particle', reflectList)
        .setTooltip('粒子DZ值，通常用于颜色')
    );
    component.data.push(new DoubleValue('粒子速度', 'speed', 1).requireValue('particle', reflectList)
        .setTooltip('用于控制粒子的颜色/速度')
    );
    component.data.push(new DoubleValue('变化次数', 'amount', 1).requireValue('particle', reflectList)
        .setTooltip('粒子变化次数 [为0可控制某些粒子的颜色]')
    );
}

function addEffectOptions(component, optional)
{
    var opt = appendNone;
    if (optional)
    {
        opt = appendOptional;
        
        component.data.push(new ListValue('应用效果', 'use-effect', [ 'True', 'False' ], 'False')
            .setTooltip('是否使用高级粒子效果')
        );
    }
    
    component.data.push(opt(new StringValue('效果 Key', 'effect-key', 'default')
        .setTooltip('效果Key')
    ));
    component.data.push(opt(new AttributeValue('持续时间', 'duration', 1, 0)
        .setTooltip('效果持续时间')
    ));
    
    component.data.push(opt(new StringValue('形状', '-shape', 'hexagon')
        .setTooltip('用于决定粒子形状 [可在 "effects.yml" 中查看效果Key与形状]')
    ));
    component.data.push(opt(new ListValue('形状方向', '-shape-dir', [ 'XY', 'YZ', 'XZ' ], 'XY')
        .setTooltip('生成的平面 [XZ为水平方向,其余为垂直方向]')
    ));
    component.data.push(opt(new StringValue('形状大小', '-shape-size', '1')
        .setTooltip('用于确定形状大小')
    ));
    component.data.push(opt(new StringValue('动画', '-animation', 'one-circle')
        .setTooltip('用于决定粒子动画 [可在 "effects.yml" 中查看]')
    ));
    component.data.push(opt(new ListValue('动画方向', '-anim-dir', [ 'XY', 'YZ', 'XZ' ], 'XZ')
        .setTooltip('动画的平面 [XZ为水平方向,其余为垂直方向]')
    ));
    component.data.push(opt(new StringValue('动画大小', '-anim-size', '1')
        .setTooltip('用于确定动画大小')
    ));
    component.data.push(opt(new IntValue('间隔', '-interval', 1)
        .setTooltip('粒子之间的间隔 [刻]')
    ));
    component.data.push(opt(new IntValue('可视半径', '-view-range', 25)
        .setTooltip('玩家可以看到粒子的最远距离')
    ));
    
    component.data.push(opt(new ListValue('粒子类型', '-particle-type', [
            'BARRIER',
            'BLOCK_CRACK',
            'CLOUD',
            'CRIT',
            'CRIT_MAGIC',
            'DAMAGE_INDICATOR',
            'DRAGON_BREATH',
            'DRIP_LAVA',
            'DRIP_WATER',
            'ENCHANTMENT_TABLE',
            'END_ROD',
            'EXPLOSION_HUGE',
            'EXPLOSION_LARGE',
            'EXPLOSION_NORMAL',
            'FIREWORKS_SPARK',
            'FLAME',
            'FOOTSTEP',
            'HEART',
            'LAVA',
            'MOB_APPEARANCE',
            'NOTE',
            'PORTAL',
            'REDSTONE',
            'SLIME',
            'SMOKE_NORMAL',
            'SMOKE_LARGE',
            'SNOWBALL',
            'SNOW_SHOVEL',
            'SPELL',
            'SPELL_INSTANT',
            'SPELL_MOB',
            'SPELL_MOB_AMBIENT',
            'SPELL_WITCH',
            'SUSPEND_DEPTH',
            'SUSPENDED',
            'SWEEP_ATTACK',
            'TOWN_AURA',
            'VILLAGER_ANGRY',
            'VILLAGER_HAPPY',
            'WATER_BUBBLE',
            'WATER_SPLASH',
            'WATER_WAKE'
        ], 'BARRIER')
        .setTooltip('粒子类型')
    ));
    component.data.push(opt(new ListValue('粒子材质', '-particle-material', getMaterials, 'WOOD')
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('粒子材质')
    ));
    component.data.push(opt(new IntValue('粒子 Data', '-particle-data', 0)
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('粒子Date')
    ));
    component.data.push(opt(new IntValue('粒子数量', '-particle-amount', 0)
        .setTooltip('粒子的数量')
    ));
    component.data.push(opt(new DoubleValue('DX', '-particle-dx', 0)
        .setTooltip('粒子DX值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('DY', '-particle-dy', 0)
        .setTooltip('粒子DY值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('DZ', '-particle-dz', 0)
        .setTooltip('粒子DZ值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('速度', '-particle-speed', 1)
        .setTooltip('粒子的速度')
    ));
}

function appendOptional(value)
{
    value.requireValue('use-effect', [ 'True' ]);
    return value;
}

function appendNone(value)
{
    return value;
}
