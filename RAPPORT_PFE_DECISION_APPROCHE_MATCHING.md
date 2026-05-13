# Rapport PFE - Décision d'approche de matching HandiTalents

Date: 8 mai 2026  
Auteur: Proposition technique basée sur l'application existante HandiTalents

---

## 1) Décision finale (une seule approche retenue)

### Approche retenue
Nous retenons une **approche hybride neuro-symbolique explicable** en 2 étages:

1. **Étape A - Candidate generation structurée**  
   Filtres métiers + tags + compatibilités explicites (contrat, localisation, disponibilité, compétences).

2. **Étape B - Re-ranking sémantique + score explicable**  
   Similarité embeddings + score global pondéré + explication lisible ("Pourquoi cette offre ?").

Cette approche est la meilleure pour ton PFE parce qu'elle est:
- **académiquement solide** (IR + NLP + ranking + fairness),
- **réaliste techniquement** dans votre code actuel,
- **défendable dans un rapport** avec métriques et protocole d'évaluation.

---

## 2) Pourquoi cette approche est la bonne pour ton PFE

### 2.1 Valeur scientifique
Tu combines 4 axes de recherche dans un seul système:
- recherche d'information (retrieval/ranking),
- NLP sémantique (embeddings),
- explicabilité (features de matching),
- gouvernance/fairness pour données sensibles.

### 2.2 Valeur ingénierie
Vous avez déjà:
- backend Express + TypeScript + Drizzle + PostgreSQL,
- offres/candidatures/notifications déjà en prod locale.

Donc on **n'a pas besoin de réécrire la plateforme** pour prouver une vraie innovation.

### 2.3 Valeur produit
Le candidat ne voit pas juste "82%".  
Il voit:
- compétences matchées,
- préférences matchées,
- éléments manquants,
- raison sémantique courte.

---

## 3) Ancrage réel dans votre application actuelle

## 3.1 Ce qui existe déjà (et qu'on réutilise)
- Offres et publication d'offres
- Candidatures et statuts
- Notifications in-app
- Profils candidat et entreprise
- Champs accessibilité côté candidat/offre déjà présents

### 3.2 Ce qui manque
- table `recommendation`
- service `matching`
- embeddings + pgvector
- endpoints recommandations candidat
- pipeline explicable de scoring

### 3.3 Contrainte sensible
Les champs handicap existent déjà dans le modèle candidat.  
Pour le matching, on impose:
- **pas de données médicales dans embeddings**,
- **pas de pénalisation de personne**,
- usage des besoins d'aménagement uniquement avec consentement.

---

## 4) Design de l'approche retenue

## 4.1 Étape A - Candidate generation (structuré)

Entrée: `job_offer_id` publié.

Préfiltrage SQL:
- offre active,
- candidat disponible,
- contrat compatible,
- zone géographique compatible ou remote,
- exclusion des candidats déjà rejetés/déjà postulé selon règle produit.

Score structuré initial:
- `skill_score` (required + nice to have),
- `preference_score`,
- `accessibility_score` (consenti, non médical).

Sortie: top N candidats (ex: 200) à passer à l'étape B.

## 4.2 Étape B - Re-ranking sémantique

Pour chaque candidat top N:
- calcul `semantic_score = cosine(embedding_job, embedding_candidate)`.

Score final:
```txt
final_score =
  0.40 * semantic_score +
  0.30 * skill_score +
  0.20 * preference_score +
  0.10 * accessibility_score
```

Seuils:
- `>= 0.80` notification immédiate
- `0.65 - 0.79` recommandation visible sans push agressif
- `< 0.65` non recommandé

## 4.3 Explicabilité

On stocke un `explanation_json` par recommandation:
```json
{
  "matchedSkills": ["React", "TypeScript"],
  "missingSkills": ["Jest"],
  "preferenceMatches": ["CDI", "Remote"],
  "accessibilityMatches": ["Horaires flexibles"],
  "semanticReason": "Profil proche des missions frontend de l'offre."
}
```

---

## 5) Justification recherche (sources)

Les choix méthodologiques sont alignés avec la littérature:

1. **Embeddings phrase-level pour similarité sémantique**
- Reimers & Gurevych, *Sentence-BERT* (2019):  
  https://arxiv.org/abs/1908.10084

2. **Fusion robuste de signaux de ranking**
- Cormack et al., *Reciprocal Rank Fusion* (SIGIR 2009):  
  https://doi.org/10.1145/1571941.1572114

3. **Scaling ANN / nearest neighbors**
- Malkov & Yashunin, *HNSW* (TPAMI):  
  https://doi.org/10.1109/TPAMI.2018.2889473

4. **Moteur vectoriel pratique sur PostgreSQL**
- pgvector (documentation projet):  
  https://github.com/pgvector/pgvector

5. **Fairness dans les systèmes de ranking**
- Singh & Joachims, *Fairness of Exposure in Rankings* (KDD 2018):  
  https://www.kdd.org/kdd2018/accepted-papers/view/fairness-of-exposure-in-rankings

6. **Gouvernance du risque IA**
- NIST AI RMF 1.0 (2023):  
  https://doi.org/10.6028/NIST.AI.100-1

7. **Cadre données sensibles (référence de principe)**
- GDPR Art. 9 (catégories particulières):  
  https://gdpr-info.eu/art-9-gdpr/

---

## 6) Implémentation réelle dans votre code (plan concret)

## 6.1 Nouvelles tables (Drizzle + SQL)

### Table `recommendation`
- `id`
- `id_candidat`
- `id_offre`
- `score_final`
- `score_semantic`
- `score_skills`
- `score_preferences`
- `score_accessibility`
- `explanation_json` (jsonb)
- `status` (`pending|notified|viewed|applied|dismissed`)
- `created_at`, `updated_at`
- unique (`id_candidat`, `id_offre`)

### Table `candidate_matching_consent`
- `id_candidat` PK
- `allow_accessibility_matching` bool
- `allow_semantic_embedding` bool
- `updated_at`

### Tables embeddings (SQL manuel)
- `candidate_embeddings(candidate_id, embedding vector(d), source_hash, updated_at)`
- `job_offer_embeddings(job_offer_id, embedding vector(d), source_hash, updated_at)`

## 6.2 Services à créer

- `matching.service.ts`
  - `matchPublishedJob(jobOfferId)`
  - `computeStructuredScores(candidateId, jobOfferId)`
  - `computeFinalScore(...)`

- `embedding.service.ts`
  - provider pattern:
```ts
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  dimension(): number;
}
```

- `recommendation.service.ts`
  - upsert + lifecycle status

## 6.3 Endpoints à ajouter

- `GET /api/recommandations/candidat`
- `POST /api/recommandations/:id/view`
- `POST /api/recommandations/:id/dismiss`
- `POST /api/recommandations/:id/apply`
- `PATCH /api/candidats/matching-consent`
- `GET /api/candidats/matching-consent`

## 6.4 Point de déclenchement

Au moment où une offre passe en `active`:
- hook dans le flux de changement de statut offre
- lancement matching asynchrone (worker léger puis BullMQ plus tard si besoin)

## 6.5 Notifications

Réutiliser le système in-app existant avec un nouveau type:
- `job_recommendation`

---

## 7) Protocole expérimental PFE (important pour le rapport)

## 7.1 Jeu de test
- offres réelles (Tunisie) + profils candidats réels anonymisés
- split temporel (train/validation/test) ou simulation offline

## 7.2 Baselines comparées
- Baseline A: matching mots-clés simple
- Baseline B: matching structuré sans sémantique
- Méthode proposée: hybride structuré + embeddings + explicabilité

## 7.3 Métriques
- Precision@K
- Recall@K
- NDCG@K
- CTR recommandation -> offre
- Conversion recommandation -> candidature
- Taux de rejet "non pertinent"

## 7.4 Hypothèses attendues
- amélioration NDCG/Precision par rapport à baseline mots-clés
- meilleure qualité perçue grâce aux explications
- réduction du bruit de recommandations

---

## 8) Plan de réalisation (calendrier conseillé)

### Sprint 1
- schéma DB recommandations + consentement
- endpoint recommandations candidat
- scoring structuré V1

### Sprint 2
- explication JSON + UI "Pourquoi cette offre ?"
- notifications in-app de recommandation
- instrumentation métriques

### Sprint 3
- pgvector + embeddings
- score sémantique dans ranking
- comparaison expérimentale finale

### Sprint 4 (bonus)
- BullMQ/Redis
- anti-spam notifications
- réglage des poids par validation

---

## 9) Risques et garde-fous

Risque 1: recommandations non pertinentes  
-> calibration seuils + feedback utilisateur.

Risque 2: dérive sur données sensibles  
-> consentement explicite + séparation stricte des champs.

Risque 3: coût de calcul embeddings  
-> cache `source_hash` + recalcul uniquement si profil/offre modifié.

Risque 4: dette technique  
-> implémentation incrémentale sans refonte globale.

---

## 10) Conclusion

Pour un PFE fort, la meilleure décision est:

**Approche hybride neuro-symbolique explicable**, implémentée en priorité sur l'architecture existante, puis enrichie par embeddings et évaluation scientifique.

C'est à la fois:
- crédible académiquement,
- réalisable dans votre code actuel,
- utile produit,
- soutenable éthiquement pour HandiTalents.

---

## 11) Prochain livrable conseillé

Transformer ce rapport en:
1. backlog technique détaillé (tickets),
2. plan de tests expérimental (dataset + scripts + métriques),
3. structure de chapitre PFE (méthodologie + résultats).

