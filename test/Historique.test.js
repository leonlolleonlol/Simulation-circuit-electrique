const historique = require('../Historique');
const Resisteur =  require('../Composant');

test('adds 1 + 2 to equal 3', () => {
  let res1 = new Resisteur(58, 265, 25);
  let trest = { type: historique.CREATE, objet: res1 };
  historique.addActions(trest, 0);

  expect(historique.undo_list[historique.undo_list.length-1]).toBe(trest);
});