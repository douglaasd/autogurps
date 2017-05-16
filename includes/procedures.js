// Inicializar a pagina com o custo do personagem
window.onload = function () {
    $("[type='number']").keypress(function(evt) {evt.preventDefault();});
    var sheet = new Sheet();
    $('#advButton').click(function() {sheet.newAdvRow();});
    $('#disadvButton').click(function() {sheet.newDisadvRow();});
    $('#skillButton').click(function() {sheet.newSkillRow();});
}

// Classe planilha
function Sheet() {
    this.st = document.getElementById('st');
    this.stCost = 0;
    this.hp = document.getElementById('hp');
    this.hpCost = 0;
    this.dx = document.getElementById('dx'),
    this.dxCost = 0,
    this.will = document.getElementById('will'),
    this.willCost = 0,
    this.iq = document.getElementById('iq'),
    this.iqCost = 0,
    this.per = document.getElementById('per'),
    this.perCost = 0,
    this.ht = document.getElementById('ht'),
    this.htCost = 0,
    this.fp = document.getElementById('fp'),
    this.fpCost = 0,
    this.speed = document.getElementById('speed'),
    this.costSpeed = 0,
    this.move = document.getElementById('move'),
    this.moveCost = 0,
    this.advTable = document.getElementById('advTable'),
    this.skills = [];

    var s = this;
    this.st.onchange = function() {s.setAttrCost('st'); s.calculateAttr('hp', 'st'); s.calculateBl();
        s.calculateThrust(); s.calculateSwing(); s.calculateSpeed(); s.calculateMove(); s.calculateCost();};
    this.hp.onchange = function() {s.setAttrCost('hp'); s.calculateCost();};
    this.dx.onchange = function() {s.setAttrCost('dx'); s.updateSkills('dx'); s.calculateCost();};
    this.will.onchange = function() {s.setAttrCost('will'); s.calculateCost();};
    this.iq.onchange = function() {s.setAttrCost('iq'); s.calculateAttr('will', 'iq'); s.calculateAttr('per', 'iq');
        s.updateSkills('iq'); s.calculateCost();};
    this.per.onchange = function() {s.setAttrCost('per'); s.calculateCost();};
    this.ht.onchange = function() {s.setAttrCost('ht'); s.calculateAttr('fp', 'ht'); s.calculateSpeed(); s.calculateMove();
        s.updateSkills('ht'); s.calculateCost();};
    this.fp.onchange = function() {s.setAttrCost('fp'); s.calculateCost();};
    this.move.onchange = function() {s.setAttrCost('move'); s.calculateCost();};
    this.speed.onchange = function() {s.setAttrCost('speed'); s.calculateCost();};
     
    this.calculateCost();
}

Sheet.prototype = {
    constructor: Sheet,
    // Informa no label o custo da pericia e atualiza o custo na estrutura sheet
    setAttrCost: function(type) {
        var aux = type+'Cost', level = this[type].value;

        if(type == 'hp') {this[aux] = (level-this.st.value)*2;}
        else if(type == 'fp') {this[aux] = (level-this.ht.value)*3;}
        else if(type == 'will' || type == 'per') {this[aux] = (level-this.iq.value)*5;}
        else if(type == 'move') {this[aux] = (level-((parseInt(this.st.value)+parseInt(this.ht.value))/4))*5;}
        else if(type == 'speed') {this[aux] = (level-((parseInt(this.st.value)+parseInt(this.ht.value))/4))*20;}
        else if(type == 'dx' || type == 'iq') {this[aux] = (level-10)*20;}
        else {this[aux] = (level-10)*10;}

        $('#'+aux).html('['+this[aux]+']');
    },

    // Calcula o custo total do personagem
    calculateCost: function() {
        var cost = this.stCost+this.dxCost+this.iqCost+this.htCost;
        cost += this.hpCost+this.willCost+this.perCost+this.fpCost;

        $('#advTable [name="advCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});
        $('#disadvTable [name="disadvCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});

        for(var i = 0, len = this.skills.length; i < len; i++) {
            cost += parseFloat(this.skills[i].cost.value);
        }

        $('#cost').val(cost);
    },

    calculateAttr: function(attr, baseAttr) {
        $('#'+attr).val($('#'+baseAttr).val())
        this[attr+'Cost'] = 0;
        $('#'+attr+'Cost').html('[0]');
    },

    calculateMove: function() {
        $('#move').val(Math.floor((parseInt($('#st').val())+parseInt($('#ht').val()))/4));
        sheet.moveCost = 0;
        $('#moveCost').html('[0]');
    },

    calculateSpeed: function() {
        $('#speed').val((parseInt($('#st').val())+parseInt($('#ht').val()))/4);
        sheet.speedCost = 0;
        $('#speedCost').html('[0]');
    },

    calculateThrust: function() {
        var level = this.st.value;

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
        var level = this.st.value;
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
        $('#bl').html("Basic Lift: "+((sheet.st.value*sheet.st.value)/5));
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
        var skill = $('#skillList').val();
        if(skill != '') {
            var tableRef = document.getElementById('skillTable').getElementsByTagName('tbody')[0],
                newRow = tableRef.insertRow(tableRef.rows.length),
                nameCell  = newRow.insertCell(0),
                levelCell = newRow.insertCell(1),
                costCell = newRow.insertCell(2),
                removeCell = newRow.insertCell(3),
                desc = skill.split(';'),
                sheet = this;

            var type = desc[1], attr = desc[2], difficulty = desc[3];
            // Tipo 0 significa que eh habilidade customizada
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
                level.onchange = function() {sheet.calculateCost();};
                levelCell.appendChild(level);
                var cost = document.createElement("input");
                cost.type = "number";
                cost.className = "form-control";
                cost.step = "0.5";
                cost.min = "0.5";
                costCell.appendChild(cost);
            }

            // Tipo 1 significa que eh habilidade padrao com nivel inicial pre estipulado
            else if(desc[1] == '1') {
                var name = document.createElement("p");
                name.innerHTML = desc[0];
                name.className = "col-form-label";
                nameCell.className = "text-left";
                nameCell.appendChild(name);
                var cost = document.createElement("output");
                cost.className = "col-form-label";
                cost.value = 0;
                costCell.appendChild(cost);
                var level = document.createElement("input");
                level.type = "number";
                level.className = "form-control";
                level.min = this[attr].value-(4+parseInt(difficulty));
                level.value = level.min;
                level.onchange = function() {cost.value = sheet.calculateSkill(attr, level.value, difficulty); sheet.calculateCost();};
                levelCell.appendChild(level);
            }
            var newSkill = {type: type, attr: attr, difficulty: difficulty, level: level, cost: cost};
            this.skills.push(newSkill);

            var remove = document.createElement("span");
            remove.innerHTML = "&times;";
            remove.onclick = function() {sheet.skills.splice(sheet.skills.indexOf(newSkill), 1); sheet.deleteRow(newRow); sheet.calculateCost();};
            remove.style.fontSize = "1.5em";
            remove.style.cursor = "pointer";
            removeCell.appendChild(remove);
        }
    },

    calculateSkill: function(attr, level, difficulty) {
        var attrAdder = level-this[attr].value;

        if(attrAdder <= 0-difficulty) {return 1;}
        if(attrAdder <= 1-difficulty) {return 2;}
        return (attrAdder*4)-(4-(difficulty*4));
    },

    updateSkills: function(attr) {
        for(var i = 0, len = this.skills.length; i < len; i++) {
            var skill = this.skills[i];
            if(skill.attr == attr) {
                if(skill.type == 1) {
                    skill.level.min = parseInt(this[attr].value)-(parseInt(skill.difficulty)+4);
                    skill.level.value = skill.level.min;
                    skill.cost.value = 0;
                }
            }
        }
    }
}

function sendEmail() {
    $('#emailSent').fadeIn();
}