// Variavel global, que contem os principais dados que serao utilizados na planilha
var sheet;

// Inicializar a pagina com o custo do personagem
window.onload = function () {
    $("[type='number']").keypress(function(evt) {evt.preventDefault();});
    sheet = newSheet();
    calculateCost();
}

function newSheet() {
    var s = new Object;
    s = {
        st: document.getElementById('st'),
        stCost: 0,
        hp: document.getElementById('hp'),
        hpCost: 0,
        dx: document.getElementById('dx'),
        dxCost: 0,
        will: document.getElementById('will'),
        willCost: 0,
        iq: document.getElementById('iq'),
        iqCost: 0,
        per: document.getElementById('per'),
        perCost: 0,
        ht: document.getElementById('ht'),
        htCost: 0,
        fp: document.getElementById('fp'),
        fpCost: 0,
        speed: document.getElementById('speed'),
        costSpeed: 0,
        move: document.getElementById('move'),
        moveCost : 0,
        advTable: document.getElementById('advTable'),
        skills: []
    }
    return s;
}

// Informa no label o custo da pericia e atualiza o custo na estrutura sheet
function setAttrCost(type) {
    var aux = type+'Cost', level = sheet[type].value;

    if(type == 'hp') {sheet[aux] = (level-sheet.st.value)*2;}
    else if(type == 'fp') {sheet[aux] = (level-sheet.ht.value)*3;}
    else if(type == 'will' || type == 'per') {sheet[aux] = (level-sheet.iq.value)*5;}
    else if(type == 'move') {sheet[aux] = (level-((parseInt(sheet.st.value)+parseInt(sheet.ht.value))/4))*5;}
    else if(type == 'speed') {sheet[aux] = (level-((parseInt(sheet.st.value)+parseInt(sheet.ht.value))/4))*20;}
    else if(type == 'dx' || type == 'iq') {sheet[aux] = (level-10)*20;}
    else {sheet[aux] = (level-10)*10;}

    $('#'+aux).html('['+sheet[aux]+']');
}

// Calcula o custo total do personagem
function calculateCost() {
    var cost = sheet.stCost+sheet.dxCost+sheet.iqCost+sheet.htCost;
    cost += sheet.hpCost+sheet.willCost+sheet.perCost+sheet.fpCost;

    $('#advTable [name="advCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});
    $('#disadvTable [name="disadvCost"]').each(function() {if(this.value != '') cost += parseFloat(this.value);});

    for(var i = 0, len = sheet.skills.length; i < len; i++) {
      cost += parseFloat(sheet.skills[i].cost.value);
    }

	$('#cost').val(cost);
}

function calculateHp() {
    $('#hp').val($('#st').val());
    sheet.hpCost = 0;
    $('#hpCost').html('[0]');
}

function calculateWill() {
    $('#will').val($('#iq').val());
    sheet.willCost = 0;
    $('#willCost').html('[0]');
}

function calculatePer() {
    $('#per').val($('#iq').val());
    sheet.perCost = 0;
    $('#perCost').html('[0]');
}

function calculateFp() {
    $('#fp').val($('#ht').val());
    sheet.fpCost = 0;
    $('#fpCost').html('[0]');
}

function calculateMove() {
    $('#move').val(Math.floor((parseInt($('#st').val())+parseInt($('#ht').val()))/4));
    sheet.moveCost = 0;
    $('#moveCost').html('[0]');
}

function calculateSpeed() {
    $('#speed').val((parseInt($('#st').val())+parseInt($('#ht').val()))/4);
    sheet.speedCost = 0;
    $('#speedCost').html('[0]');
}

function calculateBl() {
    $('#bl').html("Basic Lift: "+((sheet.st.value*sheet.st.value)/5));
}

function calculateThrust() {
    var level = sheet.st.value;

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
}

function calculateSwing() {
    var level = sheet.st.value;
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
}

function newAdvRow() {
    advantage = $('#advList').val();
    if(advantage != '') {
        var tableRef = sheet.advTable.getElementsByTagName('tbody')[0],
            newRow = tableRef.insertRow(tableRef.rows.length),
            nameCell  = newRow.insertCell(0),
            levelCell = newRow.insertCell(1),
            costCell = newRow.insertCell(2),
            removeCell = newRow.insertCell(3),
            desc = advantage.split(';');

        var remove = document.createElement("span");
        remove.innerHTML = "&times;";
        remove.onclick = function() {deleteRow(newRow)};
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
            cost.onchange = function() {calculateCost()};
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
                cost.onchange = function() {calculateCost();}
            }
            else if(desc[1] == '3') {
                var level = document.createElement("input");
                level.type = "number";
                level.min = 1;
                level.className = "form-control";
                level.step = 1;
                level.max = desc[3];
                level.onchange = function() {cost.value = level.value*desc[2]; calculateCost();}
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
                cost.onchange = function() {calculateCost()};
            }

            else if(desc[1] == '5') {
                var cost = document.createElement("input");
                cost.type = "number";
                cost.className = "form-control";
                cost.min = desc[2];
                cost.max = desc[3];
                cost.step = 1;
                costCell.appendChild(cost);
                cost.onchange = function() {calculateCost()};
            }
        }
        cost.name = "advCost";
        calculateCost();
    }
}

function deleteRow(rowRef) {
    $(rowRef).remove();
    calculateCost();
}

function newDisAdvRow() {
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
}

function newSkillRow() {
    var skill = $('#skillList').val();
    if(skill != '') {
        var tableRef = document.getElementById('skillTable').getElementsByTagName('tbody')[0],
            newRow = tableRef.insertRow(tableRef.rows.length),
            nameCell  = newRow.insertCell(0),
            levelCell = newRow.insertCell(1),
            costCell = newRow.insertCell(2),
            removeCell = newRow.insertCell(3),
            desc = skill.split(';');

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
            level.onchange = function() {calculateCost();};
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
            level.min = sheet[attr].value-(4+parseInt(difficulty));
            level.value = level.min;
            level.onchange = function() {cost.value = calculateSkill(attr, level.value, difficulty); calculateCost();};
            levelCell.appendChild(level);
        }
        var newSkill = {type: type, attr: attr, difficulty: difficulty, level: level, cost: cost};
        sheet.skills.push(newSkill);

        var remove = document.createElement("span");
        remove.innerHTML = "&times;";
        remove.onclick = function() {sheet.skills.splice(sheet.skills.indexOf(newSkill), 1); deleteRow(newRow); calculateCost();};
        remove.style.fontSize = "1.5em";
        remove.style.cursor = "pointer";
        removeCell.appendChild(remove);
    }
}

function calculateSkill(attr, level, difficulty) {
    var attrAdder = level-sheet[attr].value;

    if(attrAdder <= 0-difficulty) {return 1;}
    if(attrAdder <= 1-difficulty) {return 2;}
    return (attrAdder*4)-(4-(difficulty*4));
}

function updateSkills(attr) {
    for(var i = 0, len = sheet.skills.length; i < len; i++) {
        var skill = sheet.skills[i];
        if(skill.attr == attr) {
            if(skill.type == 1) {
                skill.level.min = parseInt(sheet[attr].value)-(parseInt(skill.difficulty)+4);
                skill.level.value = skill.level.min;
                skill.cost.value = 0;
            }
        }
    }
}

function sendEmail() {
    $('#emailSent').fadeIn();
}