# Rapport d'execution - Matching recommandations HandiTalents

Date: 8 mai 2026

## 1) Perimetre execute

Systeme traite:
- Recommandation offres -> candidats (independant du shortlisting entreprise)

Hors perimetre:
- Moteur d'embeddings shortlisting entreprise
- V2 pgvector (non demarre)

## 2) Travaux realises

### Backend
- Schema recommandations et consentement deja en place, conserve.
- Validation API recommandations:
  - `GET /api/recommandations/candidat`
  - `POST /api/recommandations/:id/view`
  - `POST /api/recommandations/:id/dismiss`
  - `POST /api/recommandations/:id/apply`
  - `GET/PATCH /api/recommandations/consentement`
- Script ajoute pour recalcul global:
  - `npm run matching:recompute`
  - Fichier: `scripts/generer-recommandations.ts`
- Correction bug critique scoring:
  - Avant: score final impossible a faire passer le seuil (0 recommandations).
  - Apres: calibration V1 structured-only + seuils ajustes.

### Frontend
- Integration dans `app/home/page.tsx` cote candidat:
  - Lecture des vraies recommandations via `/api/recommandations/candidat`
  - Affichage score match, tags et salaire
  - Actions UI:
    - Voir l'offre (marque `viewed`)
    - Ignorer (marque `dismissed`)
    - J'ai postule (marque `applied`)
  - Etats UX:
    - loading
    - empty state
    - erreur
- Ajustement style:
  - `.candidate-dashboard-ref__job-actions` ajoute dans `app/globals.css`

### Donnees / seed
- Seed conserve (sans suppression) via `npm run seed:donnees-reelles`
- Recalcule recommandations execute apres seed.

## 3) Resultats verifies

- Typecheck backend: OK
- Recompute matching:
  - offres traitees: 59
  - recommandations generees: 33
  - candidats notifies: 1
- Verification endpoints en local avec compte candidat:
  - lecture recommandations: OK
  - transition de statut `viewed`: OK
  - transition de statut `applied`: OK
  - consentement matching (GET/PATCH): OK

## 4) Fichiers modifies/ajoutes

Backend:
- `handi_talents-main/src/services/matching.service.ts`
- `handi_talents-main/scripts/generer-recommandations.ts` (nouveau)
- `handi_talents-main/scripts/reset-password.ts` (outil utilitaire)
- `handi_talents-main/package.json`

Frontend:
- `handi_front-master/app/home/page.tsx`
- `handi_front-master/app/globals.css`

Pilotage:
- `MATCHING_EXECUTION_CHECKLIST.md`

## 5) Reste a faire

- Test manuel UI complet dans le navigateur:
  - publication offre -> recommendation visible -> action candidat -> verification notification
- Debut V2 recherche:
  - embeddings + pgvector + re-ranking semantique

## 6) Mise a jour V2 (8 mai 2026 - apres execution)

### Realise
- Script d'initialisation V2 ajoute:
  - `npm run matching:init-vector`
  - Fichier: `handi_talents-main/scripts/init-pgvector-matching.ts`
- Migration SQL V2 ajoutee:
  - `handi_talents-main/sql/2026-05-08_pgvector_matching_v2.sql`
- Structures embeddings creees:
  - `candidate_embeddings`
  - `job_offer_embeddings`
- Socle code V2 ajoute:
  - `src/services/embedding.provider.ts`
  - `src/services/embedding-text-builder.service.ts`

### Etat technique actuel sur la machine locale
- Extension `vector` non disponible sur PostgreSQL local.
- Initialisation executee en mode fallback dev:
  - type colonne `embedding`: `double precision[]`
- Resultat script:
  - `has_vector_extension: false`
  - `has_candidate_embeddings: true`
  - `has_job_offer_embeddings: true`

### Action infra restante pour passer en vrai pgvector
- Installer l'extension `pgvector` dans l'instance PostgreSQL locale.
- Relancer:
  - `npm run matching:init-vector`
- Le script detectera automatiquement la presence de `vector` et appliquera le mode natif.

## 7) Avancement V2 supplementaire (8 mai 2026)

### Realise
- Generation embeddings branchee:
  - `npm run matching:sync-embeddings`
  - Provider actif sur la machine: `hash-256` (fallback local)
- Re-ranking semantique active dans le moteur:
  - Fichier: `src/services/matching.service.ts`
  - Similarite cosinus calculee si:
    - consentement semantique actif
    - embeddings offre + candidat presents
- Stockage embeddings:
  - Fichier: `src/services/embedding-storage.service.ts`
  - Compatible mode `vector` natif et fallback `double precision[]`

### Resultats apres execution
- Sync embeddings:
  - candidats embeddes: `9`
  - offres embeddes: `60`
- Recompute matching apres embeddings:
  - offres traitees: `60`
  - recommandations generees: `31`
  - candidats notifies: `5`

### Etat restant pour completer V2 "recherche forte"
- Installer extension `pgvector` locale (infra)
- Basculer provider IA reel (OpenAI embeddings) via `OPENAI_API_KEY`
