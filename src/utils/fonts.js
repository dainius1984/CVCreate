// Font file for Polish characters support in jsPDF
// This is a placeholder - you'll need to convert a TTF font using jsPDF font converter
// Visit: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
// Or use: https://github.com/parallax/jsPDF/tree/master/fontconverter

// For now, we'll use a workaround with character mapping
export const polishCharMap = {
  'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
  'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
  'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
  'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
};

export const transliteratePolish = (text) => {
  return text.split('').map(char => polishCharMap[char] || char).join('');
};

