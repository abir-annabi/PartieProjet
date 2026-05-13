# HandiTalents - Execution Checklist (Recommendation System)

Date de démarrage: 8 mai 2026

## Scope verrouillé
- [x] Système ciblé: recommandations candidat <-> offres publiées
- [x] Système indépendant: shortlisting entreprise non modifié
- [x] V1: matching structuré explicable + notifications in-app
- [ ] V2: embeddings + pgvector + re-ranking sémantique

## V2 - Progression
- [x] Script d'initialisation embeddings DB (`matching:init-vector`)
- [x] Tables `candidate_embeddings` et `job_offer_embeddings` créées
- [x] Mode fallback activé si extension `vector` absente (`double precision[]`)
- [x] Interface `EmbeddingProvider` ajoutée
- [x] Builder de texte embeddings candidat/offre ajouté
- [x] Pipeline de génération embeddings (`matching:sync-embeddings`)
- [x] Re-ranking sémantique branché dans le `matching.service.ts`
- [ ] Installation native `pgvector` sur PostgreSQL local
- [ ] Génération embeddings réels (provider IA via clé OpenAI)

## Backend V1
- [x] Schéma `recommendation` ajouté
- [x] Schéma `candidate_matching_consent` ajouté
- [x] Service `matching.service.ts` en place
- [x] Trigger sur publication d'offre (`active`) en place
- [x] Routes recommandations exposées
- [x] Vérification fonctionnelle des endpoints en local
- [x] Ajustement scoring/seuils après test réel

## Frontend candidat
- [x] Bloc/page recommandations candidat branché à l'API backend
- [x] Affichage score + raisons de matching
- [x] Actions: voir / ignorer / postuler
- [x] Empty state + loading state + feedback succès/erreur

## Données de test
- [x] Seed offres tunisiennes supplémentaires (sans suppression)
- [x] Seed profils candidats supplémentaires (sans suppression)
- [x] Seed cohérent compétences/préférences pour matching

## Validation
- [x] Typecheck backend
- [x] Test manuel flow complet: publication offre -> reco -> notification -> postulation
- [x] Corrections de bugs après test

## Documentation finale
- [x] Rapport de réalisation (ce qui est fait / restant / prochaines étapes)
