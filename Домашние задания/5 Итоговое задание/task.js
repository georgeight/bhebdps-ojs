class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.durability = durability;
    this.initDurability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    if (this.durability === Infinity) return;
    this.durability = Math.max(0, this.durability - damage);
  }

  getDamage() {
    if (this.durability <= 0) return 0;
    if (this.initDurability === Infinity) return this.attack;
    if (this.durability >= this.initDurability * 0.3) {
      return this.attack;
    }
    return this.attack / 2;
  }

  isBroken() {
    return this.durability === 0;
  }
}

class Arm extends Weapon {
  constructor() {
    super('Рука', 1, Infinity, 1);
  }
}

class Bow extends Weapon {
  constructor() {
    super('Лук', 10, 200, 3);
  }
}

class Sword extends Weapon {
  constructor() {
    super('Меч', 25, 500, 1);
  }
}

class Knife extends Weapon {
  constructor() {
    super('Нож', 5, 300, 1);
  }
}

class Staff extends Weapon {
  constructor() {
    super('Посох', 8, 300, 2);
  }
}

class LongBow extends Bow {
  constructor() {
    super();
    this.name = 'Длинный лук';
    this.attack = 15;
    this.range = 4;
  }
}

class Axe extends Sword {
  constructor() {
    super();
    this.name = 'Секира';
    this.attack = 27;
    this.durability = 800;
    this.initDurability = 800;
  }
}

class StormStaff extends Staff {
  constructor() {
    super();
    this.name = 'Посох Бури';
    this.attack = 10;
    this.range = 3;
  }
}

class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
  }

  getLuck() {
    return (Math.random() * 100 + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) return 0;
    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck()) / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
    console.log(`${this.description} ${this.name} получает ${damage.toFixed(2)} урона, здоровье ${this.life.toFixed(2)}`);
    return this;
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    const step = Math.min(Math.abs(distance), this.speed);
    this.position -= step;
    console.log(`${this.description} ${this.name} перемещается влево на ${step}. Позиция ${this.position}`);
  }

  moveRight(distance) {
    const step = Math.min(Math.abs(distance), this.speed);
    this.position += step;
    console.log(`${this.description} ${this.name} перемещается вправо на ${step}. Позиция ${this.position}`);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(-distance);
    } else if (distance > 0) {
      this.moveRight(distance);
    }
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      console.log(`${this.description} ${this.name} блокирует атаку: оружие ${this.weapon.name} получает износ.`);
    }

    if (this.dodged()) {
      console.log(`${this.description} ${this.name} уклоняется от удара.`);
      return;
    }

    if (!this.isAttackBlocked()) {
      this.takeDamage(damage);
    }
  }

  checkWeapon() {
    if (!this.weapon.isBroken()) return;
    const chain = this.getWeaponChain();
    for (const WeaponClass of chain) {
      if (!(this.weapon instanceof WeaponClass)) {
        continue;
      }
    }
    const nextWeapon = this.getNextWeapon();
    if (nextWeapon) {
      this.weapon = nextWeapon;
      console.log(`${this.description} ${this.name} сменил оружие на ${this.weapon.name}`);
    }
  }

  getWeaponChain() {
    return [Arm];
  }

  getNextWeapon() {
    const chain = this.getWeaponChain();
    const currentIndex = chain.findIndex((WeaponClass) => this.weapon instanceof WeaponClass);
    if (currentIndex === -1 || currentIndex === chain.length - 1) {
      return null;
    }
    return new chain[currentIndex + 1]();
  }

  tryAttack(enemy) {
    if (enemy.isDead()) return;
    this.checkWeapon();
    const distance = Math.abs(this.position - enemy.position) || 1;
    if (distance > this.weapon.range) {
      console.log(`${this.description} ${this.name} не достаёт до ${enemy.name}.`);
      return;
    }

    const weaponWear = 10 * this.getLuck();
    this.weapon.takeDamage(weaponWear);
    const damage = this.getDamage(distance);
    console.log(`${this.description} ${this.name} атакует ${enemy.name} на дистанции ${distance} с уроном ${damage.toFixed(2)}.`);
    enemy.takeAttack(damage);

    if (this.position === enemy.position) {
      enemy.position += 1;
      const additional = damage * 2;
      console.log(`${enemy.name} отскакивает на 1 позицию и получает дополнительный удар ${additional.toFixed(2)}.`);
      enemy.takeAttack(additional);
    }
  }

  chooseEnemy(players) {
    const enemies = players.filter((player) => player !== this && !player.isDead());
    if (enemies.length === 0) return null;
    return enemies.reduce((winner, enemy) => (enemy.life < winner.life ? enemy : winner), enemies[0]);
  }

  moveToEnemy(enemy) {
    if (!enemy) return;
    const distance = enemy.position - this.position;
    this.move(distance);
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);
    if (!enemy) return;
    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}

class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
  }

  takeDamage(damage) {
    if (this.life < 60 && this.getLuck() > 0.8 && this.magic > 0) {
      const damageToMagic = Math.min(this.magic, damage);
      this.magic -= damageToMagic;
      console.log(`${this.description} ${this.name} защищается магией: магия ${this.magic.toFixed(2)}.`);
      if (damageToMagic < damage) {
        super.takeDamage(damage - damageToMagic);
      }
    } else {
      super.takeDamage(damage);
    }
  }

  getWeaponChain() {
    return [Sword, Knife, Arm];
  }
}

class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';
    this.weapon = new Bow();
  }

  getDamage(distance) {
    if (distance > this.weapon.range) return 0;
    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck() * distance) / this.weapon.range;
  }

  getWeaponChain() {
    return [Bow, Knife, Arm];
  }
}

class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';
    this.weapon = new Staff();
  }

  takeDamage(damage) {
    if (this.magic > 50) {
      const reduced = damage / 2;
      this.magic = Math.max(0, this.magic - 12);
      console.log(`${this.description} ${this.name} сокращает урон до ${reduced.toFixed(2)} и теряет 12 магии.`);
      super.takeDamage(reduced);
      return;
    }
    super.takeDamage(damage);
  }

  getWeaponChain() {
    return [Staff, Knife, Arm];
  }
}

class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.hitCount = 0;
  }

  takeDamage(damage) {
    this.hitCount += 1;
    if (this.hitCount % 6 === 0 && this.getLuck() > 0.5) {
      const reduced = damage / 2;
      console.log(`${this.description} ${this.name} получает в 2 раза меньше урона: ${reduced.toFixed(2)}.`);
      super.takeDamage(reduced);
      return;
    }
    super.takeDamage(damage);
  }

  getWeaponChain() {
    return [Axe, Knife, Arm];
  }
}

class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.life = 85;
    this.attack = 8;
    this.agility = 20;
    this.luck = 15;
    this.description = 'Арбалетчик';
    this.weapon = new LongBow();
  }

  getWeaponChain() {
    return [LongBow, Knife, Arm];
  }
}

class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';
    this.weapon = new StormStaff();
  }

  getDamage(distance) {
    const baseDamage = super.getDamage(distance);
    if (this.magic > 0 && this.getLuck() > 0.6) {
      return baseDamage * 1.5;
    }
    return baseDamage;
  }

  getWeaponChain() {
    return [StormStaff, Knife, Arm];
  }
}

function play(players) {
  let round = 1;
  const alive = () => players.filter((p) => !p.isDead());
  while (alive().length > 1 && round < 1000) {
    console.log(`--- Раунд ${round} ---`);
    const currentPlayers = alive();
    for (const player of currentPlayers) {
      if (!player.isDead()) {
        player.turn(players);
        if (alive().length <= 1) break;
      }
    }
    round += 1;
  }
  const winners = alive();
  if (winners.length === 1) {
    console.log(`Победитель: ${winners[0].description} ${winners[0].name}`);
    return winners[0];
  }
  console.log('Ничья или нет явного победителя.');
  return null;
}

module.exports = {
  Weapon,
  Arm,
  Bow,
  Sword,
  Knife,
  Staff,
  LongBow,
  Axe,
  StormStaff,
  Player,
  Warrior,
  Archer,
  Mage,
  Dwarf,
  Crossbowman,
  Demiurge,
  play,
};
