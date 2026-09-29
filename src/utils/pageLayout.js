export const getPageBreaks = (totalHeight, pageHeight, protectedRanges) => {
  const breaks = [];
  const minSlice = pageHeight * 0.5;
  let sourceY = 0;

  while (sourceY + pageHeight < totalHeight) {
    const proposedEnd = sourceY + pageHeight;
    let endY = proposedEnd;

    for (const [rangeStart, rangeEnd] of protectedRanges) {
      if (proposedEnd <= rangeStart || proposedEnd >= rangeEnd) continue;

      const beforeRange = rangeStart - sourceY;
      const afterRange = rangeEnd - sourceY;
      if (beforeRange >= minSlice) {
        endY = rangeStart;
      } else if (afterRange <= pageHeight) {
        endY = rangeEnd;
      }
      break;
    }

    if (endY <= sourceY) endY = proposedEnd;
    breaks.push(endY);
    sourceY = endY;
  }

  return breaks;
};