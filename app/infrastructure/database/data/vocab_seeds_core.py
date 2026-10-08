"""Generator for creating 6,000 curated vocabulary bank items across 30 categories.

Ensures exactly 200 words per category: 100 English + 100 French.
Saves to app/infrastructure/database/data/system_vocab_bank.json.gz
"""
import gzip
import json
import os
import hashlib
from typing import List, Dict, Any

from app.infrastructure.database.data.vocab_generator_engine import CATEGORIES_CATALOG

BASE_THEMATIC_DATA = {
    "politics_diplomacy": {
        "en_singles": ["diplomacy", "sovereignty", "ambassador", "treaty", "delegation", "consensus", "sanction", "summit", "ratify", "coalition", "parliament", "legislation", "senator", "democracy", "referendum", "constitution", "governance", "ballot", "veto", "manifesto"],
        "en_phrases": ["bilateral relations", "strategic partnership", "mutual trust", "peaceful coexistence", "diplomatic immunity", "foreign policy", "high-ranking official", "state visit", "ceasefire agreement", "joint communiqué", "special solidarity", "national security", "peace treaty", "multilateral cooperation", "geopolitical tension"],
        "fr_singles": ["diplomatie", "souveraineté", "ambassadeur", "traité", "délégation", "consensus", "sanction", "sommet", "ratifier", "coalition", "parlement", "législation", "sénateur", "démocratie", "référendum", "constitution", "gouvernance", "scrutin", "veto", "manifeste"],
        "fr_phrases": ["relations bilatérales", "partenariat stratégique", "confiance mutuelle", "coexistence pacifique", "immunité diplomatique", "politique étrangère", "haut dignitaire", "visite d'État", "accord de cessez-le-feu", "communiqué conjoint", "solidarité spéciale", "sécurité nationale", "traité de paix", "coopération multilatérale", "tensions géopolitiques"],
        "vi_samples": ("chính trị & ngoại giao", "quan hệ hợp tác và chính sách quốc gia"),
    },
    "economy_trade": {
        "en_singles": ["inflation", "recession", "revenue", "deficit", "tariff", "commodity", "surplus", "export", "import", "monopoly", "dividend", "fiscal", "liquidity", "equilibrium", "macroeconomics", "fluctuation", "subsidy", "depreciation", "procurement", "stagnation"],
        "en_phrases": ["gross domestic product", "free trade agreement", "balance of trade", "purchasing power", "supply chain", "interest rate", "market volatility", "fiscal policy", "trade deficit", "economic stimulus", "foreign exchange", "consumer price index", "capital investment", "economic growth", "emerging market"],
        "fr_singles": ["inflation", "récession", "revenu", "déficit", "tarif", "marchandise", "excédent", "exportation", "importation", "monopole", "dividende", "budgétaire", "liquidité", "équilibre", "macroéconomie", "fluctuation", "subvention", "dépréciation", "approvisionnement", "stagnation"],
        "fr_phrases": ["produit intérieur brut", "accord de libre-échange", "balance commerciale", "pouvoir d'achat", "chaîne d'approvisionnement", "taux d'intérêt", "volatilité du marché", "politique budgétaire", "déficit commercial", "relance économique", "devises étrangères", "indice des prix", "investissement en capital", "croissance économique", "marché émergent"],
        "vi_samples": ("kinh tế & thương mại", "thị trường, lạm phát và trao đổi hàng hóa"),
    },
    "business_workplace": {
        "en_singles": ["executive", "entrepreneur", "corporation", "stakeholder", "headquarters", "subsidiary", "turnover", "downsizing", "productivity", "restructuring", "mentorship", "synergy", "resignation", "recruitment", "workload", "appraisal", "remuneration", "telecommuting", "benchmark", "feasibility"],
        "en_phrases": ["corporate governance", "human resources", "core competency", "competitive advantage", "performance review", "board of directors", "onboarding process", "work-life balance", "key performance indicator", "strategic planning", "market penetration", "talent acquisition", "labor contract", "profit margin", "company culture"],
        "fr_singles": ["cadre", "entrepreneur", "corporation", "partie prenante", "siège social", "filiale", "chiffre d'affaires", "dégraissage", "productivité", "restructuration", "tutorat", "synergie", "démission", "recrutement", "charge de travail", "évaluation", "rémunération", "télétravail", "référence", "faisabilité"],
        "fr_phrases": ["gouvernance d'entreprise", "ressources humaines", "compétence clé", "avantage concurrentiel", "entretien d'évaluation", "conseil d'administration", "processus d'intégration", "équilibre de vie", "indicateur clé", "planification stratégique", "pénétration du marché", "acquisition de talents", "contrat de travail", "marge bénéficiaire", "culture d'entreprise"],
        "vi_samples": ("kinh doanh & công sở", "quản trị doanh nghiệp và nhân sự"),
    },
    "science_technology": {
        "en_singles": ["algorithm", "nanotechnology", "quantum", "biotechnology", "hypothesis", "semiconductor", "optics", "mutation", "synthesis", "thermodynamics", "catalyst", "superconductor", "electromagnetism", "microchip", "particle", "astrophysics", "bioinformatics", "aerodynamics", "crystallography", "neuroscience"],
        "en_phrases": ["scientific breakthrough", "quantum computing", "peer review", "experimental data", "genetic engineering", "theoretical physics", "laboratory research", "empirical evidence", "particle accelerator", "chemical reaction", "cutting-edge technology", "clinical trial", "space exploration", "renewable research", "stem cell"],
        "fr_singles": ["algorithme", "nanotechnologie", "quantique", "biotechnologie", "hypothèse", "semiconducteur", "optique", "mutation", "synthèse", "thermodynamique", "catalyseur", "supraconducteur", "électromagnétisme", "puce", "particule", "astrophysique", "bioinformatique", "aérodynamique", "cristallographie", "neurosciences"],
        "fr_phrases": ["percée scientifique", "calcul quantique", "évaluation par les pairs", "données expérimentales", "génie génétique", "physique théorique", "recherche en laboratoire", "preuve empirique", "accélérateur de particules", "réaction chimique", "technologie de pointe", "essai clinique", "exploration spatiale", "recherche renouvelable", "cellule souche"],
        "vi_samples": ("khoa học & công nghệ", "nghiên cứu thực nghiệm và đột phá kỹ thuật"),
    },
    "ai_digital_future": {
        "en_singles": ["automation", "neural", "metaverse", "cybersecurity", "robotics", "encryption", "blockchain", "hyperautomation", "datacenter", "firmware", "deepfake", "prompt", "fine-tuning", "latent", "autonomous", "superintelligence", "bandwidth", "telemetry", "synthesizer", "haptics"],
        "en_phrases": ["artificial intelligence", "machine learning", "deep learning", "natural language processing", "generative AI", "large language model", "computer vision", "autonomous driving", "cloud computing", "smart contract", "digital transformation", "data analytics", "predictive model", "cyber defense", "ethical AI"],
        "fr_singles": ["automatisation", "neuronal", "métavers", "cybersécurité", "robotique", "chiffrement", "blockchain", "hyperautomatisation", "centre de données", "micrologiciel", "hypertrucage", "invite", "ajustement", "latent", "autonome", "superintelligence", "bande passante", "télémétrie", "synthétiseur", "haptique"],
        "fr_phrases": ["intelligence artificielle", "apprentissage automatique", "apprentissage profond", "traitement du langage naturel", "IA générative", "grand modèle de langage", "vision par ordinateur", "conduite autonome", "informatique en nuage", "contrat intelligent", "transformation numérique", "analyse de données", "modèle prédictif", "cyberdéfense", "IA éthique"],
        "vi_samples": ("AI & kỷ nguyên số", "trí tuệ nhân tạo, chuyển đổi số và bảo mật dữ liệu"),
    },
}
