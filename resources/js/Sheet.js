// Classe planilha
function SheetView() {
    this.cost = document.getElementById('cost'),
    this.st = document.getElementById('st'),
    this.stCost = document.getElementById('stCost'),
    this.hp = document.getElementById('hp'),
    this.hpCost = document.getElementById('hpCost'),
    this.dx = document.getElementById('dx'),
    this.dxCost = document.getElementById('dxCost'),
    this.will = document.getElementById('will'),
    this.willCost = document.getElementById('willCost'),
    this.iq = document.getElementById('iq'),
    this.iqCost = document.getElementById('iqCost'),
    this.per = document.getElementById('per'),
    this.perCost = document.getElementById('perCost'),
    this.ht = document.getElementById('ht'),
    this.htCost = document.getElementById('htCost'),
    this.fp = document.getElementById('fp'),
    this.fpCost = document.getElementById('fpCost'),
    this.bl = document.getElementById('bl'),
    this.speed = document.getElementById('speed'),
    this.speedCost = document.getElementById('speedCost'),
    this.move = document.getElementById('move'),
    this.moveCost = document.getElementById('moveCost'),
    /*this.advTable = document.getElementById('advTable'),*/
    this.skillTable = document.getElementById('skillTable');
}
SheetView.prototype = {
    constructor: SheetView
}

function SheetModel() {
    this.st = 10;
    this.stCost = 0;
    this.hp = 10;
    this.hpCost = 0;
    this.dx = 10,
    this.dxCost = 0,
    this.will = 10,
    this.willCost = 0,
    this.iq = 10,
    this.iqCost = 0,
    this.per = 10,
    this.perCost = 0,
    this.ht = 10,
    this.htCost = 0,
    this.fp = 10,
    this.fpCost = 0,
    this.speed = 10,
    this.speedCost = 0,
    this.move = 10,
    this.moveCost = 0,
    //this.advs = [];
    this.skills = [];
}
SheetModel.prototype = {
    constructor: SheetModel
}

function SheetController() {
    this.model = new SheetModel();
    this.view = new SheetView();

    var s = this;
    this.view.st.onchange = function() {s.setAttrCost('st'); s.calculateAttr('hp', 'st'); s.calculateBl();
        s.calculateThrust(); s.calculateSwing(); s.calculateSpeed(); s.calculateMove(); s.calculateCost();};
    this.view.hp.onchange = function() {s.setAttrCost('hp'); s.calculateCost();};
    this.view.dx.onchange = function() {s.setAttrCost('dx'); s.updateSkills('dx'); s.calculateCost();};
    this.view.will.onchange = function() {s.setAttrCost('will'); s.calculateCost();};
    this.view.iq.onchange = function() {s.setAttrCost('iq'); s.calculateAttr('will', 'iq'); s.calculateAttr('per', 'iq');
        s.updateSkills('iq'); s.calculateCost();};
    this.view.per.onchange = function() {s.setAttrCost('per'); s.calculateCost();};
    this.view.ht.onchange = function() {s.setAttrCost('ht'); s.calculateAttr('fp', 'ht'); s.calculateSpeed(); s.calculateMove();
        s.updateSkills('ht'); s.calculateCost();};
    this.view.fp.onchange = function() {s.setAttrCost('fp'); s.calculateCost();};
    this.view.move.onchange = function() {s.setAttrCost('move'); s.calculateCost();};
    this.view.speed.onchange = function() {s.setAttrCost('speed'); s.calculateCost();};

    this.calculateCost();
}
SheetController.prototype = {
    constructor: SheetController,

    setAttrCost: function(attr) {
        var model = this.model, view = this.view;
        var aux = attr+'Cost', level = parseInt(view[attr].value);
        // Atualiza a variavel modelo
        model[attr] = level;

        if(attr == 'hp') {model[aux] = (level-model.st)*2;}
        else if(attr == 'fp') {model[aux] = (level-model.ht)*3;}
        else if(attr == 'will' || attr == 'per') {model[aux] = (level-model.iq)*5;}
        else if(attr == 'move') {model[aux] = (level-((model.st+model.ht))/4)*5;}
        else if(attr == 'speed') {model[aux] = (level-((model.st+model.ht))/4)*20;}
        else if(attr == 'dx' || attr == 'iq') {model[aux] = (level-10)*20;}
        else {model[aux] = (level-10)*10;}

        view[aux].innerHTML = '['+model[aux]+']';
    },

    // Calcula o custo total do personagem
    calculateCost: function() {
        var m = this.model;
        var cost = m.stCost+m.dxCost+m.iqCost+m.htCost;
        cost += m.hpCost+m.willCost+m.perCost+m.fpCost;
        cost += m.moveCost+m.speedCost;

        //$('#advTable [name="advCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});
        //$('#disadvTable [name="disadvCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});

        for(var i = 0, len = m.skills.length; i < len; i++) {
            cost += parseFloat(m.skills[i].cost);
        }

        $(this.view.cost).val(cost);
    },

    calculateAttr: function(attr, baseAttr) {
        this.model[attr] = this.model[baseAttr];
        this.model[attr+'Cost'] = 0;
        this.view[attr].value = this.model[attr];
        this.view[attr+'Cost'].innerHTML = '[0]';
    },

    calculateMove: function() {
        this.model.move = Math.floor((this.model.st+this.model.ht)/4);
        this.model.moveCost = 0;
        this.view.move.value = this.model.move;
        this.view.moveCost.innerHTML = '[0]';
    },

    calculateSpeed: function() {
        this.model.speed = (this.model.st+this.model.ht)/4
        this.model.speedCost = 0;
        this.view.speed.value = this.model.speed;
        this.view.speedCost.innerHTML = '[0]';
    },

    calculateThrust: function() {
        var level = this.model.st;

        if(level <= 18) {
            var adder = Math.floor((14-level)/2);
            if(adder == 0) {$('#thr').html("Thrust: 1d");}
            else if(adder > 0) {$('#thr').html("Thrust: 1d -"+adder);}
            else {$('#thr').html("Trhust: 1d +"+(-1*adder));}
        }
        else if(level <= 44) {
            var adder = -1, numDices = 1, counter = 0;
            for(var i = 10; i < level && i < 40; i += 2) {
                if(counter == 4) {
                    counter = 0;
                    numDices++;
                    adder = -2;
                }
                counter++;
                adder++;
            }
            if(adder > 0) {$('#thr').html("Thrust: "+numDices+"d +"+adder);}
            else if(adder < 0) {$('#thr').html("Thrust: "+numDices+"d "+adder);}
            else {$('#thr').html("Thrust: "+numDices+"d");}
        }
        else if(level <= 100) {
            var content;
            if(level <= 49) {content = "5d";}
            else if(level <= 54) {content = "5d +2";}
            else if(level <= 59) {content = "6d";}
            else if(level <= 64) {content = "7d -1";}
            else if(level <= 69) {content = "7d +1";}
            else {
                content = (Math.floor(level/10)+1)+"d";
                if(Math.floor(level/5)%2 == 1) {content += " +2";}
            }
            $('#thr').html('Thrust: '+content);
        }
        else {
            $('#thr').html("Thrust: "+(Math.floor(level/10)+1)+"d");
        }
    },

    calculateSwing: function() {
        var level = this.model.st;
        if(level <= 9) {$('#sw').html("Swing: 1d "+(Math.ceil(level/2)-6));}
        else if(level <= 40) {
            var numDices, counter = 0, adder, inc, start;

            if(level <= 27) {numDices = 1; adder = 0; inc = 1; start = 10; counter = 2;}
            else {numDices = 5; adder = 1; inc = 2; start = 28; counter = 3;}

            for(var i = start; i < level; i += inc) {
                if(counter == 4) {
                    counter = 0;
                    numDices++;
                    adder = -2;
                }
                counter++;
                adder++;
            }
            if(adder > 0) {$('#sw').html("Swing: "+numDices+"d +"+adder);}
            else if(adder < 0) {$('#sw').html("Swing: "+numDices+"d "+adder);}
            else {$('#sw').html("Swing: "+numDices+"d");}
        }
        else if(level <= 100) {
            var content;
            if(level <= 44) {content = "7d -1";}
            else if(level <= 49) {content = "7d +1";}
            else if(level <= 54) {content = "8d -1";}
            else if(level <= 59) {content = "8d +1";}
            else {
                content = (Math.floor(level/10)+3)+"d";
                if(Math.floor(level/5)%2 == 1) {content += " +2";}
            }
            $('#sw').html('Swing: '+content);
        }
        else {
            $('#sw').html("Swing: "+(Math.floor(level/10)+3)+"d");
        }
    },

    calculateBl: function() {
        this.view.bl.innerHTML = "Basic Lift: "+((this.model.st*this.model.st)/5);
    },

    newAdvRow: function() {
        advantage = $('#advList').val();
        if(advantage != '') {
            var tableRef = this.advTable.getElementsByTagName('tbody')[0],
                newRow = tableRef.insertRow(tableRef.rows.length),
                nameCell  = newRow.insertCell(0),
                levelCell = newRow.insertCell(1),
                costCell = newRow.insertCell(2),
                removeCell = newRow.insertCell(3),
                desc = advantage.split(';'),
                sheet = this;

            var remove = document.createElement("span");
            remove.innerHTML = "&times;";
            remove.onclick = function() {sheet.deleteRow(newRow)};
            remove.style.fontSize = "1.5em";
            remove.style.cursor = "pointer";
            removeCell.appendChild(remove);

            if(desc[1] == '0') {
                var name = document.createElement("input");
                name.type = "text";
                name.className = "form-control";
                name.placeholder = desc[0];
                nameCell.appendChild(name);
                var level = document.createElement("input");
                level.type = "number";
                level.className = "form-control"
                level.min = 1;
                levelCell.appendChild(level);
                var cost = document.createElement("input");
                cost.type = "number";
                cost.className = "form-control";
                cost.step = "0.5";
                cost.min = "0.5";
                costCell.appendChild(cost);
                cost.onchange = function() {sheet.calculateCost()};
            }
            else if(desc[1] == '6') {
                var name = document.createElement("input");
                name.type = "text";
                name.className = "form-control";
                name.placeholder = desc[0];
                nameCell.appendChild(name);
                var cost = document.createElement("output");
                cost.className = "col-form-label";
                cost.innerHTML = '1';
                costCell.appendChild(cost);
            }
            else {
                var name = document.createElement("p");
                name.innerHTML = desc[0];
                name.className = "col-form-label";
                nameCell.className = "text-left";
                nameCell.appendChild(name);

                if(desc[1] == '1') {
                    var cost = document.createElement("output");
                    cost.value = desc[2];
                    cost.className = "col-form-label";
                    costCell.appendChild(cost);
                }
                else if(desc[1] == '2') {
                    var cost = document.createElement("select");
                    cost.className = "form-control";
                    costs = desc[2].split('-');
                    for(var i = 0, len = costs.length; i < len; i++) {
                        option = document.createElement("option");
                        option.value = costs[i];
                        option.innerHTML = costs[i];
                        cost.add(option);
                    }
                    costCell.appendChild(cost);
                    cost.onchange = function() {sheet.calculateCost();}
                }
                else if(desc[1] == '3') {
                    var level = document.createElement("input");
                    level.type = "number";
                    level.min = 1;
                    level.className = "form-control";
                    level.step = 1;
                    level.max = desc[3];
                    level.onchange = function() {cost.value = level.value*desc[2]; sheet.calculateCost();}
                    levelCell.appendChild(level);
                    var cost = document.createElement("output");
                    cost.className = "col-form-label";
                    costCell.appendChild(cost);
                }
                else if(desc[1] == '4') {
                    var cost = document.createElement("input");
                    cost.type = "number";
                    cost.className = "form-control";
                    cost.min = desc[2];
                    cost.step = 0.5;
                    costCell.appendChild(cost);
                    cost.onchange = function() {sheet.calculateCost()};
                }

                else if(desc[1] == '5') {
                    var cost = document.createElement("input");
                    cost.type = "number";
                    cost.className = "form-control";
                    cost.min = desc[2];
                    cost.max = desc[3];
                    cost.step = 1;
                    costCell.appendChild(cost);
                    cost.onchange = function() {sheet.calculateCost()};
                }
            }
            cost.name = "advCost";
            this.calculateCost();
        }
    },

    deleteRow: function(rowRef) {
        $(rowRef).remove();
        this.calculateCost();
    },

    newDisadvRow: function() {
        disadvantage = $('#disadvList').val();
        if(disadvantage != '') {
            var tableRef = document.getElementById('disadvTable').getElementsByTagName('tbody')[0],
                newRow = tableRef.insertRow(tableRef.rows.length),
                nameCell  = newRow.insertCell(0),
                levelCell = newRow.insertCell(1),
                costCell = newRow.insertCell(2),
                removeCell = newRow.insertCell(3),
                desc = disadvantage.split(';');

            var remove = document.createElement("span");
            remove.innerHTML = "&times;";
            remove.onclick = function() {deleteRow(newRow)};
            remove.style.fontSize = "1.5em";
            remove.style.cursor = "pointer";
            remove.title = "Delete Row";
            removeCell.appendChild(remove);

            if(desc[1] = '0') {
                var name = document.createElement("input");
                name.type = "text";
                name.className = "form-control";
                name.placeholder = desc[0];
                nameCell.appendChild(name);
                var level = document.createElement("input");
                level.type = "number";
                level.className = "form-control"
                level.min = 1;
                levelCell.appendChild(level);
                var cost = document.createElement("input");
                cost.type = "number";
                cost.className = "form-control";
                cost.step = "0.5";
                cost.min = "0.5";
                costCell.appendChild(cost);
            }

            cost.name = "disadvCost";
        }
    },

    newSkillRow: function() {
        var skillDesc = $('#skillList').val();
        if(skillDesc != '') {
            var skillController = new SkillController(this, skillDesc.split(';'));

            this.model.skills.push(skillController.model);
        }
    },

    updateSkills: function(attr) {
        for(var i = 0, len = this.model.skills.length; i < len; i++) {
            var skill = this.model.skills[i];
            if(skill.attr == attr) {
                if(skill.type == 1) {
                    // Atualiza o valor no modelo
                    skill.min = parseInt(this.model[attr])-(parseInt(skill.difficulty)+4);
                    skill.level = skill.min;
                    skill.cost = 0;

                    // Atualiza o valor no elemento grafico
                    var row = this.view.skillTable.rows[i+1];
                    var levelView = row.cells[1].children[0];
                    levelView.value = skill.level;
                    levelView.min = skill.min;
                    row.cells[2].children[0].value = skill.cost;
                }
            }
        }
    }
}