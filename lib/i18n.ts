export type Lang = "de" | "en";

export const LANGS: Lang[] = ["de", "en"];

type Dict = Record<string, string>;

export const dictionaries: Record<Lang, Dict> = {
  de: {
    "brand": "Mental Guide",
    "tagline": "Dein Begleiter für ein gesünderes Leben",

    "nav.home": "Start",
    "nav.plan": "Mein Plan",
    "lang.label": "Sprache",

    "home.heroTitle": "Schritt für Schritt zu einem gesünderen Alltag",
    "home.heroSubtitle": "Beantworte ein paar kurze Fragen und erhalte einen persönlichen Wochenplan – zum Ausdrucken oder online abhaken.",
    "home.start": "Plan erstellen",
    "home.openPlan": "Bestehenden Plan öffnen",
    "home.chooseArea": "Wähle einen Bereich",
    "home.area.phone.title": "Handynutzung",
    "home.area.phone.desc": "Nutze dein Handy bewusster – weniger morgens, abends und nach der Arbeit.",
    "home.area.nutrition.title": "Ernährung",
    "home.area.movement.title": "Bewegung",
    "home.area.sleep.title": "Schlaf",
    "home.area.comingSoon": "Bald verfügbar",

    "q.title": "Handynutzung – ein paar Fragen",
    "q.subtitle": "So erstellen wir deinen persönlichen Wochenplan.",
    "q.step": "Schritt {n} von {total}",
    "q.wake.label": "Wann stehst du morgens auf?",
    "q.wake.help": "Empfehlung: Nutze dein Handy erst 1 Stunde nach dem Aufstehen.",
    "q.firstUseInfo": "Erste Handynutzung frühestens um {time}.",
    "q.most.label": "Wofür nutzt du dein Handy am meisten?",
    "q.most.help": "Z. B. Social Media, KI-Apps, Nachrichten, Spiele …",
    "q.most.placeholder": "z. B. KI-Apps",
    "q.stop.label": "Wann hörst du auf zu arbeiten?",
    "q.stop.help": "Danach machst du Pause von deiner Haupt-Handyaktivität.",
    "q.custom.label": "Eigene Gewohnheiten (optional)",
    "q.custom.help": "Füge persönliche Ziele hinzu, z. B. Laufen, Boxen, Spaziergang.",
    "q.custom.placeholder": "z. B. Laufen",
    "q.custom.add": "Hinzufügen",
    "q.custom.remove": "Entfernen",
    "q.custom.none": "Noch keine eigenen Gewohnheiten.",
    "q.back": "Zurück",
    "q.next": "Weiter",
    "q.generate": "Wochenplan erstellen",
    "q.validation.required": "Bitte fülle dieses Feld aus.",

    "plan.title": "Wochenplan: Handynutzung",
    "plan.week": "Woche",
    "plan.prevWeek": "Vorherige Woche",
    "plan.nextWeek": "Nächste Woche",
    "plan.thisWeek": "Diese Woche",
    "plan.summary.title": "Deine Eckdaten",
    "plan.summary.wake": "Aufstehen",
    "plan.summary.firstUse": "Erste Handynutzung",
    "plan.summary.activity": "Haupt-Aktivität",
    "plan.summary.stopWork": "Arbeitsende",
    "plan.col.habit": "Gewohnheit",
    "plan.habit.firstUse": "1. Handynutzung (Ziel: {time})",
    "plan.habit.stopActivity": "Ab {time} kein/keine {activity}",
    "plan.habit.noNightPhone": "Abends kein Handy vor dem Schlafen",
    "plan.habit.analogAlarm": "Wecker analog genutzt (kein Handy als Wecker)",
    "plan.legend": "Tipp: Trage bei der ersten Handynutzung die tatsächliche Uhrzeit ein und hake erreichte Ziele ab.",
    "plan.download": "Als PDF herunterladen",
    "plan.print": "Drucken",
    "plan.edit": "Antworten ändern",
    "plan.reset": "Plan zurücksetzen",
    "plan.reset.confirm": "Wirklich alle Antworten und Einträge löschen?",
    "plan.saved": "Automatisch gespeichert",
    "plan.noPlan": "Noch kein Plan vorhanden.",
    "plan.createFirst": "Jetzt Plan erstellen",
    "plan.addCustom": "Gewohnheit hinzufügen",

    "pdf.markInstructions": "Hake jeden Tag deine erreichten Ziele ab.",
  },
  en: {
    "brand": "Mental Guide",
    "tagline": "Your guide to a healthier life",

    "nav.home": "Start",
    "nav.plan": "My plan",
    "lang.label": "Language",

    "home.heroTitle": "Step by step to a healthier daily routine",
    "home.heroSubtitle": "Answer a few short questions and get a personal weekly plan – print it out or check it off online.",
    "home.start": "Create your plan",
    "home.openPlan": "Open existing plan",
    "home.chooseArea": "Choose an area",
    "home.area.phone.title": "Phone usage",
    "home.area.phone.desc": "Use your phone more mindfully – less in the morning, evening, and after work.",
    "home.area.nutrition.title": "Nutrition",
    "home.area.movement.title": "Movement",
    "home.area.sleep.title": "Sleep",
    "home.area.comingSoon": "Coming soon",

    "q.title": "Phone usage – a few questions",
    "q.subtitle": "This is how we build your personal weekly plan.",
    "q.step": "Step {n} of {total}",
    "q.wake.label": "When do you get up in the morning?",
    "q.wake.help": "Recommendation: use your phone only 1 hour after getting up.",
    "q.firstUseInfo": "First phone use at the earliest at {time}.",
    "q.most.label": "What do you use your phone most for?",
    "q.most.help": "E.g. social media, AI apps, messages, games …",
    "q.most.placeholder": "e.g. AI apps",
    "q.stop.label": "When do you stop working?",
    "q.stop.help": "After this you take a break from your main phone activity.",
    "q.custom.label": "Your own habits (optional)",
    "q.custom.help": "Add personal goals, e.g. running, boxing, a walk.",
    "q.custom.placeholder": "e.g. Running",
    "q.custom.add": "Add",
    "q.custom.remove": "Remove",
    "q.custom.none": "No custom habits yet.",
    "q.back": "Back",
    "q.next": "Next",
    "q.generate": "Create weekly plan",
    "q.validation.required": "Please fill in this field.",

    "plan.title": "Weekly plan: Phone usage",
    "plan.week": "Week",
    "plan.prevWeek": "Previous week",
    "plan.nextWeek": "Next week",
    "plan.thisWeek": "This week",
    "plan.summary.title": "Your key data",
    "plan.summary.wake": "Wake up",
    "plan.summary.firstUse": "First phone use",
    "plan.summary.activity": "Main activity",
    "plan.summary.stopWork": "Stop working",
    "plan.col.habit": "Habit",
    "plan.habit.firstUse": "1. Phone use (target: {time})",
    "plan.habit.stopActivity": "No {activity} after {time}",
    "plan.habit.noNightPhone": "No phone at night before sleeping",
    "plan.habit.analogAlarm": "Used analog alarm (no phone as alarm)",
    "plan.legend": "Tip: write the actual time of your first phone use and tick off the goals you reached.",
    "plan.download": "Download as PDF",
    "plan.print": "Print",
    "plan.edit": "Change answers",
    "plan.reset": "Reset plan",
    "plan.reset.confirm": "Really delete all answers and entries?",
    "plan.saved": "Saved automatically",
    "plan.noPlan": "No plan yet.",
    "plan.createFirst": "Create a plan now",
    "plan.addCustom": "Add habit",

    "pdf.markInstructions": "Tick off the goals you reached each day.",
  },
};

export const dayKeys = ["mon", "tue", "wed", "thu", "fri"] as const;

export const dayNames: Record<Lang, string[]> = {
  de: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
  en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
};

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  let value = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replaceAll(`{${k}}`, String(v));
    }
  }
  return value;
}
