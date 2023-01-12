function formatGas(gas) {
    if(!gas) return "";
    return "You have " + gas.amount + " " + gas.name + " molecules. (Boiling point: " + gas.boilingPoint + ")" + '<br>';
}



function temperatureConductionLoss(amount, initHalfLife, tickTime, volume, conductionCoef) {
    let radius = Math.cbrt(volume * 3 / (4*Math.PI));
    let surfaceArea = 4 * Math.PI * radius * radius;
    let halfLife = initHalfLife / conductionCoef / surfaceArea;
    let k = halfLife / Math.LN2;
    return amount * (1 - Math.pow(Math.E, -tickTime / k));
}


function changeInputType(container) {
    var list = document.getElementById("C" + container + "InputType");
    var type = list.options[list.selectedIndex].text;
    if(type == "proportion") GasIt[container] = 'p';
    else if(type == "amount") GasIt[container] = 'a';
}

function changeInputNum(container, condition) {
    var c = game.c1;
    if(condition == 1) {
        var a = parseFloat(document.getElementById("C1InputTextBox").value);
    }
    else {
        var a = parseFloat(document.getElementById("C1HeatTextBox").value);
    }
    if(a == null || isNaN(a) || a == Infinity)
        alert("Invalid value. The value needs to be a number under 1.8e308.");
    else {
        if(condition == 1) {
            c.ing = a;
            inputGas(container);
        }
        else {
            c.inh = a;
            heatC1(c.inh);
        }
    }
}

function inputGas(container) {
    var c = game.c1;
    if(GasIt[container] == 'p') {
        if(c.ing > 1) alert("You cannot have a proportion over 1.");
        else if(c.ing < 0) alert("Did you really think you could have a NEGATIVE proportion??? lol nope");
        else addH2toC1(c.ing);
    }
    else {
        if(c.in < 0) alert("You really thought you could REMOVE gases this way. lol nope, nice try.");
        else addH2toC1(Math.round(-1 * c.in));
    }
}



function gasTypeNum(container) {
    let count = 0;
    for(let i = 0; i < container.length; i++) {
        if(container[i] != null)
            count++;
    }
    return count;
}

function moleculeNum(container) {
    let count = 0;
    for(let i = 0; i < container.length; i++) {
        if(container[i] != null)
            count += container[i].amount;
    }
    return count;
}

function minBoilingPoint(container) {
    let min = 0;
    for(let i = 0; i < container.length; i++) {
        if(!(container[i] == null) && (container[i].boilingPoint < min || min == 0))
            min = container[i].boilingPoint;
    }
    return min;
}



function initializeC1(name, amount) {
    let numMolecules = moleculeNum(game.c1.gases);
    let nt = numMolecules * game.c1.t;
    for(let i = 0; i < game.c1.gases.length; i++) {
        if(game.c1.gases[i] == null) {
            game.c1.gases[i] = new Gas(name, amount);
            game.c1.t = (nt + amount) / (numMolecules + amount);
            document.getElementById("c1g" + (i+1) + "D").innerHTML = formatGas(game.c1.gases[i]);
            return;
        }
    }
    alert("You've reached the maximum number of gases this container can hold at once. Try flushing the container.");
}

function heatC1(proportion) {
    var c = game.c1;
    if(c.inh > 1) alert("You cannot have a proportion over 1.");
    else if(c.inh < 0) alert("Did you really think you could have a NEGATIVE proportion??? lol nope");
    else{
        let numMolecules = moleculeNum(game.c1.gases);
        let spentEnergy = game.energy * proportion
        game.c1.t = Math.pow(Math.pow(game.c1.t, 3) + spentEnergy*3e-9/numMolecules, 1/3);
        game.energy *= (1-proportion);

        document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
        document.getElementById("c1TD").innerHTML = format(game.c1.t, 2);
        document.getElementById("neutrinoGasBonusD").innerHTML = format(game.neutrinoEffectExponent, 3);
        document.getElementById("neutronGasBonusD").innerHTML = format(game.neutronEffectExponent, 3);
    }
}


function addH2toC1(proportion) {
    let hydrogens = Math.round(game.H + game.deu + game.tritium);
    if(hydrogens == 0 || game.energy < 2e8) return;
    let H1prop = Math.min(1, Math.max(0, game.H / hydrogens));
    let H2prop = Math.min(1, Math.max(0, Math.round(1e12 * game.deu / hydrogens / (1-H1prop) / 1e12)));
    if(H1prop == 1) H2prop = 0;
    let buys = 1;
    let numMolecules = moleculeNum(game.c1.gases);
    let nt = numMolecules * game.c1.t;
    /*if(proportion == -1) {
        if(Math.random() < H1prop)
            game.H--;
        else if(Math.random() < H2prop)
            game.deu--;
        else
            game.tritium--;
    }
    else */if(proportion == 1 && game.energy / 1e8 >= hydrogens) {
        buys = Math.floor(hydrogens / 2);
        game.H = 0;
        game.deu = 0;
        game.tritium = 0;
        if(hydrogens % 2 == 1) {
            if(Math.random() < H1prop)
                game.H++;
            else if(Math.random() < H2prop)
                game.deu++;
            else
                game.tritium++;
        }
    }
    else {
        if(proportion >= 0) { //proportion is actually proportion
            var remaining = Math.floor(Math.min(hydrogens * proportion, game.energy / 1e8 * proportion));
        }
        else { //proportion is actually amount
            var remaining = Math.floor(Math.min(hydrogens, game.energy / 1e8, Math.round(-1 * proportion)));
        }
        let totalSpent = remaining;
        let parity = totalSpent % 2;
        buys = Math.floor(remaining / 2);
        if(buys == 0) return;
        let H1buys = Math.round(Math.min(game.H, Math.max(0, totalSpent - hydrogens + game.H, normal(remaining * H1prop, Math.sqrt(remaining * H1prop * (1-H1prop))))));
        remaining -= H1buys;
        game.H -= H1buys;
        let H2buys = Math.round(Math.min(game.deu, Math.max(0, normal(remaining * H2prop, Math.sqrt(remaining * H2prop * (1-H2prop))))));
        remaining -= H2buys;
        game.deu -= H2buys;
        game.tritium -= remaining;
        if(parity == 1) {
            if(Math.random() < H1prop)
                game.H++;
            else if(Math.random() < H2prop)
                game.deu++;
            else
                game.tritium++;
        }
    }
    game.energy -= 2e8 * buys;
    let i = 0;
    while(i < game.c1.gases.length && buys != 0) {
        if(!(game.c1.gases[i] == null) && game.c1.gases[i].name == "H2") {
            game.c1.gases[i].amount += buys;
            game.c1.t = (nt + buys) / (numMolecules + buys);
            document.getElementById("c1g" + (i+1) + "D").innerHTML = formatGas(game.c1.gases[i]);
            buys = 0;
        }
        i++;
    }
    if(buys != 0) {
        initializeC1("H2", buys);
    }
    updateHPower();
    document.getElementById("H1D").innerHTML = game.H;
    document.getElementById("H1P").innerHTML = format(Math.pow(game.H + 1, HEffectExponent[0]), 2);
    document.getElementById("H2D").innerHTML = game.deu;
    document.getElementById("H2P").innerHTML = format(Math.pow(game.deu + 1, HEffectExponent[1]), 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("c1TD").innerHTML = format(game.c1.t, 2);
    document.getElementById("neutrinoGasBonusD").innerHTML = format(game.neutrinoEffectExponent, 3);
    document.getElementById("neutronGasBonusD").innerHTML = format(game.neutronEffectExponent, 3);
}




function flushC1() {
    for(let i = 0; i < game.c1.gases.length; i++) {
        game.c1.gases[i] = null;
    }
    game.c1.p = 0;
    game.c1.t = 0;
    game.c1.v = 1;
    document.getElementById("c1PD").innerHTML = format(game.c1.p, 2);
    document.getElementById("c1TD").innerHTML = format(game.c1.t, 2);
    document.getElementById("c1VD").innerHTML = format(game.c1.v, 2);
    document.getElementById("c1g1D").innerHTML = formatGas(game.c1.gases[0]);
    document.getElementById("c1g2D").innerHTML = formatGas(game.c1.gases[1]);
    document.getElementById("neutrinoGasBonusD").innerHTML = format(game.neutrinoEffectExponent, 3);
    document.getElementById("neutronGasBonusD").innerHTML = format(game.neutronEffectExponent, 3);
}


function calcTemp1() {
    game.c1.t -= temperatureConductionLoss(game.c1.t, 1000, 1/30, game.c1.v, 1);
    let boilingPoint = minBoilingPoint(game.c1.gases);
    if(game.c1.t < boilingPoint)
        game.c1.t = boilingPoint;
    updateNeutrinoPower();
    updatePePower();
    document.getElementById("c1TD").innerHTML = format(game.c1.t, 2);
    document.getElementById("neutrinoGasBonusD").innerHTML = format(game.neutrinoEffectExponent, 3);
    document.getElementById("neutrinoP0").innerHTML = Math.round(1 + game.neutrino);
    document.getElementById("neutrinoP").innerHTML = format(game.neutrinoPower, 1);
    document.getElementById("neutronGasBonusD").innerHTML = format(game.neutronEffectExponent, 3);
    document.getElementById("neutronP").innerHTML = format(game.neutronPower, 2);
    document.getElementById("energyDisplay").innerHTML = format(game.energy, 0);
    document.getElementById("protonP").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("energyS").innerHTML = format(game.Hpower * game.protonPower * game.ach.power * 1000 / game.protonSpeed, 2);
    document.getElementById("electronP").innerHTML = format(game.Hpower * game.electronPower * game.ach.power, 2);
    document.getElementById("clickD").innerHTML = format(game.Hpower * game.clickPower * game.ach.power, 2);
}

function calcPressure1() {
    let pv = game.c1.t * moleculeNum(game.c1.gases);
    if(pv > 1e6) {
        game.c1.v = Math.pow(pv / 1e6, 0.3);
        game.c1.p = pv / game.c1.v;
    }
    else {
        game.c1.v = 1;
        game.c1.p = pv;
    }
    document.getElementById("c1VD").innerHTML = format(game.c1.v, 2);
    document.getElementById("c1PD").innerHTML = format(game.c1.p, 2);
}




setInterval(function() {
    calcTemp1();
    calcPressure1();
}, 1000/30)
