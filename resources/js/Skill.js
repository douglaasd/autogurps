function SkillView(sheet, nameString, type, attr, difficulty) {
    this.cost;
    this.level;
    this.name;
    this.newRow = sheet.view.skillTable.insertRow();
    this.remove;

    var nameCell  = this.newRow.insertCell(0),
        levelCell = this.newRow.insertCell(1),
        costCell = this.newRow.insertCell(2),
        removeCell = this.newRow.insertCell(3);

    // Tipo 0 significa que eh habilidade customizada
    if(type == '0') {
        this.name = document.createElement("input");
        this.name.type = "text";
        this.name.className = "form-control",
        this.name.placeholder = nameString;
        nameCell.appendChild(this.name);
        this.level = document.createElement("input");
        this.level.type = "number";
        this.level.className = "form-control";
        this.min = 1;
        levelCell.appendChild(this.level);
        this.cost = document.createElement("input");
        this.cost.type = "number",
        this.cost.className = "form-control";
        this.cost.step = "0.5";
        this.cost.min = "0.5";
        this.cost.value = 0;
        costCell.appendChild(this.cost);
    }

    // Tipo 1 significa que eh habilidade padrao com nivel inicial pre estipulado
    else if(type == '1') {
        this.name = document.createElement("p");
        this.name.innerHTML = nameString;
        this.name.className = "col-form-label";
        nameCell.className = "text-left";
        nameCell.appendChild(this.name);
        this.cost = document.createElement("output");
        this.cost.className = "col-form-label";
        this.cost.value = 0;
        costCell.appendChild(this.cost);
        this.level = document.createElement("input");
        this.level.type = "number";
        this.level.className = "form-control";
        this.level.min = sheet.model[attr]-(4+parseInt(difficulty));
        this.level.value = this.level.min;
        levelCell.appendChild(this.level);
    }

    this.remove = document.createElement("span");
    this.remove.innerHTML = "&times;";
    this.remove.style.fontSize = "1.5em";
    this.remove.style.cursor = "pointer";
    removeCell.appendChild(this.remove);
}
SkillView.prototype = {
    constructor: SkillView
}

function SkillModel(sheet, name, type, attr, difficulty) {
    this.name = name;
    this.type = type;
    this.attr = attr;
    this.difficulty = difficulty;
    this.cost = 0;
    this.level = sheet.model[attr]-(4+parseInt(difficulty));
    this.min = this.level;
}
SkillModel.prototype = {
    constructor: SkillModel
}

function SkillController(sheet, desc) {

    var name = desc[0], type = desc[1], attr = desc[2], difficulty = desc[3];

    this.view = new SkillView(sheet, name, type, attr, difficulty);            
    this.model = new SkillModel(sheet, name, type, attr, difficulty);
    
    var skill = this;
    if(type == 0) {
        this.view.level.onchange = function() {
            skill.model.level = parseFloat(skill.view.level.value);
            sheet.calculateCost();
        };
        this.view.cost.onchange = function() {
            skill.model.cost = parseFloat(skill.view.cost.value);
            sheet.calculateCost();
        };
        this.view.name.onchange = function() {
            skill.model.name = skill.view.name.value;
        };
    }
    else {
        this.view.level.onchange = function() {
            skill.model.level = parseFloat(skill.view.level.value);
            skill.model.cost = skill.calculateSkill(sheet);
            skill.view.cost.value = skill.model.cost;
            sheet.calculateCost();
        };
    }
    this.view.remove.onclick = function() {
        sheet.model.skills.splice(sheet.model.skills.indexOf(skill.model), 1);
        sheet.deleteRow(skill.view.newRow);
        sheet.calculateCost();
    };
}
SkillController.prototype = {
    constructor: SkillController,

    calculateSkill: function(sheet) {
        var attrAdder = this.model.level-sheet.model[this.model.attr];

        if(attrAdder <= 0-this.model.difficulty) {return 1;}
        if(attrAdder <= 1-this.model.difficulty) {return 2;}
        return (attrAdder*4)-(4-(this.model.difficulty*4));
    }
}