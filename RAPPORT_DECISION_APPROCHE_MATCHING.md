# Rapport - Décision d'approche de matching HandiTalents

Date: 8 mai 2026

---

## 1) Objet du rapport

Ce rapport répond à deux questions:
1. **Quelle approche de matching choisir maintenant ?**
2. **Comment l'implémenter réellement dans l'application actuelle ?**

---

## 2) Décision: approche retenue

### Approche choisie
Nous choisissons une **approche hybride explicable en 2 étapes**:

1. **Matching structuré (règles + tags)**
   - compétences,
   - contrat,
   - localisation/remote,
   - disponibilité,
   - accessibilité consentie.

2. **Re-ranking sémantique (embeddings)**
   - similarité entre profil candidat et offre,
   - intégrée dans un score final pondéré,
   - avec explication lisible.

### Pourquoi cette approche est la meilleure ici
- Elle est **forte techniquement** (pas juste mot-clé).
- Elle est **réaliste** avec votre stack actuelle.
- Elle est **explicable** côté utilisateur.
- Elle respecte mieux la sensibilité du domaine handicap.

---

## 3) Base réelle de l'application (point de départ)

### Ce qui existe déjà
- Frontend Next.js
- Backend Express + TypeScript + Drizzle + PostgreSQL
- Offres, candidatures, entretiens, favoris, notifications in-app

### Ce qui n'existe pas encore
- table des recommandations
- moteur de matching automatique
- embeddings/pgvector
- endpoints dédiés recommandations

Conclusion: on peut avancer **sans refonte**, en ajoutant un module matching.

---

## 4) Modèle de matching retenu

## 4.1 Étape A - Pré-sélection structurée

On filtre les candidats incompatibles avant tout scoring:
- offre active,
- candidat disponible,
- contrat compatible,
- localisation compatible (ou remote),
- règles métier de base.

Puis on calcule:
- `skill_score`
- `preference_score`
- `accessibility_score` (uniquement si consentement explicite)

## 4.2 Étape B - Similarité sémantique

On calcule:
- `semantic_score = cosine(embedding_offre, embedding_candidat)`

## 4.3 Score final

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
- `< 0.65` pas de recommandation envoyée

## 4.4 Explicabilité obligatoire

Chaque recommandation stocke:
- compétences matchées,
- compétences manquantes,
- préférences matchées,
- compatibilités accessibilité,
- raison sémantique courte.

---

## 5) Implémentation concrète dans l'app actuelle

## 5.1 Nouvelles tables à ajouter

1. `recommendation`
- `id`, `id_candidat`, `id_offre`,
- `score_final`, `score_semantic`, `score_skills`, `score_preferences`, `score_accessibility`,
- `explanation_json`,
- `status` (`pending|notified|viewed|applied|dismissed`),
- timestamps.

2. `candidate_matching_consent`
- `id_candidat`,
- `allow_accessibility_matching`,
- `allow_semantic_embedding`,
- `updated_at`.

3. V2 embeddings
- `candidate_embeddings`
- `job_offer_embeddings`
- extension `pgvector`.

## 5.2 Services à créer

- `matching.service.ts`
  - `matchPublishedJob(jobOfferId)`
  - `computeStructuredScores(...)`
  - `computeFinalScore(...)`

- `recommendation.service.ts`
  - `upsertRecommendation(...)`
  - `listCandidateRecommendations(...)`
  - `updateRecommendationStatus(...)`

- `embedding.service.ts` (V2)
```ts
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}
```

## 5.3 Point de déclenchement

Déclenchement du matching quand une offre passe en `active`.

## 5.4 Endpoints à exposer

- `GET /api/recommandations/candidat`
- `POST /api/recommandations/:id/view`
- `POST /api/recommandations/:id/dismiss`
- `POST /api/recommandations/:id/apply`
- `PATCH /api/candidats/matching-consent`

## 5.5 Notifications

Réutiliser le système in-app existant:
- type `job_recommendation`,
- message personnalisé avec score et 2-3 raisons.

---

## 6) Plan d'exécution recommandé

### Phase 1 (rapide, robuste)
- table `recommendation`,
- scoring structuré,
- endpoints recommandations,
- notifications in-app.

### Phase 2 (niveau recherche renforcé)
- `pgvector`,
- embeddings candidat/offre,
- re-ranking sémantique,
- ablation study (avec/sans embeddings).

### Phase 3 (industrialisation)
- queue async (BullMQ/Redis),
- anti-spam notifications,
- calibration continue des poids.

---

## 7) Exigences éthiques et données sensibles

Règles non négociables:
- ne jamais utiliser les données médicales dans embeddings,
- utiliser l'accessibilité uniquement sur consentement,
- ne pas classer/exclure une personne sur son handicap,
- stocker et afficher des explications transparentes.

---

## 8) Appui recherche (références)

1. Sentence-BERT (embeddings sémantiques)  
https://arxiv.org/abs/1908.10084

2. Reciprocal Rank Fusion (fusion de signaux de ranking)  
https://doi.org/10.1145/1571941.1572114

3. HNSW (ANN search scaling)  
https://doi.org/10.1109/TPAMI.2018.2889473

4. pgvector (recherche vectorielle PostgreSQL)  
https://github.com/pgvector/pgvector

5. Fairness of Exposure in Rankings  
https://www.kdd.org/kdd2018/accepted-papers/view/fairness-of-exposure-in-rankings

6. NIST AI RMF 1.0 (gouvernance risque IA)  
https://doi.org/10.6028/NIST.AI.100-1

---

## 9) Conclusion

### Décision appliquée
On démarre avec une **approche hybride explicable**:
- structuré d'abord,
- sémantique ensuite,
- score transparent,
- respect strict des données sensibles.

### Pourquoi c'est la bonne décision
C'est la meilleure combinaison entre:
- qualité de matching,
- faisabilité immédiate,
- valeur produit,
- crédibilité technique et recherche.

