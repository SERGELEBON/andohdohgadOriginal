-- =====================================================
-- IMPORT DES DONNÉES STATIQUES DU BLOG
-- =====================================================
-- Ce script importe les 6 articles du fichier blog.ts
-- dans la base de données Supabase
-- =====================================================

-- D'abord, obtenir l'ID de l'admin pour author_id
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Récupérer l'ID du premier admin
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- Si pas d'admin, lever une erreur
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Aucun admin trouvé. Créez d'abord un utilisateur admin.';
  END IF;

  -- Article 1 : Réforme fiscale 2025
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    'reforme-fiscale-2025-pme-cote-ivoire',
    'fiscalite',
    admin_id,
    '/images/blog-fiscalite.jpg',
    '2025-06-15 10:00:00+00',
    'active',
    5
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO admin_id; -- Réutilise admin_id pour stocker post_id

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = 'reforme-fiscale-2025-pme-cote-ivoire'),
    'fr',
    'Réforme fiscale 2025 : Ce qui change pour les PME en Côte d''Ivoire',
    'Le gouvernement ivoirien a annoncé plusieurs mesures concernant l''imposition des petites et moyennes entreprises. Voici ce que vous devez savoir pour vous préparer efficacement aux changements à venir.',
    'Le gouvernement ivoirien a récemment annoncé un ensemble de mesures fiscales qui impacteront directement les petites et moyennes entreprises (PME) en 2025. Ces réformes visent à simplifier le système fiscal tout en élargissant l''assiette contributive.

## Principales mesures annoncées

### Nouvelle grille d''imposition

La réforme introduit une nouvelle grille progressive pour l''impôt sur les bénéfices des sociétés (IBS). Les entreprises réalisant un chiffre d''affaires inférieur à 100 millions FCFA bénéficieront d''un taux réduit de 20%, contre 25% actuellement.

### TVA et e-facturation

L''e-facturation devient obligatoire pour toutes les entreprises assujetties à la TVA dès le 1er juillet 2025. Ce système vise à améliorer le recouvrement et à lutter contre la fraude fiscale.

### Crédits d''impôt

De nouveaux crédits d''impôt sont introduits pour encourager l''investissement dans les technologies numériques et la formation des employés. Les entreprises pourront déduire jusqu''à 30% des dépenses engagées dans ces domaines.

## Impact sur votre entreprise

Selon votre secteur d''activité et votre chiffre d''affaires, ces réformes pourront avoir un impact positif ou négatif sur votre situation fiscale. Il est recommandé de :

- Réaliser un diagnostic fiscal approfondi
- Anticiper les ajustements nécessaires
- Former votre équipe comptable aux nouvelles procédures

## Comment nous pouvons vous aider

Notre équipe d''experts fiscaux est à votre disposition pour vous accompagner dans la transition vers ce nouveau régime fiscal. Contactez-nous pour une consultation personnalisée.',
    ARRAY['fiscalité', 'PME', 'Côte d''Ivoire', 'réforme', '2025']
  ) ON CONFLICT (post_id, language) DO NOTHING;

  -- Article 2 : Créer son entreprise
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    'creer-entreprise-cote-ivoire-guide-2025',
    'entrepreneuriat',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    '/images/blog-entrepreneuriat.jpg',
    '2025-06-08 10:00:00+00',
    'active',
    8
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = 'creer-entreprise-cote-ivoire-guide-2025'),
    'fr',
    'Créer son entreprise en Côte d''Ivoire : Le guide complet 2025',
    'De la vérification de la dénomination sociale à l''immatriculation au RCCM, découvrez toutes les étapes pour créer votre entreprise en Côte d''Ivoire en 2025.',
    'La création d''entreprise en Côte d''Ivoire a été considérablement simplifiée ces dernières années grâce aux réformes administratives. Ce guide vous présente toutes les étapes à suivre pour lancer votre activité en toute légalité.

## Étape 1 : Vérifier la disponibilité de votre nom

Avant toute chose, vous devez vérifier que le nom de votre entreprise n''est pas déjà utilisé. Cette démarche se fait en ligne sur le portail du Centre de Promotion des Investissements en Côte d''Ivoire (CEPICI).

## Étape 2 : Choisir votre statut juridique

Le choix du statut juridique est crucial car il détermine vos obligations fiscales et sociales. Les formes les plus courantes en Côte d''Ivoire sont :

- La SARL (Société à Responsabilité Limitée)
- La SAS (Société par Actions Simplifiée)
- L''EI (Entreprise Individuelle)
- Le GIE (Groupement d''Intérêt Économique)

## Étape 3 : Constituer votre dossier

Le dossier de création comprend généralement :

- Les statuts de la société
- Une copie de la pièce d''identité du promoteur
- Un justificatif de domicile
- Une fiche de renseignements
- Le plan de trésorerie prévisionnel

## Étape 4 : Effectuer les formalités

Les formalités d''immatriculation se font auprès du Guichet Unique de Formalisation des Entreprises (GUFE) ou directement en ligne. Le délai moyen est de 48 heures pour une SARL.

## Délais et coûts

Le coût total de création varie entre 50 000 et 300 000 FCFA selon le statut choisi et les frais de notaire éventuels.',
    ARRAY['entrepreneuriat', 'création', 'SARL', 'CEPICI', 'Côte d''Ivoire']
  ) ON CONFLICT (post_id, language) DO NOTHING;

  -- Article 3 : Gestion des talents
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    'gestion-talents-tendances-rh-afrique',
    'rh',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    '/images/blog-rh.jpg',
    '2025-06-01 10:00:00+00',
    'active',
    6
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = 'gestion-talents-tendances-rh-afrique'),
    'fr',
    'Gestion des talents : Les nouvelles tendances RH en Afrique',
    'Le marché du travail africain évolue rapidement. Quelles stratégies adopter pour attirer, fidéliser et développer les talents dans votre entreprise ?',
    'Le continent africain connaît une transformation rapide de son marché du travail. L''arrivée des générations Y et Z, la digitalisation des processus et la montée du travail à distance bouleversent les pratiques RH traditionnelles.

## Les grandes tendances 2025

### Expérience employé au centre

Les entreprises africaines investissent de plus en plus dans l''expérience employé. Un environnement de travail attractif, des opportunités de développement et une reconnaissance régulière sont devenus des leviers essentiels de rétention.

### Digitalisation RH

Les outils de gestion des talents, les plateformes d''évaluation 360° et les solutions de recrutement par IA gagnent du terrain. Ces technologies permettent de prendre des décisions plus éclairées et de réduire les biais.

### Formation continue

Avec l''évolution rapide des compétences requises, la formation continue devient un avantage concurrentiel majeur. Les entreprises qui investissent dans la montée en compétences de leurs équipes enregistrent un taux de rétention supérieur de 35%.

### Diversité et inclusion

La diversité au sein des équipes de direction devient un critère de performance. Les entreprises les plus performantes sont celles qui parviennent à créer des environnements inclusifs.

## Recommandations pour votre entreprise

1. Réalisez un audit RH complet
2. Investissez dans la formation
3. Mettez en place un programme de mentorat
4. Développez votre marque employeur',
    ARRAY['RH', 'talents', 'Afrique', 'digitalisation', 'formation']
  ) ON CONFLICT (post_id, language) DO NOTHING;

  -- Article 4 : Erreurs comptables
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    '5-erreurs-comptables-pme',
    'comptabilite',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    '/images/blog-comptabilite.jpg',
    '2025-05-25 10:00:00+00',
    'active',
    4
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = '5-erreurs-comptables-pme'),
    'fr',
    'Les 5 erreurs comptables qui coûtent cher aux PME',
    'Une erreur comptable peut avoir des conséquences financières graves. Voici les pièges à éviter pour sécuriser votre gestion financière.',
    'La comptabilité est le cœur de toute entreprise. Pourtant, de nombreuses PME commettent des erreurs qui peuvent leur coûter très cher. Voici les 5 erreurs les plus fréquentes et comment les éviter.

## 1. Ne pas tenir sa comptabilité à jour

Le retard dans la saisie comptable est l''erreur la plus fréquente. Elle complique le suivi de la trésorerie et peut entraîner des amendes en cas de contrôle fiscal.

## 2. Confondre charges personnelles et professionnelles

L''absence de séparation entre compte personnel et compte professionnel est une erreur classique qui complique la tenue des livres et peut avoir des implications fiscales.

## 3. Négliger les provisions

Ne pas constituer de provisions pour créances douteuses ou pour congés payés conduit à surestimer le résultat de l''entreprise.

## 4. Oublier les amortissements

Les amortissements doivent être comptabilisés régulièrement. Les oublier fausse la valeur du patrimoine de l''entreprise.

## 5. Ne pas réconcilier les comptes bancaires

L''absence de rapprochement bancaire mensuel empêche de détecter les erreurs et les opérations non enregistrées.

## Conseil

Faites appel à un professionnel pour la tenue de votre comptabilité. C''est un investissement qui vous fera économiser du temps et de l''argent sur le long terme.',
    ARRAY['comptabilité', 'PME', 'erreurs', 'trésorerie', 'fiscal']
  ) ON CONFLICT (post_id, language) DO NOTHING;

  -- Article 5 : Plan stratégique
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    'plan-strategique-entreprise',
    'strategie',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    '/images/blog-strategie.jpg',
    '2025-05-18 10:00:00+00',
    'active',
    7
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = 'plan-strategique-entreprise'),
    'fr',
    'Comment élaborer un plan stratégique pour votre entreprise',
    'Un plan stratégique efficace est votre feuille de route vers la croissance. Découvrez notre méthodologie éprouvée.',
    'Un plan stratégique bien conçu est l''outil indispensable pour piloter la croissance de votre entreprise. Il permet de définir une vision claire, de fixer des objectifs mesurables et d''aligner toutes vos ressources vers un but commun.

## Phase 1 : Le diagnostic

Avant de se projeter, il faut comprendre où l''on en est. Le diagnostic stratégique comprend :

- L''analyse interne (forces et faiblesses)
- L''analyse externe (opportunités et menaces)
- L''analyse de la concurrence
- L''évaluation des performances passées

## Phase 2 : La vision et les objectifs

Sur la base du diagnostic, définissez :

- Votre vision à long terme (5-10 ans)
- Vos objectifs stratégiques (SMART)
- Vos axes de développement prioritaires

## Phase 3 : Les stratégies d''action

Pour chaque objectif, définissez :

- Les actions concrètes à mettre en œuvre
- Les responsables
- Les échéances
- Les indicateurs de suivi (KPIs)

## Phase 4 : Le plan de mise en œuvre

Le plan de mise en œuvre détaille :

- Le budget nécessaire
- Les ressources humaines requises
- Le calendrier des actions
- Les risques potentiels et les plans de contingence

## Phase 5 : Le suivi et l''évaluation

Un plan stratégique vivant nécessite un suivi régulier. Établissez un rythme de revue mensuelle ou trimestrielle pour mesurer vos progrès et ajuster vos actions.',
    ARRAY['stratégie', 'planification', 'objectifs', 'croissance', 'KPI']
  ) ON CONFLICT (post_id, language) DO NOTHING;

  -- Article 6 : Réglementations commerce extérieur
  INSERT INTO blog_posts (slug, category, author_id, cover_image_url, published_at, status, reading_time)
  VALUES (
    'nouvelles-reglementations-commerce-exterieur',
    'reglementation',
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    '/images/blog-reglementation.jpg',
    '2025-05-10 10:00:00+00',
    'active',
    5
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, tags)
  VALUES (
    (SELECT id FROM blog_posts WHERE slug = 'nouvelles-reglementations-commerce-exterieur'),
    'fr',
    'Nouvelles réglementations du commerce extérieur en CI',
    'Les autorités ivoiriennes ont mis à jour les procédures d''import-export. Ce qu''il faut savoir pour vos opérations internationales.',
    'Les autorités ivoiriennes ont récemment adopté de nouvelles réglementations qui impacteront les opérations de commerce extérieur. Ces mesures visent à harmoniser les pratiques avec les standards de l''UEMOA et de la CEDEAO.

## Nouvelles procédures douanières

### Déclaration électronique

Toutes les déclarations d''import-export doivent désormais être effectuées via la plateforme GUCE (Guichet Unique du Commerce Extérieur). Les déclarations papier ne seront plus acceptées à compter du 1er septembre 2025.

### Vérification des produits

Un renforcement des contrôles sanitaires et phytosanitaires est prévu pour les produits agroalimentaires. Les importateurs devront obtenir un certificat de conformité avant l''expédition.

## Incidences fiscales

### Droit de douane

De nouveaux barèmes de droits de douane entrent en vigueur pour certains produits, notamment dans le secteur textile et électronique. Les taux varient entre 5% et 20% selon les catégories.

### Taxe sur la valeur ajoutée (TVA)

La TVA à l''importation reste fixée à 18%, mais de nouvelles exonérations sont prévues pour les équipements industriels.

## Mesures d''accompagnement

Le gouvernement a mis en place un fonds de soutien aux PME exportatrices pour les aider à se conformer aux nouvelles exigences. Les entreprises peuvent également bénéficier d''un accompagnement gratuit auprès du CEPICI.

## Ce que vous devez faire

1. Inscrivez-vous sur la plateforme GUCE
2. Vérifiez la classification douanière de vos produits
3. Mettez à jour vos procédures internes
4. Formez votre équipe commerciale',
    ARRAY['réglementation', 'import-export', 'douane', 'GUCE', 'Côte d''Ivoire']
  ) ON CONFLICT (post_id, language) DO NOTHING;

END$$;

-- =====================================================
-- Vérification
-- =====================================================

SELECT
  bp.slug,
  bp.category,
  bp.status,
  bp.reading_time,
  bpt.title,
  LENGTH(bpt.content) as content_length,
  array_length(bpt.tags, 1) as tags_count
FROM blog_posts bp
JOIN blog_post_translations bpt ON bp.id = bpt.post_id
WHERE bpt.language = 'fr'
ORDER BY bp.published_at DESC;
