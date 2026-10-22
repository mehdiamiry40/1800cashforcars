// Ipswich City Council locality list, grouped by division.
// Division numbers stay off the page. "Ipswich" replaces the old "Ipswich Central" label.
export const ipswichSuburbGroups: { title: string; suburbs: string[] }[] = [
  {
    title: "Goodna, Redbank and Springfield",
    suburbs: ["Augustine Heights", "Bellbird Park", "Brookwater", "Camira", "Carole Park", "Gailes", "Goodna", "Redbank", "Spring Mountain", "Springfield", "Springfield Central", "Springfield Lakes"],
  },
  {
    title: "Central Ipswich",
    suburbs: ["Basin Pocket", "Booval", "Bundamba", "Coalfalls", "Collingwood Park", "Dinmore", "East Ipswich", "Eastern Heights", "Ebbw Vale", "Ipswich", "Leichhardt", "New Chum", "Newtown", "North Booval", "One Mile", "Riverview", "Sadliers Crossing", "Silkstone", "West Ipswich", "Woodend", "Wulkuraka"],
  },
  {
    title: "Ripley Valley and the south-west",
    suburbs: ["Blackstone", "Calvert", "Deebing Heights", "Ebenezer", "Flinders View", "Goolman", "Grandchester", "Jeebropilly", "Lower Mount Walker", "Mount Forbes", "Mount Mort", "Mount Walker West", "Mutdapilly", "Peak Crossing", "Purga", "Raceview", "Redbank Plains", "Ripley", "South Ripley", "Swanbank", "White Rock", "Willowbank"],
  },
  {
    title: "North Ipswich, Rosewood and Marburg",
    suburbs: ["Amberley", "Ashwell", "Barellan Point", "Blacksoil", "Brassall", "Churchill", "Chuwar", "Haigslea", "Ironbark", "Karalee", "Karrabin", "Lanefield", "Marburg", "Moores Pocket", "Mount Marrow", "Muirlea", "North Ipswich", "North Tivoli", "Pine Mountain", "Rosewood", "Tallegalla", "Thagoona", "The Bluff", "Tivoli", "Walloon", "Woolshed", "Yamanto"],
  },
];

export const ipswichSuburbs = ipswichSuburbGroups.flatMap((group) => group.suburbs);
