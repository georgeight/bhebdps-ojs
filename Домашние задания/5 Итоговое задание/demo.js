const {
  Warrior,
  Archer,
  Mage,
  Dwarf,
  Crossbowman,
  Demiurge,
  play,
} = require('./task');

const players = [
  new Warrior(0, 'Алёша Попович'),
  new Archer(3, 'Леголас'),
  new Mage(6, 'Гендальф'),
  new Dwarf(9, 'Гном'),
  new Crossbowman(12, 'Арбалетчик'),
  new Demiurge(15, 'Демиург'),
];

console.log('=== Начало сценария боя ===');
console.log('Игроки:');
players.forEach((player) => {
  console.log(`- ${player.description} ${player.name}, позиция ${player.position}, оружие ${player.weapon.name}`);
});

const winner = play(players);

if (winner) {
  console.log(`\nПобедитель: ${winner.description} ${winner.name}`);
} else {
  console.log('\nБой закончился без явного победителя.');
}
