"""Generate messages/fr.json and messages/ar.json from en.json + translation overrides.
Run: python3 scripts/build_messages.py  (re-run after editing en.json or the tr_*.py files)."""
import copy, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from tr_fr import FR, CEMENT_FR
from tr_ar import AR, CEMENT_AR

ROOT = os.path.join(os.path.dirname(__file__), "..", "messages")
en = json.load(open(os.path.join(ROOT, "en.json"), encoding="utf-8"))

PH = {
  "fr": {"overview": "[Description détaillée — composition ou procédé de production, contrôles qualité, stockage et manutention avant expédition.]",
         "facts": {"moq": "[XX] tonnes", "capacity": "[XX 000] t / mois", "lead": "[X–X] semaines", "packaging": "[Vrac / Sacs]"},
         "specs": [["[Paramètre 01]", "[Valeur]", "[Norme]"], ["[Paramètre 02]", "[Valeur]", "[Norme]"], ["[Paramètre 03]", "[Valeur]", "[Norme]"]],
         "grades": [["[Qualité A]", "[Courte description]", "[Usage]"], ["[Qualité B]", "[Courte description]", "[Usage]"], ["[Type C]", "[Courte description]", "[Usage]"]],
         "packaging": [["[Vrac]", "[Méthode de chargement et mode d'expédition]"], ["[Sacs — XX kg]", "[Palettisé / quantité par conteneur]"], ["[Big-bags — X t]", "[Quantité par conteneur]"]],
         "applications": ["[Application 01]", "[Application 02]", "[Application 03]"],
         "certs": [["[Certificat / norme]", "[Organisme] — le cas échéant"], ["[Rapport d'essai / CoA]", "[Disponible sur demande — à confirmer]"]]},
  "ar": {"overview": "[وصف تفصيلي — التركيب أو طريقة الإنتاج، ومراقبة الجودة، والتخزين والمناولة قبل الشحن.]",
         "facts": {"moq": "[XX] طن", "capacity": "[XX,000] طن / شهرياً", "lead": "[X–X] أسابيع", "packaging": "[سائب / أكياس]"},
         "specs": [["[المعيار 01]", "[القيمة]", "[المواصفة]"], ["[المعيار 02]", "[القيمة]", "[المواصفة]"], ["[المعيار 03]", "[القيمة]", "[المواصفة]"]],
         "grades": [["[الدرجة A]", "[وصف مختصر]", "[الاستخدام]"], ["[الدرجة B]", "[وصف مختصر]", "[الاستخدام]"], ["[النوع C]", "[وصف مختصر]", "[الاستخدام]"]],
         "packaging": [["[سائب]", "[طريقة التحميل وأسلوب الشحن]"], ["[أكياس — XX كجم]", "[على منصات / الكمية لكل حاوية]"], ["[أكياس جامبو — X طن]", "[الكمية لكل حاوية]"]],
         "applications": ["[الاستخدام 01]", "[الاستخدام 02]", "[الاستخدام 03]"],
         "certs": [["[الشهادة / المواصفة]", "[الجهة المانحة] — إن وجدت"], ["[تقرير اختبار / شهادة تحليل]", "[متاح عند الطلب — للتأكيد]"]]},
}

def put(d, path, value):
    keys = path.split(".")
    # product slugs contain '-' only, so '.' splitting is safe
    for k in keys[:-1]:
        d = d[k]
    if keys[-1] not in d:
        raise KeyError(path)
    d[keys[-1]] = value

for lang, over, cement in (("fr", FR, CEMENT_FR), ("ar", AR, CEMENT_AR)):
    m = copy.deepcopy(en)
    for path, value in over.items():
        put(m, path, value)
    for slug, item in m["products"]["items"].items():
        item["detail"] = copy.deepcopy(PH[lang])
    cd = m["products"]["items"]["cement"]["detail"]
    cd.update(copy.deepcopy(cement))
    with open(os.path.join(ROOT, f"{lang}.json"), "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote", lang)
