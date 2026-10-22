// Logan City Council suburb list, grouped by division clusters.
// Division numbers stay out of the page. Tamborine is only partly in Logan.
export const loganSuburbGroups: { title: string; suburbs: string[] }[] = [
  {
    title: "North Logan",
    suburbs: ["Daisy Hill", "Kingston", "Logan Central", "Priestdale", "Rochedale South", "Slacks Creek", "Springwood", "Underwood", "Woodridge"],
  },
  {
    title: "West Logan",
    suburbs: ["Berrinba", "Boronia Heights", "Browns Plains", "Crestmead", "Forestdale", "Heritage Park", "Hillcrest", "Logan Reserve", "Marsden", "Park Ridge", "Park Ridge South", "Regents Park", "Waterford West"],
  },
  {
    title: "East Logan and the Beenleigh side",
    suburbs: ["Bahrs Scrub", "Beenleigh", "Bethania", "Carbrook", "Cornubia", "Eagleby", "Edens Landing", "Holmview", "Loganholme", "Loganlea", "Meadowbrook", "Mount Warren Park", "Shailer Park", "Tanah Merah"],
  },
  {
    title: "South and semi-rural Logan",
    suburbs: ["Bannockburn", "Belivah", "Buccan", "Cedar Creek", "Cedar Grove", "Cedar Vale", "Chambers Flat", "Flagstone", "Flinders Lakes", "Glenlogan", "Greenbank", "Jimboomba", "Kagaru", "Logan Village", "Lyons", "Monarch Glen", "Mundoolun", "Munruben", "New Beith", "North Maclean", "Riverbend", "Silverbark Ridge", "South Maclean", "Stockleigh", "Tamborine", "Undullah", "Veresdale", "Veresdale Scrub", "Waterford", "Windaroo", "Wolffdene", "Woodhill", "Yarrabilba"],
  },
];

export const loganSuburbs = loganSuburbGroups.flatMap((group) => group.suburbs);

export function loganSuburbLabel(name: string) {
  return name === "Tamborine" ? "Tamborine (Logan side)" : name;
}
