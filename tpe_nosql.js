

conn = new Mongo();

db = conn.getDB("ic");

// NOM: SAMANI Darix


// port mongodb important
// pour afficher le résultant d'une requête dans le terminal, affectez le résultant 
// dans une variable cursor ensuite utilisez forEach(printjson) pour l'affichage
//
// exemple q2 = db.getCollection('etudiants').update({nom: 'DOUWE VINCENT'}, {$set: {nom:'DOUWE H. Vincent'}})
// q2.forEach(printjson)



// Rassurez-vous que mongodb toune sur le port 27017 avant de charger le script javascript

db = connect("localhost:27017/ic");

// Question 2.1

db.getCollection('etudiants').update({nom: 'DOUWE VINCENT'}, {$set: {nom:'DOUWE H. Vincent'}})

// Question 2.2

db.getCollection('etudiants').find({matricule: '00E300FS'}, {_id:0, nom:1,})

// Question 2.3

db.getCollection('etudiants').aggregate([
		{$match: {matricule: '00E300FS'}},
		{$project: {_id:0, count:{$size: '$notes'}}}
	])

// Question 2.4

db.getCollection('etudiants').find({niveau: {$exists: true}}).count()

// Question 2.5

db.getCollection('etudiants').aggregate([
		{$group: {_id:'$niveau.intitule', total: {$sum:1}}}
	])

// Question 2.6

db.getCollection('etudiants').aggregate([
		{$addFields : {moy_arith: {$avg: '$notes.valeur'}}},

		{$project: {_id:0, nom: 1, matricule:1, moy_arith: 1}},
	])



// Remarque :
// pour simplifier l'ecriture et la lecture des requetes ci-dessous nous avons utilise le client robot3t


// Question 2.7


db.getCollection('etudiants').aggregate([ 
		{$match: {matricule: '00E300FS'}},
		{$addFields: {CC: {$arrayElemAt: [{$filter: {input:"$notes", as: "notes", cond: { $and: [{$eq: ["$$notes.cours.code", 'ITEL101']}, {$eq: ["$$notes.evaluation.code", 'CC'] }] }}}, 0]},
                              TPE: {$arrayElemAt: [{$filter: {input:"$notes", as: "notes", cond: { $and: [{$eq: ["$$notes.cours.code", 'ITEL101']}, {$eq: ["$$notes.evaluation.code", 'TPE'] }] }}}, 0]},
                              EE: {$arrayElemAt: [{$filter: {input:"$notes", as: "notes", cond: { $and: [{$eq: ["$$notes.cours.code", 'ITEL101']}, {$eq: ["$$notes.evaluation.code", 'EE'] }] }}}, 0]} }},
		{$project: {nom:1,EE:1,TPE:1,EE:1, moy: {$add: [{$multiply: [0.3, "$CC.valeur"]},{$multiply:[0.2, "$TPE.valeur"]},{$multiply:[0.5, "$EE.valeur"]}]}}}
	], { 
        allowDiskUse: true
    })





// Question 2.8

db.getCollection('etudiants').aggregate([

		{$unwind: '$notes'},
		{$group: {_id:{matricule:'$matricule', not:'$notes.cours.code'}, notes_par_ue: {$push:'$notes'},avg:{$avg: '$notes.valeur'}, count: {$sum:1} }},
		{$project:{ notes_par_ue:1,'_id.matricule':1,
			EE:{$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','EE']}}},0]},
			TPE: {$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','TPE']}}},0]},
			CC: {$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','CC']}}},0]}
		}},
		{$project: {notes_par_ue:1,EE:1,TPE:1,CC:1,'_id.matricule':1,
    			moy: {$add: [{$multiply: [0.3, "$CC.valeur"]},{$multiply:[0.2, "$TPE.valeur"]},{$multiply:[0.5, "$EE.valeur"]}]}
		}}
], { 
        allowDiskUse: true
    })

// Question 2.9


db.getCollection('etudiants').aggregate([
		{$unwind: '$notes'},
		{$group: {_id:{matricule:'$matricule', note_par_ue:'$notes.cours.code'}, notes_par_ue: {$push:'$notes'},avg:{$avg: '$notes.valeur'}, count: {$sum:1} }},
		{$project:{ notes_par_ue:1,'_id.matricule':1,

		EE:{$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','EE']}}},0]},
		TPE: {$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','TPE']}}},0]},
		CC: {$arrayElemAt: [{$filter:{input: '$notes_par_ue', as:'note', cond:{$eq:['$$note.evaluation.code','CC']}}},0]}
		}},

		{$project: {notes_par_ue:1,EE:1,TPE:1,CC:1,'_id.matricule':1,
		    moy: {$add: [{$multiply: [0.3, "$CC.valeur"]},{$multiply:[0.2, "$TPE.valeur"]},{$multiply:[0.5, "$EE.valeur"]}]}}},
		    
		{$project:{ notes_par_ue:1,CC:1,credit_cap:{
		    $cond:[{$gte:['$moy', 10]}, '$moy', 0]
		    }}},	    
		{$group: {_id:'$_id.matricule', total:{$sum:'$CC.cours.credits'}}}
		 
	], { 
        allowDiskUse: true
    })

// Question 2.10

db.getCollection('etudiants').update({},

		{$inc:{"notes.$[elem].valeur": 2}},

		{ arrayFilters: [ { "elem.cours.code": { $eq: "ITEL101" }, "elem.evaluation.code": { $eq: "CC" } } ]}

	)






