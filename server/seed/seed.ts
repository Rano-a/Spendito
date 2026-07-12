import { Categorie } from '~/server/models/Categorie'
import { Cycle } from '~/server/models/Cycle'
import { Transaction } from '~/server/models/Transaction'
import { DepenseReguliere } from '~/server/models/DepenseReguliere'
import { ProjetEpargne } from '~/server/models/ProjetEpargne'

const CATEGORIES_PAR_DEFAUT = [
  'Groceries',
  'Restaurants & Outings',
  'Shopping & Misc',
  'Health & Beauty',
  'Transport & Fuel',
  'Miscellaneous'
]

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function daysFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

export async function isDatabaseEmpty() {
  const count = await Categorie.countDocuments()
  return count === 0
}

export async function seedDatabase() {
  await Categorie.deleteMany({})
  await Cycle.deleteMany({})
  await Transaction.deleteMany({})
  await DepenseReguliere.deleteMany({})
  await ProjetEpargne.deleteMany({})

  await Categorie.insertMany(
    CATEGORIES_PAR_DEFAUT.map(nom => ({ nom, parDefaut: true }))
  )

  const depensesRegulieres = await DepenseReguliere.insertMany([
    { nom: 'Rent', montantParDefaut: 650, categorie: 'Miscellaneous' },
    { nom: 'Internet', montantParDefaut: 35, categorie: 'Miscellaneous' },
    { nom: 'Streaming subscription', montantParDefaut: 14.99, categorie: 'Shopping & Misc' }
  ])

  const dateDebut = daysAgo(15)
  const dateFinPrevue = daysFromNow(15)
  const revenuTotal = 2200

  const cycle = await Cycle.create({
    dateDebut,
    dateFinPrevue,
    revenuTotal,
    statut: 'actif'
  })

  await Transaction.create({
    montant: revenuTotal,
    type: 'revenu',
    categorie: 'Salary',
    note: 'Cycle salary',
    date: dateDebut,
    cycleId: cycle._id
  })

  await Transaction.insertMany(
    depensesRegulieres.map(d => ({
      montant: d.montantParDefaut,
      type: 'depense_fixe',
      categorie: d.categorie,
      note: d.nom,
      date: dateDebut,
      cycleId: cycle._id
    }))
  )

  const depensesVariables = [
    { jour: 1, montant: 42.5, categorie: 'Groceries', note: 'Supermarket' },
    { jour: 2, montant: 18.9, categorie: 'Restaurants & Outings', note: 'Lunch' },
    { jour: 3, montant: 25, categorie: 'Transport & Fuel', note: 'Gas' },
    { jour: 4, montant: 63.2, categorie: 'Shopping & Misc', note: 'Clothes' },
    { jour: 6, montant: 15.4, categorie: 'Health & Beauty', note: 'Pharmacy' },
    { jour: 7, montant: 38.0, categorie: 'Groceries', note: 'Supermarket' },
    { jour: 9, montant: 22.5, categorie: 'Restaurants & Outings', note: 'Bar' },
    { jour: 10, montant: 10, categorie: 'Miscellaneous', note: 'Misc' },
    { jour: 12, montant: 47.8, categorie: 'Groceries', note: 'Market' },
    { jour: 13, montant: 30, categorie: 'Transport & Fuel', note: 'Parking' },
    { jour: 14, montant: 19.9, categorie: 'Restaurants & Outings', note: 'Coffee' }
  ]

  await Transaction.insertMany(
    depensesVariables.map(d => ({
      montant: d.montant,
      type: 'depense_variable',
      categorie: d.categorie,
      note: d.note,
      date: daysAgo(15 - d.jour),
      cycleId: cycle._id
    }))
  )

  await Transaction.create({
    montant: 100,
    type: 'epargne',
    categorie: '',
    note: 'Transfer to Summer vacation',
    date: daysAgo(8),
    cycleId: cycle._id
  })

  await ProjetEpargne.insertMany([
    {
      nom: 'Summer vacation',
      montantCible: 1500,
      montantActuel: 450,
      icone: 'Plane',
      couleur: '#0ea5e9',
      principal: true
    },
    {
      nom: 'Emergency fund',
      montantCible: 1000,
      montantActuel: 950,
      icone: 'ShieldCheck',
      couleur: '#22c55e',
      principal: false
    }
  ])

  return { cycle }
}
