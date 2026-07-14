-- Seed services from existing data

-- Service 1: Accompagnement comptable et fiscal
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('comptable-fiscal', 'Calculator', 'active', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Accompagnement comptable et fiscal',
    'Tenue comptable, declarations fiscales, optimisation fiscale et conseil personnalise pour maitriser votre environnement financier.',
    'Andoh & Dohgad Consulting vous accompagne dans la gestion de votre comptabilite et de vos obligations fiscales. Notre equipe d''experts assure la tenue de vos livres, l''etablissement de vos etats financiers et le respect de vos declarations aupres des autorites competentes.',
    ARRAY['Tenue comptable irreguliere', 'Conformite fiscale incertaine', 'Optimisation fiscale insuffisante', 'Manque de visibilite financiere'],
    'Notre expertise approfondie de la fiscalite ivoirienne et notre approche personnalisee nous permettent de vous offrir des solutions adaptees a votre secteur d''activite et a votre taille.',
    '[
        {"step": "01", "title": "Diagnostic financier", "description": "Analyse complete de votre situation comptable et fiscale actuelle"},
        {"step": "02", "title": "Mise en conformite", "description": "Regularisation et mise a jour de vos declarations"},
        {"step": "03", "title": "Accompagnement mensuel", "description": "Tenue comptable reguliere et declarations periodiques"},
        {"step": "04", "title": "Rapport et recommandations", "description": "Etats financiers et conseils d''optimisation"}
    ]'::JSONB,
    ARRAY['Tenue comptable et etablissement des etats financiers', 'Declarations fiscales et sociales (DGI, CNPS)', 'Optimisation fiscale et planification patrimoniale', 'Assistance lors des controles fiscaux']
FROM services s WHERE s.slug = 'comptable-fiscal'
ON CONFLICT (service_id, language) DO NOTHING;

-- Service 2: Gestion des ressources humaines
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('ressources-humaines', 'Users', 'active', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Gestion des ressources humaines',
    'Recrutement, paie, formation, gestion des talents et conformite sociale pour batir des equipes performantes.',
    'Nous offrons des solutions completes en gestion des ressources humaines pour vous aider a recruter, former et retenir les meilleurs talents tout en assurant la conformite avec la legislation du travail.',
    ARRAY['Difficultes de recrutement', 'Gestion de paie complexe', 'Non-conformite sociale', 'Turnover eleve'],
    'Notre connaissance du marche de l''emploi ivoirien et notre methodologie eprouvee en gestion des talents font de nous un partenaire RH de choix.',
    '[
        {"step": "01", "title": "Audit RH", "description": "Evaluation complete de votre fonction RH"},
        {"step": "02", "title": "Plan d''action", "description": "Elaboration de strategies RH adaptees"},
        {"step": "03", "title": "Mise en oeuvre", "description": "Deploiement des solutions identifiees"},
        {"step": "04", "title": "Suivi et ajustement", "description": "Evaluation et optimisation continue"}
    ]'::JSONB,
    ARRAY['Recrutement et selection de profils', 'Gestion de la paie et des declarations sociales', 'Formation et developpement des competences', 'Conseil en organisation et management']
FROM services s WHERE s.slug = 'ressources-humaines'
ON CONFLICT (service_id, language) DO NOTHING;

-- Service 3: Creation et structuration d'entreprise
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('creation-entreprise', 'Building2', 'active', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Creation et structuration d''entreprise',
    'Du choix du statut juridique aux formalites d''immatriculation, nous vous guidons dans chaque etape de votre creation.',
    'Vous avez un projet entrepreneurial ? Nous vous guidons de A a Z dans la creation de votre entreprise, du choix du statut juridique a l''immatriculation finale.',
    ARRAY['Statut juridique mal adapte', 'Formalites complexes', 'Manque de conseil structure', 'Delai de creation long'],
    'Notre experience dans l''accompagnement de plus de 200 creations d''entreprise nous permet d''anticiper les obstacles et d''accelerer vos demarches.',
    '[
        {"step": "01", "title": "Etude de faisabilite", "description": "Analyse de votre projet et du marche"},
        {"step": "02", "title": "Choix de la structure", "description": "Selection du statut juridique optimal"},
        {"step": "03", "title": "Constitution du dossier", "description": "Preparation et depot des documents"},
        {"step": "04", "title": "Immatriculation", "description": "Obtention du RCCM et lancement"}
    ]'::JSONB,
    ARRAY['Choix du statut juridique adapte', 'Verification de la denomination sociale', 'Constitution du dossier et formalites', 'Immatriculation au RCCM et a la DGI']
FROM services s WHERE s.slug = 'creation-entreprise'
ON CONFLICT (service_id, language) DO NOTHING;

-- Service 4: Conseil et accompagnement strategique
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('conseil-strategique', 'TrendingUp', 'active', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Conseil et accompagnement strategique',
    'Analyse de marche, planification strategique, tableaux de bord et conseil en gestion pour des decisions eclairees.',
    'Nos consultants en strategie vous aident a definir une vision claire, a etablir des objectifs mesurables et a mettre en place les outils de pilotage necessaires.',
    ARRAY['Strategie floue', 'Croissance sans plan', 'Manque d''indicateurs', 'Concurrence agressive'],
    'Une approche basee sur les donnees et l''experience terrain pour des recommandations actionnables et mesurables.',
    '[
        {"step": "01", "title": "Diagnostic strategique", "description": "Analyse approfondie de votre positionnement"},
        {"step": "02", "title": "Atelier de co-construction", "description": "Elaboration collaborative de la strategie"},
        {"step": "03", "title": "Plan d''action detaille", "description": "Definition des initiatives et des echeances"},
        {"step": "04", "title": "Suivi mensuel", "description": "Accompagnement et ajustements reguliers"}
    ]'::JSONB,
    ARRAY['Diagnostic strategique et financier', 'Elaboration de business plans', 'Tableaux de bord et indicateurs de performance', 'Conseil en gestion et organisation']
FROM services s WHERE s.slug = 'conseil-strategique'
ON CONFLICT (service_id, language) DO NOTHING;

-- Service 5: Formation et renforcement de capacites
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('formation', 'GraduationCap', 'active', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Formation et renforcement de capacites',
    'Programmes de formation sur mesure en comptabilite, gestion, fiscalite et entrepreneuriat pour vos equipes.',
    'Nos programmes de formation pratiques couvrent la comptabilite, la fiscalite, la gestion et l''entrepreneuriat. Formations en presentiel et en ligne disponibles.',
    ARRAY['Manque de competences internes', 'Formation trop theorique', 'Besoin de montee en competence rapide'],
    'Des formateurs praticiens, des cas concrets et des supports pedagogiques adaptes au contexte africain.',
    '[
        {"step": "01", "title": "Identification des besoins", "description": "Evaluation des ecarts de competences"},
        {"step": "02", "title": "Conception du programme", "description": "Developpement de contenus sur mesure"},
        {"step": "03", "title": "Animation", "description": "Sessions interactives et pratiques"},
        {"step": "04", "title": "Evaluation des acquis", "description": "Mesure de l''impact et certification"}
    ]'::JSONB,
    ARRAY['Formation en comptabilite et gestion', 'Seminaires de fiscalite pratique', 'Ateliers entrepreneuriat et creation d''entreprise', 'Formations sur mesure en entreprise']
FROM services s WHERE s.slug = 'formation'
ON CONFLICT (service_id, language) DO NOTHING;

-- Service 6: Co-working & Domiciliation
INSERT INTO services (slug, icon_name, status, order_index)
VALUES ('coworking-domiciliation', 'MapPin', 'active', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_translations (service_id, language, title, short_description, full_description, problematics, value_proposition, process_steps, features)
SELECT
    s.id,
    'fr',
    'Co-working & Domiciliation d''entreprise',
    'Espaces de travail modernes, domiciliation commerciale et accompagnement entrepreneurial au coeur d''Abidjan.',
    'Beneficiez d''un espace de travail professionnel au coeur du Plateau et d''un service de domiciliation commerciale pour legitimer votre presence a Abidjan.',
    ARRAY['Pas de bureau professionnel', 'Besoin d''une adresse commerciale', 'Environnement de travail isole', 'Cout d''un bureau trop eleve'],
    'Un espace moderne, une communaute d''entrepreneurs et un accompagnement professionnel integre — tout ce dont vous avez besoin pour vous concentrer sur votre coeur de metier.',
    '[
        {"step": "01", "title": "Visite des locaux", "description": "Decouverte de nos espaces de travail"},
        {"step": "02", "title": "Choix de la formule", "description": "Selection selon vos besoins"},
        {"step": "03", "title": "Contractualisation", "description": "Signature et formalites"},
        {"step": "04", "title": "Installation", "description": "Mise a disposition et accompagnement"}
    ]'::JSONB,
    ARRAY['Bureaux individuels et espaces partages', 'Salle de reunion et espace detente', 'Domiciliation commerciale avec reception du courrier', 'Accompagnement entrepreneurial inclus']
FROM services s WHERE s.slug = 'coworking-domiciliation'
ON CONFLICT (service_id, language) DO NOTHING;
